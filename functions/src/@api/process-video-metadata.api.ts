import admin from "firebase-admin";
import * as functions from "firebase-functions";
import fs from "fs";
import path from "path";
import os from "os";
import { PLACEHOLDER_FILENAME } from "@constants/constants";
import { save as algoliaSave } from "@api/algolia.api";

type TObjectMetadata = functions.storage.ObjectMetadata;
type TJsonBlob = any;
type TAnnotation = any;
type TSegment = any;
type TTranscription = any;
type TWord = any;

/* Functions for parsing Video Intelligence JSON Output */
const parseTranscript = (jsonBlob: TJsonBlob) => {
  return jsonBlob.annotation_results
    .filter((annotation: any) => {
      // Ignore annotations without speech transcriptions
      return annotation.speech_transcriptions;
    })
    .flatMap((annotation: TAnnotation) => {
      // Sometimes transcription options are empty, so remove those
      return annotation.speech_transcriptions
        .filter((transcription: TTranscription) => {
          return Object.keys(transcription.alternatives[0]).length;
        })
        .map((transcription: TTranscription) => {
          // We always want the first transcription alternative
          const alternative = transcription.alternatives[0];
          // Streamline the json so we have less to store
          return {
            text: null,
            entity: null,
            transcript: alternative.transcript,
            confidence: alternative.confidence,
            start_time: alternative.words[0].start_time,
            words: alternative.words.map((word: TWord) => {
              return {
                start_time: word.start_time.seconds || 0,
                end_time: word.end_time.seconds,
                word: word.word,
              };
            }),
          };
        });
    });
};

/* Image labels (i.e. snow, baby laughing, bridal shower)*/
const parseShotLabelAnnotations = (jsonBlob: TJsonBlob) => {
  return jsonBlob.annotation_results
    .filter((annotation: TAnnotation) => {
      // Ignore annotations without shot label annotations
      return annotation.shot_label_annotations;
    })
    .flatMap((annotation: TAnnotation) => {
      return annotation.shot_label_annotations.flatMap(
        (annotation: TAnnotation) => {
          return annotation.segments.flatMap((segment: TSegment) => {
            return {
              text: null,
              transcript: null,
              entity: annotation.entity.description,
              confidence: segment.confidence,
              start_time: segment.segment.start_time_offset.seconds || 0,
              end_time: segment.segment.end_time_offset.seconds,
            };
          });
        }
      );
    });
};

export const processVideoMetadata = async (
  object: TObjectMetadata
): Promise<void> => {
  const tempFilePath = path.join(os.tmpdir(), "data.json");

  // Locally download the json file created by the vision API
  await admin
    .storage()
    .bucket(object.bucket)
    .file(object.name || `${PLACEHOLDER_FILENAME}.json`)
    .download({ destination: tempFilePath });

  // Files have the format bucket_name/raw-youtube/userId/videoId.mp4
  const userId = object?.name?.split("/")[0] || "";
  const videoId = object?.name?.split("/")[2].split(".")[0] || "";
  const json = JSON.parse(fs.readFileSync(tempFilePath, "utf-8"));

  // Parse annotaitons from output file
  const transcriptJson = parseTranscript(json);
  const shotLabelJason = parseShotLabelAnnotations(json);

  // Store data to searchable Algolia index
  await algoliaSave(userId, videoId, transcriptJson, shotLabelJason);

  // Clean up temporary file
  fs.unlinkSync(tempFilePath);

  // Mark the file as done processing in Firestore
  await admin
    .firestore()
    .collection("users")
    .doc(userId)
    .collection("videos")
    .doc(videoId)
    .update({
      status: "finished",
    });
};
