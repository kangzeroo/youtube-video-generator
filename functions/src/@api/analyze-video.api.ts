import admin from "firebase-admin";
import * as functions from "firebase-functions";
import video, { protos } from "@google-cloud/video-intelligence";
import { METADATA_VIDEOS_CLOUD_BUCKET_NAME } from "@constants/constants";

type TObjectMetadata = functions.storage.ObjectMetadata;

const parseDate = (dateString: string): string | null => {
  //  "._clip-2006-12-29 17;08;05.mp4"
  let year;
  let month;
  let day;
  let hours;
  let seconds;
  let minutes;

  const regExs = [
    /_clip-(\d+)-(\d+)-(\d+) (\d+);(\d+);(\d+)/,
    /(\d+)-(\d+)-(\d+) (\d+)_(\d+)_(\d+)/,
    /(\d+)-(\d+)-(\d+)/,
  ];

  for (let i = 0; i < regExs.length; i++) {
    if (dateString && dateString.match(regExs[i])) {
      [year, month, day, hours, seconds, minutes] = dateString!
        .match(regExs[i])!
        .slice(1);
      break;
    }
  }
  if (!(year && month && day)) {
    functions.logger.log(
      `Could not find regex to match date string: '${dateString}'`
    );
    return null;
  }
  if (hours != null && minutes != null && seconds != null) {
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} EST`;
  }
  return `${year}-${month}-${day}`;
};

/* When a video is uploaded to cloud storage, this function
kicks off analysis with the Video Intelligence API, which runs
asynchronously. It also writes some data about the job to
Firestore. The actual metadata end up in another Google Storage Bucket */
export const analyzeVideoVision = async (
  object: TObjectMetadata
): Promise<void> => {
  functions.logger.log(
    `Got file ${object.name} with content type ${object.contentType}`
  );

  const videoContext = {
    speechTranscriptionConfig: {
      languageCode: "en-US",
      enableAutomaticPunctuation: true,
    },
  };
  // Files have the format bucket_name/raw-youtube/userId/videoId.mp4
  const userId = object?.name?.split("/")[0] || "";
  const videoId = object?.name?.split("/")[2].split(".")[0] || "";
  const jsonFile = `${videoId}.json`;

  const featureList = {
    FEATURE_UNSPECIFIED:
      "FEATURE_UNSPECIFIED" as unknown as protos.google.cloud.videointelligence.v1.Feature,
    LABEL_DETECTION:
      "LABEL_DETECTION" as unknown as protos.google.cloud.videointelligence.v1.Feature,
    SHOT_CHANGE_DETECTION:
      "SHOT_CHANGE_DETECTION" as unknown as protos.google.cloud.videointelligence.v1.Feature,
    EXPLICIT_CONTENT_DETECTION:
      "EXPLICIT_CONTENT_DETECTION" as unknown as protos.google.cloud.videointelligence.v1.Feature,
    FACE_DETECTION:
      "FACE_DETECTION" as unknown as protos.google.cloud.videointelligence.v1.Feature,
    SPEECH_TRANSCRIPTION:
      "SPEECH_TRANSCRIPTION" as unknown as protos.google.cloud.videointelligence.v1.Feature,
    TEXT_DETECTION:
      "TEXT_DETECTION" as unknown as protos.google.cloud.videointelligence.v1.Feature,
    OBJECT_TRACKING:
      "OBJECT_TRACKING" as unknown as protos.google.cloud.videointelligence.v1.Feature,
    LOGO_RECOGNITION:
      "LOGO_RECOGNITION" as unknown as protos.google.cloud.videointelligence.v1.Feature,
    CELEBRITY_RECOGNITION:
      "CELEBRITY_RECOGNITION" as unknown as protos.google.cloud.videointelligence.v1.Feature,
    PERSON_DETECTION:
      "PERSON_DETECTION" as unknown as protos.google.cloud.videointelligence.v1.Feature,
  };
  const request = {
    inputUri: `gs://${object.bucket}/${object.name}`,
    outputUri: `gs://${METADATA_VIDEOS_CLOUD_BUCKET_NAME}/${userId}/${videoId}/${jsonFile}`,
    features: [featureList.LABEL_DETECTION, featureList.SPEECH_TRANSCRIPTION],
    videoContext: videoContext,
  };

  const client = new video.v1.VideoIntelligenceServiceClient();

  // Detects labels in a video
  const [operation] = await client.annotateVideo(request);
  functions.logger.log("operation", operation);

  // If info about the timestamp was passed as metadata, process and
  // save it
  let videoTimestamp = object.metadata ? object.metadata.timestamp : null;
  if (videoTimestamp) {
    // convert to unix timestamp
    videoTimestamp = parseDate(videoTimestamp);
  }

  admin
    .firestore()
    .collection("users")
    .doc(userId)
    .collection("videos")
    .doc(videoId)
    .set(
      {
        operation: operation.name,
        filePath: object.name,
        status: "processing",
        videoTimestamp: videoTimestamp ? videoTimestamp : null,
      },
      { merge: true }
    );
};
