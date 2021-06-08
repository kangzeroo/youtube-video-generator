// import * as serviceAccount from "./firebase-serviceAccountKey.json";
import admin from "firebase-admin";
import video from "@google-cloud/video-intelligence";

// const params = {
//   type: serviceAccount.type,
//   projectId: serviceAccount.project_id,
//   privateKeyId: serviceAccount.private_key_id,
//   privateKey: serviceAccount.private_key,
//   clientEmail: serviceAccount.client_email,
//   clientId: serviceAccount.client_id,
//   authUri: serviceAccount.auth_uri,
//   tokenUri: serviceAccount.token_uri,
//   authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
//   clientC509CertUrl: serviceAccount.client_x509_cert_url,
// };
// console.log(params);
// admin.initializeApp({
//   credential: admin.credential.cert(params),
// });
admin.initializeApp();

const featureList = {
  LABEL_DETECTION: 1,
  SPEECH_TRANSCRIPTION: 1,
  FEATURE_UNSPECIFIED: 1,
  EXPLICIT_CONTENT_DETECTION: 1,
  FACE_DETECTION: 1,
  TEXT_DETECTION: 1,
  OBJECT_TRACKING: 1,
  LOGO_RECOGNITION: 1,
  CELEBRITY_RECOGNITION: 1,
  PERSON_DETECTION: 1,
};

const videoContext = {
  speechTranscriptionConfig: {
    languageCode: "en-US",
    enableAutomaticPunctuation: true,
  },
};

const request = {
  inputUri:
    "gs://raw-videos-prod/default-user/raw-youtube/33faab2f-e8d6-4f56-a787-9a00273cc86b.mp4",
  outputUri: `gs://${process.env.VIDEO_JSON_BUCKET}/dev-user/video-id/video-id.json`,
  features: [featureList.LABEL_DETECTION, featureList.SPEECH_TRANSCRIPTION],
  videoContext: videoContext,
};

const run = async (): Promise<void> => {
  console.log("request ", request);
  const client = new video.v1.VideoIntelligenceServiceClient();
  const [operation] = await client.annotateVideo(request);
  console.log("operation ", operation);
  return new Promise((res, rej) => {
    setTimeout(() => {
      res();
    }, 9999999);
  });
};

run();
