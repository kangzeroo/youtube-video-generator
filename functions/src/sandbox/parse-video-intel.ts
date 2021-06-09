import * as jsonVideoIntel from "./dev-user_video-id_video-id.json";
import { protos } from "@google-cloud/video-intelligence";
import camelize from "camelize";

const run = async (
  jsonObj: protos.google.cloud.videointelligence.v1.AnnotateVideoResponse
): Promise<void> => {
  console.log(jsonObj);

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
