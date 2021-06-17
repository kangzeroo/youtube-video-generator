import admin from "firebase-admin";
import ytdl, {
  videoFormat as IVideoFormat,
  videoInfo as IVideoInfo,
} from "ytdl-core";
import { RAW_VIDEOS_CLOUD_BUCKET } from "@constants/constants";
import { generateStorageUrlWithDownloadToken } from "@api/helper.api";
import { createVideoMetadataFirestore } from "@api/sceneUploader.api";
import * as serviceAccount from "./firebase-serviceAccountKey.json";

const params = {
  type: serviceAccount.type,
  projectId: serviceAccount.project_id,
  privateKeyId: serviceAccount.private_key_id,
  privateKey: serviceAccount.private_key,
  clientEmail: serviceAccount.client_email,
  clientId: serviceAccount.client_id,
  authUri: serviceAccount.auth_uri,
  tokenUri: serviceAccount.token_uri,
  authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
  clientC509CertUrl: serviceAccount.client_x509_cert_url,
};
admin.initializeApp({
  credential: admin.credential.cert(params),
});
const userId = "local-test-user";
const videoId = "test-video";
const bucket = admin.storage().bucket(RAW_VIDEOS_CLOUD_BUCKET);
const destinationPath = `user/${userId}/video/${videoId}/original-video-${videoId}.mp4`;

const run = async (): Promise<void> => {
  const file = bucket.file(destinationPath);
  const { publicUrl, downloadToken } = generateStorageUrlWithDownloadToken(
    bucket.name,
    destinationPath
  );
  const firebaseBucketWriteStream = file.createWriteStream({
    metadata: {
      metadata: {
        firebaseStorageDownloadTokens: downloadToken,
      },
    },
  });
  const url = "https://www.youtube.com/watch?v=yR4UjMmIvP8";

  const youtubeDownloadOptions = {
    filter: (format: IVideoFormat) => {
      return format.container === "mp4";
    },
    quality: "highestvideo",
  };
  let videoMetadata = {};
  ytdl(url, youtubeDownloadOptions)
    .on("info", (info: IVideoInfo) => {
      console.log("info: ");
      console.log(info);
      videoMetadata = createVideoMetadataFirestore(info);
      console.log("videoMetadata: ");
      console.log(videoMetadata);
    })
    .pipe(firebaseBucketWriteStream)
    .on("error", (err: Error) => {
      console.error(err);
    })
    .on("finish", async () => {
      console.log("Successfully uploaded");
      console.log(
        `Successfully uploaded youtube video ${url} to Google Cloud Storage at location: ${publicUrl}`
      );
      await admin.firestore().collection("videos").doc(videoId).set(
        {
          videoId,
          userId,
          metadata: videoMetadata,
        },
        { merge: true }
      );
    });
  return new Promise((res, rej) => {
    setTimeout(() => {
      res();
    }, 9999999);
  });
};

run();

// $ npm run sandbox ./src/sandbox/download-youtube.ts
