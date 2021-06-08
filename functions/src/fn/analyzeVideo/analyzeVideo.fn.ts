import * as functions from "firebase-functions";
import { RAW_VIDEOS_CLOUD_BUCKET_NAME } from "@constants/infrastructure";
import { analyzeVideoVision } from "@api/analyze-video";

const analyzeVideo = functions.storage
  .bucket(RAW_VIDEOS_CLOUD_BUCKET_NAME)
  .object()
  .onFinalize(async (object) => {
    await analyzeVideoVision(object);
  });

export default analyzeVideo;
