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
import { extractRelevantIds } from "@api/helper.api";
import { createLabeledScenesForSearch, compileLabels } from "@api/analyze.api";
import { METADATA_VIDEOS_CLOUD_BUCKET } from "@constants/constants";

const log = functions.logger.log;

const addToDatabase = functions.storage
  .bucket(METADATA_VIDEOS_CLOUD_BUCKET)
  .object()
  .onFinalize(async (object) => {
    log("1. addToDatabase()");
    log("1b. object: ", object);
    const filePath = object?.name || "";
    log("1b. filePath: ", filePath);
    const { sceneId } = extractRelevantIds(filePath);
    log(`2b. relevantIds: sceneId=${sceneId}`);
    // Locally download the json file created by the vision API
    if (filePath && sceneId) {
      // locally download the metadata json
      log("3. Getting scene annotations");
      const tempFilePathAnnotations = path.join(os.tmpdir(), "annotations");
      await admin
        .storage()
        .bucket(object.bucket)
        .file(filePath)
        .download({ destination: tempFilePathAnnotations });
      // The json is in snakecase and we must convert to camelCase to be type compatible
      const annotations: protos.google.cloud.videointelligence.v1.AnnotateVideoResponse =
        camelize(JSON.parse(fs.readFileSync(tempFilePathAnnotations, "utf-8")));
      log("3b. Annotations: ", annotations);
      // process the labels & scenes into a queryable schema
      const annotatedLabels = await createLabeledScenesForSearch(annotations);
      log("4. Labels: ", annotatedLabels);
      log("4b. Uploading to firestore...");
      // upload the labeled scenes to firestore
      admin
        .firestore()
        .collection("scenes")
        .doc(sceneId)
        .set(
          {
            labels: compileLabels(annotatedLabels),
          },
          { merge: true }
        );
    }
  });

export default addToDatabase;
