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
import {
  generateStorageUrlWithDownloadToken,
  extractRelevantIds,
  sliceIntoChunks,
} from "@api/helper.api";
import camelize from "camelize";
import {
  extractValidTimeranges,
  uploadSceneToBucket,
  saveSceneToFirestore,
  sliceSceneFromVideo,
} from "@api/sceneUploader.api";
import {
  RAW_VIDEOS_CLOUD_BUCKET,
  SHOT_CHANGE_ANNOTATIONS_CLOUD_BUCKET,
  MIN_SCENE_DURATION,
  MAX_SCENE_DURATION,
  SCENE_VIDEOS_CLOUD_BUCKET,
} from "@constants/constants";
import { ISceneTimerange } from "@customTypes/types.spec";

const log = functions.logger.log;
const runtimeOpts = {
  timeoutSeconds: 540,
  memory: "8GB" as "8GB",
};

const saveSceneShots = functions
  .runWith(runtimeOpts)
  .storage.bucket(SHOT_CHANGE_ANNOTATIONS_CLOUD_BUCKET)
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
      // Prepare to locally download the video file
      log("2b. Downloading the video...");
      const videoPath = path.join(os.tmpdir(), "video");
      log("2c. videoPath: ", videoPath);

      // Prepare to locally download the json file created by the vision API
      log("3. Downloading the json annotations...");
      const tempFilePathAnnotations = path.join(os.tmpdir(), "annotations");
      log("3b. annotationsPath: ", tempFilePathAnnotations);

      // Actually download both the video & json in parallel
      await Promise.all([
        // video
        await admin
          .storage()
          .bucket(RAW_VIDEOS_CLOUD_BUCKET)
          .file(videoName)
          .download({ destination: videoPath }),
        // json
        await admin
          .storage()
          .bucket(object.bucket)
          .file(filePath)
          .download({ destination: tempFilePathAnnotations }),
      ]);

      // The json is in snakecase and we must convert to camelCase to be type compatible
      const annotations: protos.google.cloud.videointelligence.v1.AnnotateVideoResponse =
        camelize(JSON.parse(fs.readFileSync(tempFilePathAnnotations, "utf-8")));

      log("4. annotations: ", annotations);
      // Extract only scenes with annotated duration of over 2 seconds
      const validTimeranges = await extractValidTimeranges({
        annotations,
        minSceneDuration: MIN_SCENE_DURATION,
        maxSceneDuration: MAX_SCENE_DURATION,
      });
      log("5. validTimerange: ", validTimeranges);

      log("6. Uploading to cloud bucket... ");
      // upload each valid scene to the right cloud bucket and save reference in firestore
      const totalTimeranges = validTimeranges.length;
      let chunkSize = 1;
      if (totalTimeranges > 100) {
        chunkSize = 4;
      } else if (totalTimeranges > 60) {
        chunkSize = 3;
      } else if (totalTimeranges > 20) {
        chunkSize = 2;
      }
      const chunkTimeranges: ISceneTimerange[][] = sliceIntoChunks(
        validTimeranges,
        chunkSize
      );
      for (const [chunkIndex, chunkedTimerange] of chunkTimeranges.entries()) {
        console.log(
          `Processing chunk timerange ${chunkIndex + 1} of ${
            chunkTimeranges.length
          }`
        );
        await Promise.all(
          chunkedTimerange.map(async (timerange, index) => {
            console.log(`Uploading scene #${index + 1} of ${totalTimeranges}`);
            const { sceneId, scenePath } = await sliceSceneFromVideo(
              videoPath,
              timerange
            );
            const destination = `user/${userId}/video/${videoId}/scene/${sceneId}/${sceneId}.mp4`;
            const { publicUrl } = generateStorageUrlWithDownloadToken(
              SCENE_VIDEOS_CLOUD_BUCKET,
              destination
            );
            // upload both at once - file storage and database
            await Promise.all([
              await uploadSceneToBucket({
                scenePath,
                destination,
              }),
              await saveSceneToFirestore({
                publicUrl,
                sceneId,
                userId,
                videoId,
              }),
            ]);
          })
        ).catch((e) => {
          throw e;
        });
      }
      log("7. Saved all scenes to cloud bucket!");
    }
  });

export default saveSceneShots;
