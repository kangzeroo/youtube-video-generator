import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as ytdl from "ytdl-core";
import { v4 as uuidv4 } from "uuid";
import { CLOUD_BUCKET, USER_ID } from "@constants/infrastructure";

const bucket = admin.storage().bucket(CLOUD_BUCKET);

const processYouTube = functions.https.onRequest(async (req, res) => {
  const { url, startTime, endTime } = req.body;
  const options = {
    ...(startTime &&
      endTime && {
        range: { start: startTime, end: endTime },
      }),
    filter: (format: any) => format.container === "mp4",
  };
  const downloadToken = uuidv4();
  console.log("Attempting to upload youtube video to google cloud storage....");

  // ytdl() --> createWriteStream()
  // https://github.com/fent/node-ytdl-core
  // https://googleapis.dev/nodejs/storage/latest/File.html#createWriteStream
  const destinationPath = `${USER_ID}/raw-youtube/${uuidv4()}.mp4`;
  const file = bucket.file(destinationPath);

  // allow private access to this file using a "download token"
  // https://weekly.elfitz.com/2020/06/03/make-your-firebase-storage-files-available-on-upload/
  const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
    bucket.name
  }/o/${encodeURI(destinationPath).replace(
    /\//g,
    "%2F"
  )}?alt=media&token=${downloadToken}`;

  const writeStream = file.createWriteStream({
    metadata: {
      metadata: {
        firebaseStorageDownloadTokens: downloadToken,
      },
    },
  });
  ytdl(url, options)
    .pipe(writeStream)
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

export default processYouTube;
