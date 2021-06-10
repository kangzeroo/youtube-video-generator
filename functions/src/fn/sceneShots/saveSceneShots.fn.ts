/** --------------------------
 *      SAVE SCENE SHOTS
 * ---------------------------
 * This function triggers upon save of a JSON annotation of a raw YouTube video
 * We download the original video and split into 2+ second scenes (based on annotations)
 * Each scene is saved as a separate MP4 to its own cloud bucket
 *
 * `gs://${SHOT_CHANGE_ANNOTATIONS_CLOUD_BUCKET}/user/${userId}/video/${videoId}/${videoId}.json`
 *
 * Note that a lot of compute & memory resources will be used
 * when downloading the video, splitting it into its 100+ scenes, and uploading them to buckets
 * we may need to set the cloud function CPU & Memory high
 */

import * as functions from "firebase-functions";
import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import os from "os";
import { v4 as uuidv4 } from "uuid";
import { protos } from "@google-cloud/video-intelligence";
import camelize from "camelize";
import { extractRelevantIds } from "@api/helper.api";
import {
  extractValidScenes,
  uploadSceneToBucket,
} from "@api/sceneUploader.api";
import {
  RAW_VIDEOS_CLOUD_BUCKET,
  SHOT_CHANGE_ANNOTATIONS_CLOUD_BUCKET,
} from "@constants/constants";

const log = functions.logger.log;

const saveSceneShots = functions.storage
  .bucket(SHOT_CHANGE_ANNOTATIONS_CLOUD_BUCKET)
  .object()
  .onFinalize(async (object) => {
    log("1. saveSceneShots()");
    log("1b. object: ", object);
    const filePath = object?.name;
    log("1b. filePath: ", filePath);
    if (filePath) {
      const { videoId, userId } = extractRelevantIds(filePath);
      log(`2. relevantIds: videoId=${videoId}, userId=${userId}`);
      // Get the identifying information
      const videoName = `user/${userId}/video/${videoId}/${videoId}.mp4`;
      // Locally download the video file
      log("2. Downloading the video...");
      const videoPath = path.join(os.tmpdir(), "video");
      log("2. videoPath: ", videoPath);
      await admin
        .storage()
        .bucket(RAW_VIDEOS_CLOUD_BUCKET)
        .file(videoName)
        .download({ destination: videoPath });
      // Locally download the json file created by the vision API
      log("3. Downloading the json annotations...");
      const tempFilePathAnnotations = path.join(os.tmpdir(), "annotations");
      log("3b. annotationsPath: ", tempFilePathAnnotations);
      await admin
        .storage()
        .bucket(object.bucket)
        .file(filePath)
        .download({ destination: tempFilePathAnnotations });
      // The json is in snakecase and we must convert to camelCase to be type compatible
      const annotations: protos.google.cloud.videointelligence.v1.AnnotateVideoResponse =
        camelize(JSON.parse(fs.readFileSync(tempFilePathAnnotations, "utf-8")));

      log("4. annotations: ", annotations);
      // Extract only scenes with annotated duration of over 2 seconds
      const minSceneDuration = 2;
      const validScenes: protos.google.cloud.videointelligence.v1.VideoSegment[] =
        extractValidScenes({
          annotations,
          minSceneDuration,
        });
      log("5. validScene: ", validScenes);

      log("6. Uploading to cloud bucket... ");
      // upload each valid scene to the right cloud bucket
      await Promise.all(
        validScenes.map(async (scene) => {
          const sceneId = uuidv4();
          return await uploadSceneToBucket(scene, videoPath, sceneId);
        })
      ).catch((e) => {
        throw e;
      });
    }
  });

export default saveSceneShots;
