/** --------------------------
 *      DOWNLOAD YOUTUBE
 * ---------------------------
 * This function downloads a YouTube video when requested by a user
 * Triggers upon HTTP call of an endpoint
 * Client provides the URL of a YouTube video they want, video gets saved
 *
 * `gs://${RAW_VIDEOS_CLOUD_BUCKET}/user/${userId}/video/${videoId}/${videoId}.mp4`
 *
 * Note to check if the video is of a valid type and duration
 */

import * as functions from "firebase-functions";
import admin from "firebase-admin";
import ytdl, { videoFormat as IVideoFormat } from "ytdl-core";
import { v4 as uuidv4 } from "uuid";
import { RAW_VIDEOS_CLOUD_BUCKET, USER_ID } from "@constants/constants";
import { generateStorageUrlWithDownloadToken } from "@api/helper.api";

const log = functions.logger.log;

const bucket = admin.storage().bucket(RAW_VIDEOS_CLOUD_BUCKET);

const downloadYouTube = functions.https.onRequest(async (req, res) => {
  log("1. downloadYouTube()");
  log("2. Attempting to upload youtube video to google cloud storage....");

  // ytdl() --> createWriteStream()
  // https://github.com/fent/node-ytdl-core
  // https://googleapis.dev/nodejs/storage/latest/File.html#createWriteStream
  const videoId = uuidv4();
  const destinationPath = `user/${USER_ID}/video/${videoId}/${videoId}.mp4`;
  const file = bucket.file(destinationPath);

  const { publicUrl, downloadToken } = generateStorageUrlWithDownloadToken(
    bucket.name,
    destinationPath
  );

  log("3. Writing video to cloud bucket");
  const { url, startTime, endTime } = req.body;
  const youtubeDownloadOptions = {
    ...(startTime &&
      endTime && {
        range: { start: startTime, end: endTime },
      }),
    filter: (format: IVideoFormat) => format.container === "mp4",
  };
  const firebaseBucketWriteStream = file.createWriteStream({
    metadata: {
      metadata: {
        firebaseStorageDownloadTokens: downloadToken,
      },
    },
  });
  ytdl(url, youtubeDownloadOptions)
    .pipe(firebaseBucketWriteStream)
    .on("error", (err: Error) => {
      console.error(err);
      res.status(400).send({
        message: `Failed to upload youtube video ${url} to Google Cloud Storage at location: ${publicUrl}`,
        error: err,
      });
    })
    .on("finish", () => {
      console.log("Successfully uploaded");
      res.status(200).send({
        message: `Successfully uploaded youtube video ${url} to Google Cloud Storage at location: ${publicUrl}`,
      });
    });
});

export default downloadYouTube;
