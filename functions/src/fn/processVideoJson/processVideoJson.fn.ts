import * as functions from "firebase-functions";
import { processVideoMetadata } from "@api/process-video-metadata.api";
import { METADATA_VIDEOS_CLOUD_BUCKET_NAME } from "@constants/constants";

const processVideoJson = functions.storage
  .bucket(METADATA_VIDEOS_CLOUD_BUCKET_NAME)
  .object()
  .onFinalize(async (object) => {
    await processVideoMetadata(object);
  });

export default processVideoJson;
