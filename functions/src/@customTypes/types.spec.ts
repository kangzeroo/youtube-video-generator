/** --------------------------
 *      CUSTOM TYPES
 * ---------------------------
 */

type TUserId = string;
type TVideoId = string;
type TSceneId = string;
export enum TVideoFileExtension {
  ".mp4",
}
export interface IUserVideoId {
  userId: TUserId;
  videoId: TVideoId;
  sceneId?: TSceneId;
  videoFileFormat?: TVideoFileExtension;
}
