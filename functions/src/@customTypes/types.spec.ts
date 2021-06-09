/** --------------------------
 *      CUSTOM TYPES
 * ---------------------------
 */

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
