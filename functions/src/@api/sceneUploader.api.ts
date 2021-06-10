/** --------------------------
 *      SCENE UPLOADER API
 * ---------------------------
 */

import admin from "firebase-admin";
import { protos } from "@google-cloud/video-intelligence";
import { SCENE_VIDEOS_CLOUD_BUCKET } from "@constants/constants";
import type { TSceneId } from "@customTypes/types.spec";

interface TExtractValidScenesInput {
  annotations: protos.google.cloud.videointelligence.v1.AnnotateVideoResponse;
  minSceneDuration: number;
}

// PLACEHOLDER
export const extractValidScenes = ({
  annotations,
  minSceneDuration,
}: TExtractValidScenesInput): protos.google.cloud.videointelligence.v1.VideoSegment[] => {
  console.log(annotations);
  console.log(minSceneDuration);
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
  videoPath: string,
  sceneId: TSceneId
): Promise<void> => {
  console.log(sceneSegment);
  console.log(videoPath);
  const destination = `scene/${sceneId}/${sceneId}.png`;
  await admin.storage().bucket(SCENE_VIDEOS_CLOUD_BUCKET).upload(videoPath, {
    destination,
  });
  return;
};
