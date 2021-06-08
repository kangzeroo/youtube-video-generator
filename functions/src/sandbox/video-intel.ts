// import * as serviceAccount from "./firebase-serviceAccountKey.json";
import admin from "firebase-admin";
import video, { protos } from "@google-cloud/video-intelligence";
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
  FEATURE_UNSPECIFIED:
    "FEATURE_UNSPECIFIED" as unknown as protos.google.cloud.videointelligence.v1.Feature,
  LABEL_DETECTION:
    "LABEL_DETECTION" as unknown as protos.google.cloud.videointelligence.v1.Feature,
  SHOT_CHANGE_DETECTION:
    "SHOT_CHANGE_DETECTION" as unknown as protos.google.cloud.videointelligence.v1.Feature,
  EXPLICIT_CONTENT_DETECTION:
    "EXPLICIT_CONTENT_DETECTION" as unknown as protos.google.cloud.videointelligence.v1.Feature,
  FACE_DETECTION:
    "FACE_DETECTION" as unknown as protos.google.cloud.videointelligence.v1.Feature,
  SPEECH_TRANSCRIPTION:
    "SPEECH_TRANSCRIPTION" as unknown as protos.google.cloud.videointelligence.v1.Feature,
  TEXT_DETECTION:
    "TEXT_DETECTION" as unknown as protos.google.cloud.videointelligence.v1.Feature,
  OBJECT_TRACKING:
    "OBJECT_TRACKING" as unknown as protos.google.cloud.videointelligence.v1.Feature,
  LOGO_RECOGNITION:
    "LOGO_RECOGNITION" as unknown as protos.google.cloud.videointelligence.v1.Feature,
  CELEBRITY_RECOGNITION:
    "CELEBRITY_RECOGNITION" as unknown as protos.google.cloud.videointelligence.v1.Feature,
  PERSON_DETECTION:
    "PERSON_DETECTION" as unknown as protos.google.cloud.videointelligence.v1.Feature,
};

const videoContext = {
  speechTranscriptionConfig: {
    languageCode: "en-US",
    enableAutomaticPunctuation: true,
  },
};

const request = {
  inputUri:
    "gs://raw-videos-prod/default-user/raw-youtube/b63fed12-c7d4-49ca-ba06-84b0ad934c73.mp4",
  outputUri: "gs://metadata-videos-prod/dev-user/video-id/video-id.json",
  features: [
    featureList.LABEL_DETECTION,
    featureList.SPEECH_TRANSCRIPTION,
    featureList.SHOT_CHANGE_DETECTION,
  ],
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
