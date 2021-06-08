import * as jsonVideoIntel from "./dev-user_video-id_video-id.json";

const run = async (): Promise<void> => {
  console.log(jsonVideoIntel);
  // Parse annotaitons from output file
  //   const transcriptJson = parseTranscript(json);
  //   const shotLabelJason = parseShotLabelAnnotations(json);

  return new Promise((res, rej) => {
    setTimeout(() => {
      res();
    }, 9999999);
  });
};
run();

// $ npm run sandbox ./src/sandbox/parse-video-intel.ts
