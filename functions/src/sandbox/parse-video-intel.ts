import * as jsonVideoIntel from "./annotations-sample.json";
import admin from "firebase-admin";
import { protos } from "@google-cloud/video-intelligence";
import camelize from "camelize";
import { v4 as uuidv4 } from "uuid";
import { SCENE_VIDEOS_CLOUD_BUCKET } from "@constants/constants";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg";
ffmpeg.setFfmpegPath(ffmpegPath);

// admin.initializeApp();
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

const calculateTimeDurationBetween = (
  endTime: protos.google.protobuf.IDuration | undefined | null,
  startTime?: protos.google.protobuf.IDuration | undefined | null
) => {
  if (!startTime && !endTime) {
    return {
      seconds: 0,
      nanos: 0,
    };
  }

  const duration: protos.google.protobuf.IDuration = {
    seconds: 0,
    nanos: 0,
  };
  const endSeconds = (endTime?.seconds || 0) as number;
  const startSeconds = (startTime?.seconds || 0) as number;
  duration.seconds = startSeconds - endSeconds;

  const endNanos = (endTime?.nanos || 0) as number;
  const startNanos = (startTime?.nanos || 0) as number;
  duration.nanos = startNanos - endNanos;
  if (duration.seconds < 0 && duration.nanos > 0) {
    duration.seconds += 1;
    duration.nanos -= 1000000000;
  } else if (duration.seconds > 0 && duration.nanos < 0) {
    duration.seconds -= 1;
    duration.nanos += 1000000000;
  }
  return duration;
};

const run = async (
  jsonObj: protos.google.cloud.videointelligence.v1.AnnotateVideoResponse
): Promise<void> => {
  console.log(jsonObj);
  const minSceneDuration = 2;
  const allValidTimeRanges = jsonObj.annotationResults
    .filter((annotationSet) => {
      return annotationSet.shotAnnotations;
    })
    .reduce((acc, annotationSet) => {
      const annSet = annotationSet.shotAnnotations
        ? annotationSet.shotAnnotations
        : [];
      return acc.concat(annSet);
    }, [] as protos.google.cloud.videointelligence.v1.IVideoSegment[])
    .map((annotation) => {
      const startAt = annotation.startTimeOffset;
      const endAt = annotation.endTimeOffset;
      return {
        ...annotation,
        duration: calculateTimeDurationBetween(startAt, endAt),
      };
    })
    .map((annotation) => {
      const startInSecondsNanos = (((annotation.startTimeOffset?.seconds ||
        0) as number) +
        (annotation.startTimeOffset?.nanos || 0) / 1000000000) as number;
      const durationInSecondsNanos = (((annotation.duration.seconds ||
        0) as number) +
        (annotation.duration.nanos || 0) / 1000000000) as number;
      return {
        annotation,
        reference: {
          startInSecondsNanos,
          durationInSecondsNanos,
        },
      };
    })
    .filter((annotation) => {
      return annotation.reference.durationInSecondsNanos > minSceneDuration;
    });

  console.log(allValidTimeRanges);
  const subset = allValidTimeRanges.slice(0, 2);
  const testVideoPath = path.join(__dirname, "test-video.mp4");

  const scenes = await Promise.all(
    subset.map(async (timerange): Promise<{
      sceneId: string;
      scenePath: string;
    }> => {
      const sceneId = `scene-${uuidv4()}`;
      const scenePath = path.join(__dirname, `${sceneId}.mp4`);
      return new Promise((resolve, reject) => {
        ffmpeg(testVideoPath)
          .setStartTime(timerange.reference.startInSecondsNanos)
          .setDuration(timerange.reference.durationInSecondsNanos)
          .output(scenePath)
          .on("end", (err) => {
            if (!err) {
              console.log(`Cut & saved scene ${sceneId}.mp4`);
              resolve({
                sceneId,
                scenePath,
              });
            }
          })
          .on("error", (err) => {
            reject(err);
          })
          .run();
      });
    })
  );

  console.log(scenes);

  await Promise.all(
    scenes.map(async ({ sceneId, scenePath }): Promise<void> => {
      const destination = `scene/${sceneId}/${sceneId}.mp4`;
      await admin
        .storage()
        .bucket(SCENE_VIDEOS_CLOUD_BUCKET)
        .upload(scenePath, {
          destination,
        });
    })
  );

  console.log("Finished uploading all scenes!");

  // Parse annotaitons from output file
  //   const transcriptJson = parseTranscript(json);
  //   const shotLabelJason = parseShotLabelAnnotations(json);

  /* eslint-disable  @typescript-eslint/no-unused-vars */
  return new Promise((res, rej) => {
    setTimeout(() => {
      res();
    }, 9999999);
  });
};
const camelJson = camelize(jsonVideoIntel);
run(camelJson);

// $ npm run sandbox ./src/sandbox/parse-video-intel.ts
