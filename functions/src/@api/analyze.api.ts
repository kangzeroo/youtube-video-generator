/** --------------------------
 *      ANALYZE VIDEO API
 * ---------------------------
 */

import admin from "firebase-admin";
import * as functions from "firebase-functions";
import video from "@google-cloud/video-intelligence";
import {
  METADATA_VIDEOS_CLOUD_BUCKET_NAME,
  VIDEO_INTELLIGENCE_SERVICES,
} from "@constants/constants";

/* When a video is uploaded to cloud storage, this function
kicks off analysis with the Video Intelligence API, which runs
asynchronously. It also writes some data about the job to
Firestore. The actual metadata end up in another Google Storage Bucket */
export const analyzeVideoVision = async (
  object: functions.storage.ObjectMetadata
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

  const request = {
    inputUri: `gs://${object.bucket}/${object.name}`,
    outputUri: `gs://${METADATA_VIDEOS_CLOUD_BUCKET_NAME}/${userId}/${videoId}/${jsonFile}`,
    features: [
      VIDEO_INTELLIGENCE_SERVICES.LABEL_DETECTION,
      VIDEO_INTELLIGENCE_SERVICES.SPEECH_TRANSCRIPTION,
    ],
    videoContext: videoContext,
  };

  const client = new video.v1.VideoIntelligenceServiceClient();

  // Detects labels in a video
  const [operation] = await client.annotateVideo(request);
  functions.logger.log("operation", operation);

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
      },
      { merge: true }
    );
};
