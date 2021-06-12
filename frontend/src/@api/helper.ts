import type { TDemoSharedType } from "@customTypes/sharedTypes";

export const heartbeat = (pulse = 3000): TDemoSharedType => {
  let count = 1;
  setInterval(() => {
    console.log(`... heartbeat ${count}`);
    count++;
  }, pulse);
  return "Heartbeat initiated!";
};
