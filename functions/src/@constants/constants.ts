/** --------------------------
 *      CONSTANTS
 * ---------------------------
 */

import { protos } from "@google-cloud/video-intelligence";

// default user variables
export const USER_ID = "default-user";

// where we store raw videos
export const RAW_VIDEOS_CLOUD_BUCKET = "raw-videos-prod";
// where we store SHOT_CHANGE_DETECTION annotations
export const SHOT_CHANGE_ANNOTATIONS_CLOUD_BUCKET =
  "shot-change-annotations-88-prod";
// where we store split videos
export const SCENE_VIDEOS_CLOUD_BUCKET = "scene-videos-88-prod";
// where we store video thumbnails
export const VIDEO_THUMBNAILS_CLOUD_BUCKET = "video-thumbnails-88-prod";
// where we store video metadata
export const SCENE_METADATA_CLOUD_BUCKET = "scene-metadata-88-prod";

// list of video-intelligence services
export const VIDEO_INTELLIGENCE_SERVICES = {
  FEATURE_UNSPECIFIED:
    "FEATURE_UNSPECIFIED" as unknown as protos.google.cloud.videointelligence.v1.Feature,
  LABEL_DETECTION:
    "LABEL_DETECTION" as unknown as protos.google.cloud.videointelligence.v1.Feature,
  SHOT_CHANGE_DETECTION:
    "SHOT_CHANGE_DETECTION" as unknown as protos.google.cloud.videointelligence.v1.Feature,
  EXPLICIT_CONTENT_DETECTION:
    "EXPLICIT_CONTENT_DETECTION" as unknown as protos.google.cloud.videointelligence.v1.Feature,
  FACE_DETECTION:
    "FACE_DETECTION" as unknown as protos.google.cloud.videointelligence.v1.Feature,
  SPEECH_TRANSCRIPTION:
    "SPEECH_TRANSCRIPTION" as unknown as protos.google.cloud.videointelligence.v1.Feature,
  TEXT_DETECTION:
    "TEXT_DETECTION" as unknown as protos.google.cloud.videointelligence.v1.Feature,
  OBJECT_TRACKING:
    "OBJECT_TRACKING" as unknown as protos.google.cloud.videointelligence.v1.Feature,
  LOGO_RECOGNITION:
    "LOGO_RECOGNITION" as unknown as protos.google.cloud.videointelligence.v1.Feature,
  CELEBRITY_RECOGNITION:
    "CELEBRITY_RECOGNITION" as unknown as protos.google.cloud.videointelligence.v1.Feature,
  PERSON_DETECTION:
    "PERSON_DETECTION" as unknown as protos.google.cloud.videointelligence.v1.Feature,
};

// video related constants
import type { TVideoFileExtension } from "@customTypes/types.spec";
export const VALID_VIDEO_FORMATS = {
  MP4: ".mp4" as unknown as TVideoFileExtension,
};
export const VALID_VIDEO_LENGTH_SECONDS = 60 * 20;
export const MIN_SCENE_DURATION = 2;
