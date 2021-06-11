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

// show more thumbnails for longer videos
// REFACTOR: unnecessarily convoluted
export const calculateTimemarks = (duration: number): number[] => {
  let timeStep = 1;
  let timemarks: number[] = [];
  if (duration <= 2) {
    return [parseFloat((duration / 2).toFixed(1))];
  } else if (duration <= 5) {
    const numThumbnails = 2;
    timeStep = Math.floor(duration / numThumbnails);
    timemarks = timemarks.concat(Array.from(Array(numThumbnails).keys()));
  } else if (duration <= 10) {
    const numThumbnails = 4;
    timeStep = Math.floor(duration / numThumbnails);
    timemarks = timemarks.concat(Array.from(Array(numThumbnails).keys()));
  } else if (duration <= 30) {
    const numThumbnails = 5;
    timeStep = Math.floor(duration / numThumbnails);
    timemarks = timemarks.concat(Array.from(Array(numThumbnails).keys()));
  } else if (duration <= 60) {
    const numThumbnails = 6;
    timeStep = Math.floor(duration / numThumbnails);
    timemarks = timemarks.concat(Array.from(Array(numThumbnails).keys()));
  } else {
    const numThumbnails = 7;
    timeStep = Math.floor(duration / numThumbnails);
    timemarks = timemarks.concat(Array.from(Array(numThumbnails).keys()));
  }
  return _.uniq(
    timemarks.map((idx) => 1 + idx * timeStep).filter((t) => t < duration)
  );
};

export const getVideoDuration = async (inFilePath: string): Promise<number> => {
  console.log("getVideoDuration()");
  return new Promise((resolve, reject) => {
    try {
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
    } catch (e) {
      console.log(JSON.stringify(e));
      throw Error(e);
    }
  });
};

export const extractPreviewImage = async (
  inFilePath: string,
  outDir: string,
  duration: number,
  width = 320
): Promise<string[]> => {
  console.log("extractPreviewImage()");
  const savedFileNames: string[] = [];
  try {
    console.log("duration: ", JSON.stringify(duration));
    const timemarks = calculateTimemarks(duration);
    console.log("timemarks: ", JSON.stringify(timemarks));
    console.log("ffmpeg()");
    const cmd = ffmpeg(inFilePath)
      .on("filenames", (filenames) => {
        console.log("Will generate " + filenames.join(", "));
        filenames.forEach((n: string) => savedFileNames.push(n));
        console.log("savedFileNames... ", JSON.stringify(savedFileNames));
      })
      .screenshots({
        timemarks: timemarks,
        size: `${width}x?`,
        folder: outDir,
      });

    return new Promise((resolve, reject) => {
      cmd.on("end", () => {
        console.log("Resolving thumbnail generation!");
        resolve(savedFileNames);
      });
      cmd.on("error", reject);
    });
  } catch (e) {
    throw Error(e);
  }
};
