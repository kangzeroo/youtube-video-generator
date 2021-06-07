import _ from "lodash";

export const calculateTimemarks = (duration: number): number[] => {
  if (duration <= 2) {
    return [parseFloat((duration / 2).toFixed(1))];
  } else if (duration <= 5) {
    const numThumbnails = 2;
    const timeStep = Math.floor(duration / numThumbnails);
    return _.uniq(
      Array.from(Array(numThumbnails).keys())
        .map((idx) => 1 + idx * timeStep)
        .filter((t) => t < duration)
    );
  } else if (duration <= 10) {
    const numThumbnails = 4;
    const timeStep = Math.floor(duration / numThumbnails);
    return _.uniq(
      Array.from(Array(numThumbnails).keys())
        .map((idx) => 1 + idx * timeStep)
        .filter((t) => t < duration)
    );
  } else if (duration <= 30) {
    const numThumbnails = 5;
    const timeStep = Math.floor(duration / numThumbnails);
    return _.uniq(
      Array.from(Array(numThumbnails).keys())
        .map((idx) => 1 + idx * timeStep)
        .filter((t) => t < duration)
    );
  } else if (duration <= 60) {
    const numThumbnails = 6;
    const timeStep = Math.floor(duration / numThumbnails);
    return _.uniq(
      Array.from(Array(numThumbnails).keys())
        .map((idx) => 1 + idx * timeStep)
        .filter((t) => t < duration)
    );
  }
  const numThumbnails = 7;
  const timeStep = Math.floor(duration / numThumbnails);
  return _.uniq(
    Array.from(Array(numThumbnails).keys())
      .map((idx) => 1 + idx * timeStep)
      .filter((t) => t < duration)
  );
};

[0.01, 0.1, 1, 1.5, 2.5, 3, 5, 7, 10, 15, 30, 60, 120].forEach((duration) => {
  console.log(`
    -----
    input duration: ${duration}
    output timestamps: ${calculateTimemarks(duration)}
`);
});
