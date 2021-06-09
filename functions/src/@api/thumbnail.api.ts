/** --------------------------
 *      THUMBNAILS API
 * ---------------------------
 */

import _ from "lodash";
import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg";
import { path as ffprobePath } from "@ffprobe-installer/ffprobe";
import ffmpeg from "fluent-ffmpeg";
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

/* Creates a preview image from the file at inFilePath written
to outDirectory and outFile */

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

export const extractPreviewImage = async (
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
