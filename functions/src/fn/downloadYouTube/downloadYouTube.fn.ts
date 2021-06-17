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
import ytdl, {
  videoFormat as IVideoFormat,
  videoInfo as IVideoInfo,
} from "ytdl-core";
import { v4 as uuidv4 } from "uuid";
import { createVideoMetadataFirestore } from "@api/sceneUploader.api";
import { RAW_VIDEOS_CLOUD_BUCKET, USER_ID } from "@constants/constants";
import { generateStorageUrlWithDownloadToken } from "@api/helper.api";
import { TUserId, TVideoId, IVideoMetadata } from "@customTypes/types.spec";

const log = functions.logger.log;

const bucket = admin.storage().bucket(RAW_VIDEOS_CLOUD_BUCKET);

const saveOriginalVideoMetadataFirestore = async (
  videoId: TVideoId,
  userId: TUserId,
  metadata?: IVideoMetadata | null
): Promise<void> => {
  await admin.firestore().collection("videos").doc(videoId).set(
    {
      videoId,
      userId,
      metadata,
    },
    { merge: true }
  );
};

const runtimeOpts = {
  timeoutSeconds: 540,
  memory: "1GB" as "1GB",
};

const downloadYouTube = functions
  .runWith(runtimeOpts)
  .https.onRequest(async (req, res) => {
    log("1. downloadYouTube()");
    const videoId = uuidv4();
    const userId = USER_ID;
    const destinationPath = `user/${userId}/video/${videoId}/${videoId}.mp4`;
    const file = bucket.file(destinationPath);
    const { publicUrl, downloadToken } = generateStorageUrlWithDownloadToken(
      bucket.name,
      destinationPath
    );

    log(
      "2. Prepare attempt to upload youtube video to google cloud storage...."
    );
    const { url, startTime, endTime } = req.body;
    const youtubeDownloadOptions = {
      ...(startTime &&
        endTime && {
          range: { start: startTime, end: endTime },
        }),
      filter: (format: IVideoFormat) => format.container === "mp4",
      quality: "highestvideo",
    };
    log("3. Prepare to write video to cloud bucket");
    const firebaseBucketWriteStream = file.createWriteStream({
      metadata: {
        metadata: {
          firebaseStorageDownloadTokens: downloadToken,
        },
      },
    });
    let videoMetadata: IVideoMetadata | null = null;
    ytdl(url, youtubeDownloadOptions)
      .on("info", (info: IVideoInfo) => {
        videoMetadata = createVideoMetadataFirestore(info);
      })
      .pipe(firebaseBucketWriteStream)
      .on("error", (err: Error) => {
        console.error(err);
        res.status(400).send({
          message: `Failed to upload youtube video ${url} to Google Cloud Storage at location: ${publicUrl}`,
          error: err,
        });
      })
      .on("finish", async () => {
        console.log("Successfully uploaded");
        if (videoMetadata) {
          await saveOriginalVideoMetadataFirestore(
            videoId,
            userId,
            videoMetadata
          );
          res.status(200).send({
            message: `Successfully uploaded youtube video ${url} to Google Cloud Storage at location: ${publicUrl}`,
          });
        } else {
          throw Error("Could not find any video metadata at all!");
        }
      });
  });

export default downloadYouTube;
