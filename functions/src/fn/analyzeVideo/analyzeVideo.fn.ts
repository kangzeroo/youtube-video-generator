import * as functions from "firebase-functions";
import { RAW_VIDEOS_CLOUD_BUCKET_NAME } from "@constants/constants";
import { analyzeVideoVision } from "@api/analyze-video.api";

const analyzeVideo = functions.storage
  .bucket(RAW_VIDEOS_CLOUD_BUCKET_NAME)
  .object()
  .onFinalize(async (object) => {
    await analyzeVideoVision(object);
  });

export default analyzeVideo;
