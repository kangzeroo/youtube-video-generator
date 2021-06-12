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
  maxSceneDuration: number;
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

// types for youtube video metadata
export interface IVideoMetadata {
  downloadedAt: Date;
  originalInfo: {
    videoTitle: string;
    videoId: string;
    videoUrl: string;
    channelTitle: string;
    channelId: string;
    channelExternalId: string;
    channelUrl: string;
    uploadDate: Date;
    publishDate: Date;
    durationInSeconds: number;
    category: string;
    licensedBy: string;
    isCreativeCommons: boolean;
  };
  snapshotStats: {
    snapshotDate: Date;
    channelSubscriberCount: number;
    viewCount: number;
    likes: number;
    dislikes: number;
    isPrivate: boolean;
    isUnlisted: boolean;
    isFamilySafe: boolean;
    isCrawlable: boolean;
    isLiveContent: boolean;
    averageRating: number;
    allowRating: boolean;
    isAgeRestricted: boolean;
    description: string;
  };
}

// GraphQL
export interface IGraphQLContext {
  req: Request;
  res: Response;
  firestore: FirebaseFirestore.Firestore;
  headers: Headers;
}
// https://www.apollographql.com/docs/apollo-server/api/apollo-server/#rootvalue
const emptyApolloContructorRootValue = {};
export type TApolloConstructorRootValue = typeof emptyApolloContructorRootValue;
