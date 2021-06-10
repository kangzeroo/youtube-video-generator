/** --------------------------
 *      CUSTOM TYPES
 * ---------------------------
 */

import { protos } from "@google-cloud/video-intelligence";

export type TUserId = string;
export type TVideoId = string;
export type TSceneId = string;
export enum TVideoFileExtension {
  ".mp4",
}
export interface IUserVideoId {
  userId: TUserId;
  videoId: TVideoId;
  sceneId?: TSceneId;
  videoFileFormat?: TVideoFileExtension;
}

export interface ILabeledScene {
  sceneId: TSceneId;
}

// types related to scene splitting annotations
export interface TExtractValidScenesInput {
  annotations: protos.google.cloud.videointelligence.v1.AnnotateVideoResponse;
  minSceneDuration: number;
  videoPath: string;
}
export interface ISplitSceneAnnotation {
  annotation: {
    duration: protos.google.protobuf.IDuration;
    startTimeOffset?: protos.google.protobuf.IDuration | null | undefined;
    endTimeOffset?: protos.google.protobuf.IDuration | null | undefined;
  };
  reference: {
    startInSecondsNanos: number;
    durationInSecondsNanos: number;
  };
}
export interface ISceneReference {
  sceneId: string;
  scenePath: string;
}
