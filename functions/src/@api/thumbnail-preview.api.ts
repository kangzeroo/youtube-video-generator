import admin from "firebase-admin";
import * as functions from "firebase-functions";
import path from "path";
import os from "os";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg";
import ffmpeg from "fluent-ffmpeg";
ffmpeg.setFfmpegPath(ffmpegPath);
import { USER_ID, CLOUD_BUCKET } from "@constants/infrastructure";

type TObjectMetadata = functions.storage.ObjectMetadata;

/* Creates a preview image from the file at inFilePath written
to outDirectory and outFile */

const splitRawVideoPathToGetId = (rawVideoPath?: string): string => {
  // rawVideoPath = "{user_id}/raw-youtube/{video_id}}.mp4"
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

const extractPreviewImage = (
  inFilePath: string,
  outDir: string,
  width = 320
): Promise<string[]> => {
  const savedFileNames: string[] = [];
  console.log(width);
  const cmd = ffmpeg(inFilePath)
    .takeScreenshots(4, outDir)
    // .screenshots({
    //   timemarks: ["10%", "30%", "50%", "80%"],
    //   size: `${width}x?`,
    //   folder: outDir,
    // })
    .on("filenames", (filenames) => {
      console.log("Will generate " + filenames.join(", "));
      filenames.forEach((n: string) => savedFileNames.push(n));
    });

  return new Promise((resolve, reject) => {
    cmd.on("end", () => {
      resolve(savedFileNames);
    });
    cmd.on("error", reject);
  });
};

export const makePreviewImages = async (
  object: TObjectMetadata
): Promise<void> => {
  // Temporarily download the video.
  const tempVideoPath = path.join(os.tmpdir(), "video");
  await admin
    .storage()
    .bucket(object.bucket)
    .file(object.name || "temp-video.mp4")
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
          .bucket(CLOUD_BUCKET)
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
    // Clean up!
    fs.unlinkSync(tempVideoPath);
    fs.unlinkSync(`${os.tmpdir()}/thumbnail.png`);
  } else {
    // Clean up!
    fs.unlinkSync(tempVideoPath);
    fs.unlinkSync(`${os.tmpdir()}/thumbnail.png`);
    throw Error("Failed to generate thumbnails, no names");
  }
};
