/** --------------------------
 *      HELPER METHODS
 * ---------------------------
 */

import { v4 as uuidv4 } from "uuid";
import {
  VALID_VIDEO_FORMATS,
  VALID_VIDEO_LENGTH_SECONDS,
} from "@constants/constants";
import { getVideoDuration } from "@api/thumbnail.api";
import type {
  IUserVideoId,
  TVideoFileExtension,
} from "@customTypes/types.spec";

export const extractRelevantIds = (bucketFilePath: string): IUserVideoId => {
  // bucketFilePath can take on multiple string formats such as:
  // `user/${userId}/video/${videoId}/${videoId}.mp4`
  // `user/${userId}/video/${videoId}/scene/${sceneId}/${sceneId}.mp4`
  const relevantIds = {
    userId: "",
    videoId: "",
    sceneId: "",
    videoFileFormat: "" as unknown as TVideoFileExtension,
  };
  const sections = bucketFilePath.split("/");
  sections.forEach((substr: string, index: number) => {
    if (substr === "user") {
      relevantIds.userId = sections[index + 1];
    } else if (substr === "video") {
      relevantIds.videoId = sections[index + 1];
    } else if (substr === "scene") {
      relevantIds.sceneId = sections[index + 1];
    } else if (index === sections.length - 1) {
      const fileNameAndExt = substr.split(".");
      if (
        fileNameAndExt.length > 1 &&
        checkIfValidVideoFormat(bucketFilePath)
      ) {
        relevantIds.videoFileFormat =
          fileNameAndExt[1] as unknown as TVideoFileExtension;
      }
    }
  });
  return relevantIds;
};

export const checkIfValidVideoFormat = (bucketFilePath: string): boolean => {
  const fileNameAndExt = bucketFilePath.split(".");
  if (fileNameAndExt.length > 1) {
    return Object.values(VALID_VIDEO_FORMATS).includes(
      `.${fileNameAndExt[1]}` as unknown as TVideoFileExtension
    );
  }
  return false;
};

export const checkIfValidVideoLength = async (
  bucketFilePath: string,
  maxDurationSeconds: number = VALID_VIDEO_LENGTH_SECONDS
): Promise<boolean> => {
  console.log("checkIfValidVideoLength");
  const duration = await getVideoDuration(bucketFilePath);
  return duration <= maxDurationSeconds;
};

// allow private access to this file using a "download token"
// https://weekly.elfitz.com/2020/06/03/make-your-firebase-storage-files-available-on-upload/
export const generateStorageUrlWithDownloadToken = (
  bucketName: string,
  destinationPath: string,
  downloadToken?: string
): { publicUrl: string; downloadToken: string } => {
  const accessToken = downloadToken ? downloadToken : uuidv4();
  const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURI(
    destinationPath
  ).replace(/\//g, "%2F")}?alt=media&token=${accessToken}`;
  return { publicUrl, downloadToken: accessToken };
};

// PLACEHOLDER
// each cloud bucket gets its own path builder
// export const buildPathForStorage = {
//   RAW_VIDEOS_CLOUD_BUCKET: (): string => "",
//   SHOT_CHANGE_ANNOTATIONS_CLOUD_BUCKET: (): string => "",
//   SCENE_VIDEOS_CLOUD_BUCKET: (): string => "",
//   VIDEO_THUMBNAILS_CLOUD_BUCKET: (): string => "",
//   METADATA_VIDEOS_CLOUD_BUCKET: (): string => "",
// };
