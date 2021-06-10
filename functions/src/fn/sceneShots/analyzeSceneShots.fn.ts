/** --------------------------
 *      ANALYZE SCENE SHOTS
 * ---------------------------
 *  Inbound scene video
 *  `gs://${SCENE_VIDEOS_CLOUD_BUCKET}/user/${userId}/video/${videoId}/scene/${sceneId}/${sceneId}.json`
 *
 *  Outbound thumbnails
 *  `gs://${VIDEO_THUMBNAILS_CLOUD_BUCKET}/user/${userId}/video/${videoId}/scene/${sceneId}/thumbnail/thumbnail-${sceneId}.png`
 *
 *  Outbound scene annotations
 *  `gs://${METADATA_VIDEOS_CLOUD_BUCKET}/user/${userId}/video/${videoId}/scene/${sceneId}/${sceneId}.json`
 */

import admin from "firebase-admin";
import * as functions from "firebase-functions";
import video from "@google-cloud/video-intelligence";
import path from "path";
import os from "os";
import fs from "fs";
import {
  METADATA_VIDEOS_CLOUD_BUCKET,
  SCENE_VIDEOS_CLOUD_BUCKET,
  VIDEO_INTELLIGENCE_SERVICES,
  VIDEO_THUMBNAILS_CLOUD_BUCKET,
} from "@constants/constants";
import { extractPreviewImage } from "@api/thumbnail.api";
import { extractRelevantIds } from "@api/helper.api";

const log = functions.logger.log;

const analyzeSceneShots = functions.storage
  .bucket(SCENE_VIDEOS_CLOUD_BUCKET)
  .object()
  .onFinalize(async (object) => {
    log("1. analyzeSceneShots");
    log("1b. object: ", object);
    const filePath = object?.name || "";
    log("1b. filePath: ", filePath);
    if (filePath) {
      // Temporarily download the scene.
      const tempVideoPath = path.join(os.tmpdir(), "scene");
      log("2. tempVideoPath: ", tempVideoPath);
      await admin
        .storage()
        .bucket(object.bucket)
        .file(filePath)
        .download({ destination: tempVideoPath });
      const { videoId, userId, sceneId } = extractRelevantIds(filePath);

      log(
        `2b. relevantIds: videoId=${videoId}, userId=${userId}, sceneId=${sceneId}`
      );
      // Generate thumbnails from scene
      fs.statSync(tempVideoPath);
      const fileNames: string[] = [];
      try {
        const names: string[] = await extractPreviewImage(
          tempVideoPath,
          os.tmpdir()
        );
        names.forEach((n) => fileNames.push(n));
      } catch (err) {
        throw Error(err);
      }
      log(`3. fileNames: ${fileNames}`);
      if (fileNames.length > 0 && sceneId) {
        // save thumbnails to cloud storage
        log("3b. Saving thumbnails to cloud storage...");
        const savedThumbnails = await Promise.all(
          fileNames.map(async (idx, name) => {
            const destination = `user/${userId}/video/${videoId}/scene/${sceneId}/thumbnail/thumbnail-${idx}-${sceneId}.png`;
            await admin
              .storage()
              .bucket(VIDEO_THUMBNAILS_CLOUD_BUCKET)
              .upload(`${os.tmpdir()}/${name}`, {
                destination,
              });
            return destination;
          })
        );
        log("4. Saving thumbnails to firestore...");
        // save thumbnail scene references to firestore
        admin.firestore().collection("scenes").doc(sceneId).set(
          {
            thumbnails: savedThumbnails,
          },
          { merge: true }
        );
        // clean up links
        fs.unlinkSync(tempVideoPath);
        fileNames.forEach((name) => {
          fs.unlinkSync(`${os.tmpdir()}/${name}`);
        });
      } else {
        fs.unlinkSync(tempVideoPath);
        fileNames.forEach((name) => {
          fs.unlinkSync(`${os.tmpdir()}/${name}`);
        });
        throw Error("Failed to generate thumbnails, no names");
      }

      log("4. Annotating LABEL_DETECTION on scene...");
      // Annotate LABEL_DETECTION on scene video
      const outputUri = `gs://${METADATA_VIDEOS_CLOUD_BUCKET}/user/${userId}/video/${videoId}/scene/${sceneId}/${sceneId}.json`;
      const request = {
        inputUri: `gs://${filePath}`,
        outputUri,
        features: [VIDEO_INTELLIGENCE_SERVICES.LABEL_DETECTION],
      };
      log("4b. Uploading to ", outputUri);
      // annotate the scene video
      const client = new video.v1.VideoIntelligenceServiceClient();
      const [operation] = await client.annotateVideo(request);
      functions.logger.log("--> completed operation: ", operation);
    }
  });

export default analyzeSceneShots;
