/** --------------------------
 *      ANALYZE VIDEO API
 * ---------------------------
 */
import { protos } from "@google-cloud/video-intelligence";
import type { ILabeledScene } from "@customTypes/types.spec";

// PLACEHOLDER
export const createLabeledScenesForSearch = async (
  annotations: protos.google.cloud.videointelligence.v1.AnnotateVideoResponse,
  sceneId: string
): Promise<ILabeledScene[]> => {
  console.log(annotations);
  console.log(sceneId);
  if (sceneId) {
    return [{ sceneId }];
  }
  return [];
};
