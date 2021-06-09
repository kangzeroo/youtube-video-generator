/** --------------------------
 *      SCENE UPLOADER API
 * ---------------------------
 */

import { protos } from "@google-cloud/video-intelligence";

// PLACEHOLDER
interface TExtractValidScenesInput {
  annotations: protos.google.cloud.videointelligence.v1.AnnotateVideoResponse;
  minSceneDuration: number;
}

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
  videoPath: string
): Promise<void> => {
  // `gs://${SCENE_VIDEOS_CLOUD_BUCKET_NAME}/user/${userId}/video/${videoId}/scene/${sceneId}/${sceneId}.json`
  console.log(sceneSegment);
  console.log(videoPath);
  return;
};
