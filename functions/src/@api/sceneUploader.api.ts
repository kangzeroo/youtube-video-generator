/** --------------------------
 *      SCENE UPLOADER API
 * ---------------------------
 */

import admin from "firebase-admin";
import { protos } from "@google-cloud/video-intelligence";
import { SCENE_VIDEOS_CLOUD_BUCKET } from "@constants/constants";
import type { TSceneId } from "@customTypes/types.spec";
import ffmpeg from "fluent-ffmpeg";
import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg";
ffmpeg.setFfmpegPath(ffmpegPath);

interface TExtractValidScenesInput {
  annotations: protos.google.cloud.videointelligence.v1.AnnotateVideoResponse;
  minSceneDuration: number;
  videoPath: string;
}

// PLACEHOLDER
export const extractValidScenes = async ({
  annotations,
  minSceneDuration,
  videoPath,
}: TExtractValidScenesInput): protos.google.cloud.videointelligence.v1.VideoSegment[] => {
  console.log(annotations);
  console.log(minSceneDuration);
  console.log(videoPath);
  await Promise.all(
    annotations.annotationResults
      .filter((annotation) => {
        return annotation.shotAnnotations;
      })
      .map((annotation) => {
        annotation.shotAnnotations.
        return 1;
      })
  );

  return [
    {
      startTimeOffset: { seconds: 0, nanos: 0 },
      endTimeOffset: { seconds: 0, nanos: 0 },
      toJSON: () => {
        return {};
      },
    },
  ];
};

// PLACEHOLDER
export const uploadSceneToBucket = async (
  sceneSegment: protos.google.cloud.videointelligence.v1.VideoSegment,
  scenePath: string,
  sceneId: TSceneId
): Promise<void> => {
  console.log(sceneSegment);
  console.log(scenePath);
  const destination = `scene/${sceneId}/${sceneId}.png`;
  await admin.storage().bucket(SCENE_VIDEOS_CLOUD_BUCKET).upload(scenePath, {
    destination,
  });
  return;
};
