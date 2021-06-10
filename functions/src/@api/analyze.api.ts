/** --------------------------
 *      ANALYZE VIDEO API
 * ---------------------------
 */
import { protos } from "@google-cloud/video-intelligence";
import type { IUserVideoId, ILabeledScene } from "@customTypes/types.spec";

export const createLabeledScenesForSearch = async (
  annotations: protos.google.cloud.videointelligence.v1.AnnotateVideoResponse,
  { videoId, userId, sceneId }: IUserVideoId
): Promise<ILabeledScene[]> => {
  // console.log(annotations);
  console.log(videoId, userId, sceneId);
  if (sceneId) {
    return [{ sceneId }];
  }
  return [];
};
