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
import type {
  ISceneReference,
  TextractValidTimerangesInput,
  ISceneTimerange,
} from "@customTypes/types.spec";
import ffmpeg from "fluent-ffmpeg";
import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg";
ffmpeg.setFfmpegPath(ffmpegPath);

export const extractValidTimeranges = async ({
  annotations,
  minSceneDuration,
  maxSceneDuration,
}: TextractValidTimerangesInput): Promise<ISceneTimerange[]> => {
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
      console.log(annotation);
      console.log(minSceneDuration);
      console.log(maxSceneDuration);
      return true;
      // return (
      //   annotation.reference.durationInSecondsNanos >= minSceneDuration &&
      //   annotation.reference.durationInSecondsNanos < maxSceneDuration
      // );
    });
  return allValidTimeRanges;
};

export const sliceSceneFromVideo = (
  videoPath: string,
  timerange: ISceneTimerange
): Promise<ISceneReference> => {
  // console.log(`Splicing timerange #${index + 1} of ${totalTimerangeCount}`);
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
};

interface IUploadScene {
  scenePath: string;
  destination: string;
}
export const uploadSceneToBucket = async ({
  scenePath,
  destination,
}: IUploadScene): Promise<string> => {
  await admin.storage().bucket(SCENE_VIDEOS_CLOUD_BUCKET).upload(scenePath, {
    destination,
  });
  return destination;
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
      submittedUserId: userId,
      submittedVideoId: videoId,
      publicUrl,
    },
    { merge: true }
  );
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

import { videoInfo as IVideoInfo, Media as IMedia } from "ytdl-core";
import { IVideoMetadata } from "@customTypes/types.spec";
export const createVideoMetadataFirestore = (
  videoInfo: IVideoInfo
): IVideoMetadata => {
  const { videoDetails } = videoInfo;
  const today = new Date();
  const attemptStringToNumber = (assumedNumberString: string): number => {
    try {
      return parseInt(assumedNumberString);
    } catch (e) {
      return -1;
    }
  };
  const isCreativeCommons = (media?: IMedia) => {
    let isCC = false;
    if (
      media &&
      media.licensed_by &&
      media.licensed_by.toLowerCase().indexOf("creative commons") > -1
    ) {
      isCC = true;
    }
    return isCC;
  };
  return {
    downloadedAt: today,
    originalInfo: {
      videoTitle: videoDetails.title,
      videoId: videoDetails.videoId,
      videoUrl: videoDetails.video_url,
      channelTitle: videoDetails.ownerChannelName,
      channelId: videoDetails.channelId,
      channelExternalId: videoDetails.externalChannelId,
      channelUrl: videoDetails.author.channel_url,
      uploadDate: new Date(videoDetails.uploadDate),
      publishDate: new Date(videoDetails.publishDate),
      durationInSeconds: attemptStringToNumber(videoDetails.lengthSeconds),
      category: videoDetails.category,
      licensedBy: videoDetails.media.licensed_by || "",
      isCreativeCommons: isCreativeCommons(videoDetails.media),
    },
    snapshotStats: {
      snapshotDate: today,
      channelSubscriberCount: videoDetails.author.subscriber_count || -1,
      viewCount: attemptStringToNumber(videoDetails.viewCount),
      likes: videoDetails.likes || -1,
      dislikes: videoDetails.dislikes || -1,
      isPrivate: videoDetails.isPrivate,
      isUnlisted: videoDetails.isUnlisted,
      isFamilySafe: videoDetails.isFamilySafe,
      isCrawlable: videoDetails.isCrawlable,
      isLiveContent: videoDetails.isLiveContent,
      averageRating: videoDetails.averageRating,
      allowRating: videoDetails.allowRatings,
      isAgeRestricted: videoDetails.age_restricted,
      description: videoDetails.description || "",
    },
  };
};
