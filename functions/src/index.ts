/** --------------------------
 *   FIREBASE FUNCTIONS INDEX
 * ---------------------------
 */

import * as functions from "firebase-functions";
import admin from "firebase-admin";

admin.initializeApp(functions.config().firebase);

// Step 1. User downloads a YouTube video to be parsed
export { default as downloadYouTube } from "./fn/downloadYouTube/downloadYouTube.fn";
// Step 2a. Upon download, we annotate the video with timeranges of its individual scene shots
export { default as annotateSceneShots } from "./fn/sceneShots/annotateSceneShots.fn";
// Step 2b. Upon annotation, we split the video into smaller scenes and save them all
export { default as saveSceneShots } from "./fn/sceneShots/saveSceneShots.fn";
// Step 3. Upon saving scenes, we analyze each scene with entity labels and create thumbnails for them
export { default as analyzeSceneShots } from "./fn/sceneShots/analyzeSceneShots.fn";
// Step 4. Upon analyzing each scene, we save the data to firestore db
export { default as addToDatabase } from "./fn/addToDatabase/addToDatabase.fn";
