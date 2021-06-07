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
  };
  console.log("Attempting to upload youtube video to google cloud storage....");

  // https://github.com/fent/node-ytdl-core
  // https://googleapis.dev/nodejs/storage/latest/File.html#createWriteStream
  const destinationPath = `${USER_ID}/raw-youtube/${uuidv4()}.mp4`;
  const file = bucket.file(destinationPath);
  ytdl(url, options)
    .pipe(file.createWriteStream())
    .on("error", (err) => {
      console.error(err);
      res.status(400).send({
        message: `Failed to upload youtube video ${url} to Google Cloud Storage at location: ${"filePath"}`,
        error: err,
      });
    })
    .on("finish", (data: any) => {
      console.log("Successfully uploaded");
      console.log(data);
      res.status(200).send({
        message: `Successfully uploaded youtube video ${url} to Google Cloud Storage at location: ${"filePath"}`,
      });
    });
});

export default processYouTube;
