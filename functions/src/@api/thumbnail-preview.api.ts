import admin from "firebase-admin";
import * as functions from "firebase-functions";
import path from "path";
import os from "os";
import fs from "fs";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg";
import { path as ffprobePath } from "@ffprobe-installer/ffprobe";
import ffmpeg from "fluent-ffmpeg";
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);
import {
  USER_ID,
  PROCESSED_VIDEOS_CLOUD_BUCKET,
  PLACEHOLDER_FILENAME,
} from "@constants/constants";

type TObjectMetadata = functions.storage.ObjectMetadata;

/* Creates a preview image from the file at inFilePath written
to outDirectory and outFile */

const splitRawVideoPathToGetId = (rawVideoPath?: string): string => {
  // rawVideoPath = `${user_id}/raw-youtube/${video_id}}.mp4`
  let videoId = "";
  if (!rawVideoPath) {
    videoId = uuidv4();
  } else if (
    rawVideoPath.indexOf(".mp4") > -1 &&
    rawVideoPath.indexOf("/") > -1
  ) {
    const splitBySlash = rawVideoPath.split("/");
    videoId = splitBySlash[splitBySlash.length - 1].split(".mp4")[0];
  } else {
    videoId = uuidv4();
  }
  return videoId;
};

// show more thumbnails for longer videos
export const calculateTimemarks = (duration: number): number[] => {
  if (duration <= 2) {
    return [parseFloat((duration / 2).toFixed(1))];
  } else if (duration <= 5) {
    const numThumbnails = 2;
    const timeStep = Math.floor(duration / numThumbnails);
    return _.uniq(
      Array.from(Array(numThumbnails).keys())
        .map((idx) => 1 + idx * timeStep)
        .filter((t) => t < duration)
    );
  } else if (duration <= 10) {
    const numThumbnails = 4;
    const timeStep = Math.floor(duration / numThumbnails);
    return _.uniq(
      Array.from(Array(numThumbnails).keys())
        .map((idx) => 1 + idx * timeStep)
        .filter((t) => t < duration)
    );
  } else if (duration <= 30) {
    const numThumbnails = 5;
    const timeStep = Math.floor(duration / numThumbnails);
    return _.uniq(
      Array.from(Array(numThumbnails).keys())
        .map((idx) => 1 + idx * timeStep)
        .filter((t) => t < duration)
    );
  } else if (duration <= 60) {
    const numThumbnails = 6;
    const timeStep = Math.floor(duration / numThumbnails);
    return _.uniq(
      Array.from(Array(numThumbnails).keys())
        .map((idx) => 1 + idx * timeStep)
        .filter((t) => t < duration)
    );
  }
  const numThumbnails = 7;
  const timeStep = Math.floor(duration / numThumbnails);
  return _.uniq(
    Array.from(Array(numThumbnails).keys())
      .map((idx) => 1 + idx * timeStep)
      .filter((t) => t < duration)
  );
};

const ffProbe = async (inFilePath: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(inFilePath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        if (metadata) {
          const duration = metadata.format.duration || 0;
          resolve(duration);
        } else {
          reject(new Error("Video missing metadata"));
        }
      }
    });
  });
};

const extractPreviewImage = async (
  inFilePath: string,
  outDir: string,
  width = 320
): Promise<string[]> => {
  const savedFileNames: string[] = [];
  try {
    const duration = await ffProbe(inFilePath);
    const timemarks = calculateTimemarks(duration);
    const cmd = ffmpeg(inFilePath)
      .on("filenames", (filenames) => {
        console.log("Will generate " + filenames.join(", "));
        filenames.forEach((n: string) => savedFileNames.push(n));
      })
      .screenshots({
        timemarks: timemarks,
        size: `${width}x?`,
        folder: outDir,
      });

    return new Promise((resolve, reject) => {
      cmd.on("end", () => {
        resolve(savedFileNames);
      });
      cmd.on("error", reject);
    });
  } catch (e) {
    throw Error(e);
  }
};

export const makePreviewImages = async (
  object: TObjectMetadata
): Promise<void> => {
  // Temporarily download the video.
  const tempVideoPath = path.join(os.tmpdir(), "video");
  await admin
    .storage()
    .bucket(object.bucket)
    .file(object.name || `${PLACEHOLDER_FILENAME}.mp4`)
    .download({ destination: tempVideoPath });
  const videoId = splitRawVideoPathToGetId(object.name);

  fs.statSync(tempVideoPath);
  const fileNames: string[] = [];
  try {
    const names: string[] = await extractPreviewImage(
      tempVideoPath,
      os.tmpdir()
    );
    names.forEach((n) => fileNames.push(n));
  } catch (err) {
    throw Error(err);
  }

  if (fileNames.length > 0) {
    const savedThumbnails = await Promise.all(
      fileNames.map(async (name) => {
        const destination = `${USER_ID}/processed-videos/${videoId}/thumbnails/${name}`;
        await admin
          .storage()
          .bucket(PROCESSED_VIDEOS_CLOUD_BUCKET)
          .upload(`${os.tmpdir()}/${name}`, {
            destination,
          });
        return destination;
      })
    );

    admin
      .firestore()
      .collection("users")
      .doc(USER_ID)
      .collection("videos")
      .doc(videoId)
      .set(
        {
          thumbnails: savedThumbnails,
        },
        { merge: true }
      );
    fs.unlinkSync(tempVideoPath);
    fileNames.forEach((name) => {
      fs.unlinkSync(`${os.tmpdir()}/${name}`);
    });
  } else {
    fs.unlinkSync(tempVideoPath);
    fileNames.forEach((name) => {
      fs.unlinkSync(`${os.tmpdir()}/${name}`);
    });
    throw Error("Failed to generate thumbnails, no names");
  }
};
