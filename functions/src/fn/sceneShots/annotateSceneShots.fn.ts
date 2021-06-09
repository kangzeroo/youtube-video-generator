/** --------------------------
 *      ANNOTATE SCENE SHOTS
 * ---------------------------
 * This function triggers when a raw YouTube video is saved to its cloud bucket
 * We annotate the video with timeranges of when scenes change
 * Annotations get saved to another cloud bucket where another cloud function handles snipping the video into its smaller scenes
 *
 * `gs://${SHOT_CHANGE_ANNOTATIONS_CLOUD_BUCKET}/user/${userId}/video/${videoId}/${videoId}.json`
 */

import * as functions from "firebase-functions";
import video from "@google-cloud/video-intelligence";
import {
  extractRelevantIds,
  checkIfValidVideoFormat,
  checkIfValidVideoLength,
} from "@api/helper.api";
import {
  RAW_VIDEOS_CLOUD_BUCKET,
  VIDEO_INTELLIGENCE_SERVICES,
  SHOT_CHANGE_ANNOTATIONS_CLOUD_BUCKET,
} from "@constants/constants";

const log = functions.logger.log;

const annotateSceneShots = functions.storage
  .bucket(RAW_VIDEOS_CLOUD_BUCKET)
  .object()
  .onFinalize(async (object) => {
    if (object?.name) {
      log("1. annotateSceneShots()");
      const filePath = object?.name;
      log("1b. filePat", filePath);
      // only allow MP4 videos less than 20 mins long
      const validVideoLength = await checkIfValidVideoLength(filePath);
      if (filePath && checkIfValidVideoFormat(filePath) && validVideoLength) {
        log("2. Requesting SHOT_CHANGE_DETECTION");
        const { videoId, userId } = extractRelevantIds(filePath);
        log(`2b. relevantIds: videoId=${videoId}, userId=${userId}`);
        // specify SHOT_CHANGE_DETECTION
        const outputUri = `gs://${SHOT_CHANGE_ANNOTATIONS_CLOUD_BUCKET}/user/${userId}/video/${videoId}/${videoId}.json`;
        const request = {
          inputUri: `gs://${filePath}`,
          outputUri,
          features: [VIDEO_INTELLIGENCE_SERVICES.SHOT_CHANGE_DETECTION],
        };
        log(`2c. outputUri: ${outputUri}`);
        // annotate the video
        const client = new video.v1.VideoIntelligenceServiceClient();
        const [operation] = await client.annotateVideo(request);
        log("3. Completed operation: ", operation);
      }
    }
  });

export default annotateSceneShots;
