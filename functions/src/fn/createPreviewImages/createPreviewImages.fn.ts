import * as functions from "firebase-functions";
import { makePreviewImages } from "@api/thumbnail-preview.api";
import { RAW_VIDEOS_CLOUD_BUCKET_NAME } from "@constants/constants";

const createPreviewImages = functions.storage
  .bucket(RAW_VIDEOS_CLOUD_BUCKET_NAME)
  .object()
  .onFinalize(async (object) => {
    const fileName = object?.name || "";
    if (fileName.indexOf(".mp4") > -1) {
      await makePreviewImages(object);
    }
  });

export default createPreviewImages;
