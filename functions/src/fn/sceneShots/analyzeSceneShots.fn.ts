/** --------------------------
 *      ANALYZE SCENE SHOTS
 * ---------------------------
 *  Inbound scene video
 *  `gs://${SCENE_VIDEOS_CLOUD_BUCKET_NAME}/user/${userId}/video/${videoId}/scene/${sceneId}/${sceneId}.json`
 *
 *  Outbound scene annotations
 *  `gs://${METADATA_VIDEOS_CLOUD_BUCKET_NAME}/user/${userId}/video/${videoId}/scene/${sceneId}/${sceneId}.json`
 */

import admin from "firebase-admin";
import * as functions from "firebase-functions";
import video from "@google-cloud/video-intelligence";
import path from "path";
import os from "os";
import {
  METADATA_VIDEOS_CLOUD_BUCKET_NAME,
  SCENE_VIDEOS_CLOUD_BUCKET_NAME,
  VIDEO_INTELLIGENCE_SERVICES,
} from "@constants/constants";
import { extractUserIdAndVideoId } from "@api/helper.api";

const analyzeSceneShots = functions.storage
  .bucket(SCENE_VIDEOS_CLOUD_BUCKET_NAME)
  .object()
  .onFinalize(async (object) => {
    const filePath = object?.name || "";
    if (filePath) {
      // Temporarily download the video.
      const tempVideoPath = path.join(os.tmpdir(), "video");
      await admin
        .storage()
        .bucket(object.bucket)
        .file(filePath)
        .download({ destination: tempVideoPath });
      const { videoId, userId, sceneId } = extractUserIdAndVideoId(filePath);

      // Generate thumbnails
      // 1. extractPreviewImage()
      // 2. save to cloud storage
      // 3. save to firestore entry based on sceneId

      // Specify LABEL_DETECTION
      const request = {
        inputUri: `gs://${filePath}`,
        outputUri: `gs://${METADATA_VIDEOS_CLOUD_BUCKET_NAME}/user/${userId}/video/${videoId}/scene/${sceneId}/${sceneId}.json`,
        features: [VIDEO_INTELLIGENCE_SERVICES.LABEL_DETECTION],
      };
      // annotate the video
      const client = new video.v1.VideoIntelligenceServiceClient();
      const [operation] = await client.annotateVideo(request);
      functions.logger.log("--> completed operation: ", operation);
    }
  });

export default analyzeSceneShots;
