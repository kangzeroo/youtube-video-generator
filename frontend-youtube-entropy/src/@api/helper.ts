export const heartbeat = (pulse = 3000) => {
  let count = 1;
  setInterval(() => {
    console.log(`... heartbeat ${count}`);
    count++;
  }, pulse);
};
