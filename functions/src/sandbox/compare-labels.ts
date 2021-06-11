import admin from "firebase-admin";
import video, { protos } from "@google-cloud/video-intelligence";
import camelize from "camelize";
import * as jsonVideoIntel from "./video-labels-wholesome.json";
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
console.log(params);
admin.initializeApp({
  credential: admin.credential.cert(params),
});
// admin.initializeApp();
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

// const videoContext = {
//   speechTranscriptionConfig: {
//     languageCode: "en-US",
//     enableAutomaticPunctuation: true,
//   },
// };

const request = {
  inputUri:
    "gs://raw-videos-prod/user/default-user/video/533c1cb6-e316-4199-8e3b-803b9d79196a/533c1cb6-e316-4199-8e3b-803b9d79196a.mp4",
  outputUri:
    "gs://shot-change-annotations-88-prod/user/default-user/video/533c1cb6-e316-4199-8e3b-803b9d79196a/533c1cb6-e316-4199-8e3b-803b9d79196a.json",
  features: [
    featureList.LABEL_DETECTION,
    // featureList.SPEECH_TRANSCRIPTION,
    // featureList.SHOT_CHANGE_DETECTION,
  ],
  // videoContext: videoContext,
};

export const run = async (): Promise<void> => {
  console.log("request ", request);
  try {
    const client = new video.v1.VideoIntelligenceServiceClient();
    const [operation] = await client.annotateVideo(request);
    console.log("operation ", operation);
  } catch (e) {
    throw Error(e);
  }
  /* eslint-disable  @typescript-eslint/no-unused-vars */
  return new Promise((res, rej) => {
    setTimeout(() => {
      res();
    }, 9999999);
  });
};

const analyze = (
  jsonVideoIntel: protos.google.cloud.videointelligence.v1.AnnotateVideoResponse
): Promise<void> => {
  console.log("all labels:");
  console.log(jsonVideoIntel);
  const shotLabelAnnotations = jsonVideoIntel.annotationResults
    .filter((annotationSet) => {
      return annotationSet.shotLabelAnnotations;
    })
    .reduce((acc, annotationSet) => {
      const annSet = annotationSet.shotLabelAnnotations
        ? annotationSet.shotLabelAnnotations
        : [];
      return acc.concat(annSet);
    }, [] as protos.google.cloud.videointelligence.v1.ILabelAnnotation[]);
  const onlyWithinTime = () => {
    const startTime = 0;
    const endTime = 8;
    const labelsFoundInTimeRange: protos.google.cloud.videointelligence.v1.ILabelAnnotation[] =
      [];
    shotLabelAnnotations.forEach((shot) => {
      let foundInTimerange = false;
      shot.segments?.forEach((seg) => {
        const s = seg.segment?.startTimeOffset?.seconds || 0;
        const e = seg.segment?.endTimeOffset?.seconds || 0;
        if (s >= startTime && e <= endTime) {
          foundInTimerange = true;
        }
      });
      if (foundInTimerange) {
        labelsFoundInTimeRange.push(shot);
      }
    });
    console.log(`labelsFoundInTimeRange ${startTime} to ${endTime} seconds:`);
    console.log(labelsFoundInTimeRange);
  };
  onlyWithinTime();
  /* eslint-disable  @typescript-eslint/no-unused-vars */
  return new Promise((res, rej) => {
    setTimeout(() => {
      res();
    }, 9999999);
  });
};

// run();
const camelJson = camelize(jsonVideoIntel);
analyze(camelJson);

// $ npm run sandbox ./src/sandbox/compare-labels.ts
