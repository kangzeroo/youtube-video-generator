import * as functions from "firebase-functions";
import { makePreviewImages } from "@api/thumbnail-preview.api";
import { RAW_VIDEOS_CLOUD_BUCKET_NAME } from "@constants/infrastructure";

const createPreviewImages = functions.storage
  .bucket(RAW_VIDEOS_CLOUD_BUCKET_NAME)
  .object()
  .onFinalize(async (object) => {
    console.log("cloud function createPreviewImages()");
    await makePreviewImages(object);
  });

export default createPreviewImages;
