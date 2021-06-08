import * as functions from "firebase-functions";
import admin from "firebase-admin";

admin.initializeApp(functions.config().firebase);

export { default as processYouTube } from "./fn/processYouTube/processYouTube.fn";
export { default as createPreviewImages } from "./fn/createPreviewImages/createPreviewImages.fn";
export { default as analyzeVideo } from "./fn/analyzeVideo/analyzeVideo.fn";
export { default as processVideoJson } from "./fn/processVideoJson/processVideoJson.fn";
