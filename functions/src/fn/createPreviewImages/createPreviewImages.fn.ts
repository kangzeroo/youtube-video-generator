import * as functions from "firebase-functions";
import { makePreviewImages } from "@api/thumbnail-preview.api";
import { CLOUD_BUCKET_NAME } from "@constants/infrastructure";

const createPreviewImages = functions.storage
  .bucket(CLOUD_BUCKET_NAME)
  .object()
  .onFinalize(async (object) => {
    console.log("cloud function createPreviewImages()");
    await makePreviewImages(object);
  });

export default createPreviewImages;
