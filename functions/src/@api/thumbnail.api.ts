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
// REFACTOR: unnecessarily convoluted
export const calculateTimemarks = (duration: number): number[] => {
  let timeStep = 1;
  const timemarks: number[] = [];
  if (duration <= 2) {
    return [parseFloat((duration / 2).toFixed(1))];
  } else if (duration <= 5) {
    const numThumbnails = 2;
    timeStep = Math.floor(duration / numThumbnails);
    timemarks.concat(Array.from(Array(numThumbnails).keys()));
  } else if (duration <= 10) {
    const numThumbnails = 4;
    timeStep = Math.floor(duration / numThumbnails);
    timemarks.concat(Array.from(Array(numThumbnails).keys()));
  } else if (duration <= 30) {
    const numThumbnails = 5;
    timeStep = Math.floor(duration / numThumbnails);
    timemarks.concat(Array.from(Array(numThumbnails).keys()));
  } else if (duration <= 60) {
    const numThumbnails = 6;
    timeStep = Math.floor(duration / numThumbnails);
    timemarks.concat(Array.from(Array(numThumbnails).keys()));
  } else {
    const numThumbnails = 7;
    timeStep = Math.floor(duration / numThumbnails);
    timemarks.concat(Array.from(Array(numThumbnails).keys()));
  }
  return _.uniq(
    timemarks.map((idx) => 1 + idx * timeStep).filter((t) => t < duration)
  );
};

export const getVideoDuration = async (inFilePath: string): Promise<number> => {
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
    const duration = await getVideoDuration(inFilePath);
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
