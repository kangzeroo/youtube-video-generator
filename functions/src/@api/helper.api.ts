/** --------------------------
 *      HELPER METHODS
 * ---------------------------
 */

import { VALID_VIDEO_FORMATS } from "@constants/constants";
import type { IUserVideoId } from "@customTypes/types.spec";

// PLACEHOLDER
export const extractUserIdAndVideoId = (
  bucketFilePath: string
): IUserVideoId => {
  console.log(bucketFilePath);
  // Files have the format `gs://${SHOT_CHANGE_ANNOTATIONS_CLOUD_BUCKET_NAME}/user/${userId}/video/${videoId}/${videoId}.json`
  // const userId = object?.name?.split("/")[0] || "";
  // const videoId = object?.name?.split("/")[2].split(".")[0] || "";
  return {
    userId: "",
    videoId: "",
    sceneId: "",
    videoFileFormat: VALID_VIDEO_FORMATS.MP4,
  };
};

// PLACEHOLDER
export const checkIfValidVideoFormat = (bucketFilePath: string): boolean => {
  console.log(bucketFilePath);
  console.log(VALID_VIDEO_FORMATS);
  return true || false;
};

// PLACEHOLDER
export const checkIfValidVideoLength = (bucketFilePath: string): boolean => {
  // max is 20 mins (60 seconds x 20 mins)
  const VALID_VIDEO_LENGTH = 60 * 20;
  console.log(bucketFilePath);
  console.log(VALID_VIDEO_LENGTH);
  return true || false;
};

// PLACEHOLDER
// each cloud bucket gets its own path builder
export const buildPathForStorage = {
  RAW_VIDEOS_CLOUD_BUCKET: (): string => "",
};
