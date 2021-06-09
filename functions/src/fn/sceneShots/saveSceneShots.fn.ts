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
import { protos } from "@google-cloud/video-intelligence";
import camelize from "camelize";
import { extractUserIdAndVideoId } from "@api/helper.api";
import {
  extractValidScenes,
  uploadSceneToBucket,
} from "@api/sceneUploader.api";
import {
  RAW_VIDEOS_CLOUD_BUCKET,
  SHOT_CHANGE_ANNOTATIONS_CLOUD_BUCKET,
} from "@constants/constants";

const saveSceneShots = functions.storage
  .bucket(SHOT_CHANGE_ANNOTATIONS_CLOUD_BUCKET)
  .object()
  .onFinalize(async (object) => {
    const filePath = object?.name;
    if (filePath) {
      const { videoId, userId, sceneId, videoFileFormat } =
        extractUserIdAndVideoId(filePath);
      if (sceneId) {
        // Get the identifying information
        const videoName = `user/${userId}/video/${videoId}/${videoId}${videoFileFormat}`;
        // Locally download the video file
        const videoPath = path.join(os.tmpdir(), "video");
        await admin
          .storage()
          .bucket(RAW_VIDEOS_CLOUD_BUCKET)
          .file(videoName)
          .download({ destination: videoPath });
        // Locally download the json file created by the vision API
        const tempFilePathAnnotations = path.join(os.tmpdir(), "annotations");
        await admin
          .storage()
          .bucket(object.bucket)
          .file(filePath)
          .download({ destination: tempFilePathAnnotations });
        // The json is in snakecase and we must convert to camelCase to be type compatible
        const annotations: protos.google.cloud.videointelligence.v1.AnnotateVideoResponse =
          camelize(
            JSON.parse(fs.readFileSync(tempFilePathAnnotations, "utf-8"))
          );

        // Extract only scenes with annotated duration of over 2 seconds
        const minSceneDuration = 2;
        const validScenes: protos.google.cloud.videointelligence.v1.VideoSegment[] =
          extractValidScenes({
            annotations,
            minSceneDuration,
          });

        // upload each valid scene to the right cloud bucket
        await Promise.all(
          validScenes.map(async (scene) => {
            return await uploadSceneToBucket(scene, videoPath, sceneId);
          })
        ).catch((e) => {
          throw e;
        });
      }
    }
  });

export default saveSceneShots;