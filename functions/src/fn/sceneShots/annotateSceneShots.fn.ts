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
  extractUserIdAndVideoId,
  checkIfValidVideoFormat,
  checkIfValidVideoLength,
} from "@api/helper.api";
import {
  RAW_VIDEOS_CLOUD_BUCKET,
  VIDEO_INTELLIGENCE_SERVICES,
  SHOT_CHANGE_ANNOTATIONS_CLOUD_BUCKET,
} from "@constants/constants";

const annotateSceneShots = functions.storage
  .bucket(RAW_VIDEOS_CLOUD_BUCKET)
  .object()
  .onFinalize(async (object) => {
    if (object?.name) {
      const filePath = object?.name;
      // only allow MP4 videos less than 20 mins long
      if (
        filePath &&
        checkIfValidVideoFormat(filePath) &&
        checkIfValidVideoLength(filePath)
      ) {
        const { videoId, userId } = extractUserIdAndVideoId(filePath);
        // specify SHOT_CHANGE_DETECTION
        const request = {
          inputUri: `gs://${filePath}`,
          outputUri: `gs://${SHOT_CHANGE_ANNOTATIONS_CLOUD_BUCKET}/user/${userId}/video/${videoId}/${videoId}.json`,
          features: [VIDEO_INTELLIGENCE_SERVICES.SHOT_CHANGE_DETECTION],
        };
        // annotate the video
        const client = new video.v1.VideoIntelligenceServiceClient();
        const [operation] = await client.annotateVideo(request);
        functions.logger.log("--> completed operation: ", operation);
      }
    }
  });

export default annotateSceneShots;
