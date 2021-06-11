/** --------------------------
 *      ANALYZE VIDEO API
 * ---------------------------
 */
import { protos } from "@google-cloud/video-intelligence";

export const createLabeledScenesForSearch = async (
  annotations: protos.google.cloud.videointelligence.v1.AnnotateVideoResponse
): Promise<protos.google.cloud.videointelligence.v1.ILabelAnnotation[]> => {
  const allLabels = annotations.annotationResults
    .filter((annotationSet) => {
      return annotationSet.shotLabelAnnotations;
    })
    .reduce((acc, annotationSet) => {
      const annSet = annotationSet.shotLabelAnnotations
        ? annotationSet.shotLabelAnnotations
        : [];
      return acc.concat(annSet);
    }, [] as protos.google.cloud.videointelligence.v1.ILabelAnnotation[]);
  return allLabels;
};
