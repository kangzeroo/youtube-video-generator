/** --------------------------
 *      SCENE UPLOADER API
 * ---------------------------
 */

import admin from "firebase-admin";
import { protos } from "@google-cloud/video-intelligence";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import os from "os";
import { SCENE_VIDEOS_CLOUD_BUCKET } from "@constants/constants";
import { generateStorageUrlWithDownloadToken } from "@api/helper.api";
import type {
  TUserId,
  TVideoId,
  TSceneId,
  ISceneReference,
  TExtractValidScenesInput,
} from "@customTypes/types.spec";
import ffmpeg from "fluent-ffmpeg";
import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg";
ffmpeg.setFfmpegPath(ffmpegPath);

export const extractValidScenes = async ({
  annotations,
  minSceneDuration,
  videoPath,
}: TExtractValidScenesInput): Promise<ISceneReference[]> => {
  const allValidTimeRanges = annotations.annotationResults
    .filter((annotationSet) => {
      return annotationSet.shotAnnotations;
    })
    .reduce((acc, annotationSet) => {
      const annSet = annotationSet.shotAnnotations
        ? annotationSet.shotAnnotations
        : [];
      return acc.concat(annSet);
    }, [] as protos.google.cloud.videointelligence.v1.IVideoSegment[])
    .map((annotation) => {
      const startAt = annotation.startTimeOffset;
      const endAt = annotation.endTimeOffset;
      return {
        ...annotation,
        duration: calculateTimeDurationBetween(startAt, endAt),
      };
    })
    .map((annotation) => {
      const startInSecondsNanos = (((annotation.startTimeOffset?.seconds ||
        0) as number) +
        (annotation.startTimeOffset?.nanos || 0) / 1000000000) as number;
      const durationInSecondsNanos = (((annotation.duration.seconds ||
        0) as number) +
        (annotation.duration.nanos || 0) / 1000000000) as number;
      return {
        annotation,
        reference: {
          startInSecondsNanos,
          durationInSecondsNanos,
        },
      };
    })
    .filter((annotation) => {
      return annotation.reference.durationInSecondsNanos > minSceneDuration;
    });
  // REPLACE IN PRODUCTION (remove subset)
  const subset = allValidTimeRanges.slice(0, 10);
  const scenes = await Promise.all(
    subset.map(async (timerange): Promise<ISceneReference> => {
      const sceneId = `scene-${uuidv4()}`;
      const scenePath = path.join(os.tmpdir(), `${sceneId}.mp4`);
      return new Promise((resolve, reject) => {
        ffmpeg(videoPath)
          .setStartTime(timerange.reference.startInSecondsNanos)
          .setDuration(timerange.reference.durationInSecondsNanos)
          .output(scenePath)
          .on("end", (err) => {
            if (!err) {
              console.log(`Cut & saved scene ${sceneId}.mp4`);
              resolve({
                sceneId,
                scenePath,
              });
            }
          })
          .on("error", (err) => {
            reject(err);
          })
          .run();
      });
    })
  );
  return scenes;
};

interface IUploadScene {
  userId: TUserId;
  videoId: TVideoId;
  sceneId: TSceneId;
  scenePath: string;
}
export const uploadSceneToBucket = async ({
  userId,
  videoId,
  sceneId,
  scenePath,
}: IUploadScene): Promise<string> => {
  const destination = `user/${userId}/video/${videoId}/scene/${sceneId}/${sceneId}.mp4`;
  const { publicUrl } = generateStorageUrlWithDownloadToken(
    SCENE_VIDEOS_CLOUD_BUCKET,
    destination
  );
  await admin.storage().bucket(SCENE_VIDEOS_CLOUD_BUCKET).upload(scenePath, {
    destination,
  });
  return publicUrl;
};

interface ISceneSave {
  sceneId: string;
  userId: string;
  videoId: string;
  publicUrl: string;
}
export const saveSceneToFirestore = async ({
  sceneId,
  userId,
  videoId,
  publicUrl,
}: ISceneSave): Promise<void> => {
  await admin.firestore().collection("scenes").doc(sceneId).set(
    {
      sceneId,
      originalUploaderId: userId,
      originalVideoId: videoId,
      publicUrl,
    },
    { merge: true }
  );
  return;
};

// PLACEHOLDER
// save firestore record of user uploading a raw source video
export const recordVideoUploadedByUser = async (): Promise<void> => {
  return;
};

const calculateTimeDurationBetween = (
  endTime: protos.google.protobuf.IDuration | undefined | null,
  startTime?: protos.google.protobuf.IDuration | undefined | null
) => {
  if (!startTime && !endTime) {
    return {
      seconds: 0,
      nanos: 0,
    };
  }

  const duration: protos.google.protobuf.IDuration = {
    seconds: 0,
    nanos: 0,
  };
  const endSeconds = (endTime?.seconds || 0) as number;
  const startSeconds = (startTime?.seconds || 0) as number;
  duration.seconds = startSeconds - endSeconds;

  const endNanos = (endTime?.nanos || 0) as number;
  const startNanos = (startTime?.nanos || 0) as number;
  duration.nanos = startNanos - endNanos;
  if (duration.seconds < 0 && duration.nanos > 0) {
    duration.seconds += 1;
    duration.nanos -= 1000000000;
  } else if (duration.seconds > 0 && duration.nanos < 0) {
    duration.seconds -= 1;
    duration.nanos += 1000000000;
  }
  return duration;
};
