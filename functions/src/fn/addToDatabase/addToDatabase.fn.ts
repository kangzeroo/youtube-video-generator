/** --------------------------
 *      ADD TO DATABASE
 * ---------------------------
 */

import admin from "firebase-admin";
import * as functions from "firebase-functions";
import { protos } from "@google-cloud/video-intelligence";
import path from "path";
import os from "os";
import fs from "fs";
import camelize from "camelize";
import { extractUserIdAndVideoId } from "@api/helper.api";
import { createLabeledScenesForSearch } from "@api/analyze.api";
import { METADATA_VIDEOS_CLOUD_BUCKET } from "@constants/constants";

const addToDatabase = functions.storage
  .bucket(METADATA_VIDEOS_CLOUD_BUCKET)
  .object()
  .onFinalize(async (object) => {
    const filePath = object?.name || "";
    const { videoId, userId, sceneId } = extractUserIdAndVideoId(filePath);
    // Locally download the json file created by the vision API
    if (filePath && sceneId) {
      // locally download the metadata json
      const tempFilePathAnnotations = path.join(os.tmpdir(), "annotations");
      await admin
        .storage()
        .bucket(object.bucket)
        .file(filePath)
        .download({ destination: tempFilePathAnnotations });
      // The json is in snakecase and we must convert to camelCase to be type compatible
      const annotations: protos.google.cloud.videointelligence.v1.AnnotateVideoResponse =
        camelize(JSON.parse(fs.readFileSync(tempFilePathAnnotations, "utf-8")));
      // process the labels & scenes into a queryable schema
      const labeledScenes = createLabeledScenesForSearch(annotations, {
        videoId,
        userId,
        sceneId,
      });
      // upload the labeled scenes to firestore
      admin.firestore().collection("scenes").doc(sceneId).set(
        {
          scenes: labeledScenes,
        },
        { merge: true }
      );
    }
  });

export default addToDatabase;
