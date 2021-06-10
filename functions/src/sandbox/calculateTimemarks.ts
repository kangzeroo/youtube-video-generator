import _ from "lodash";
// import { calculateTimemarks } from "@api/thumbnail.api";

export const calculateTimemarks = (duration: number): number[] => {
  let timeStep = 1;
  let timemarks: number[] = [];
  if (duration <= 2) {
    return [parseFloat((duration / 2).toFixed(1))];
  } else if (duration <= 5) {
    const numThumbnails = 2;
    timeStep = Math.floor(duration / numThumbnails);
    timemarks = timemarks.concat(Array.from(Array(numThumbnails).keys()));
  } else if (duration <= 10) {
    const numThumbnails = 4;
    timeStep = Math.floor(duration / numThumbnails);
    timemarks = timemarks.concat(Array.from(Array(numThumbnails).keys()));
  } else if (duration <= 30) {
    const numThumbnails = 5;
    timeStep = Math.floor(duration / numThumbnails);
    timemarks = timemarks.concat(Array.from(Array(numThumbnails).keys()));
  } else if (duration <= 60) {
    const numThumbnails = 6;
    timeStep = Math.floor(duration / numThumbnails);
    timemarks = timemarks.concat(Array.from(Array(numThumbnails).keys()));
  } else {
    const numThumbnails = 7;
    timeStep = Math.floor(duration / numThumbnails);
    timemarks = timemarks.concat(Array.from(Array(numThumbnails).keys()));
  }
  return _.uniq(
    timemarks.map((idx) => 1 + idx * timeStep).filter((t) => t < duration)
  );
};

[0.01, 0.1, 1, 1.5, 2.5, 3, 4.744, 5, 7, 10, 15, 30, 60, 120].forEach(
  (duration) => {
    console.log(`
    -----
    input duration: ${duration}
    output timestamps: ${calculateTimemarks(duration)}
`);
  }
);

// $ npm run sandbox ./src/sandbox/calculateTimemarks.ts
