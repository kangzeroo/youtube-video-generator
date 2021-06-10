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
import { extractRelevantIds, checkIfValidVideoFormat } from "@api/helper.api";
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
    log("1. annotateSceneShots()");
    log("1b. object: ", object);
    const filePath = object?.name;
    log("1c. filePath: ", filePath);

    if (filePath && checkIfValidVideoFormat(filePath)) {
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
      log(`2c. request: ${request}`);
      // annotate the video
      try {
        const client = new video.v1.VideoIntelligenceServiceClient();
        const [operation] = await client.annotateVideo(request);
        log("3. Completed operation: ", operation);
      } catch (e) {
        log(e);
        log("3. Failed");
        throw Error(e);
      }
    }
    console.log("1d. Invalid file extension");
  });

export default annotateSceneShots;
