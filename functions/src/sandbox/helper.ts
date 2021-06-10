import { checkIfValidVideoFormat } from "@api/helper.api";

const fileName =
  "user/default-user/video/0ea4596c-727a-4dd6-80c4-b930de312d48.mp4";

console.log("checkIfValidVideoFormat");
console.log(checkIfValidVideoFormat(fileName));

// $ npm run sandbox ./src/sandbox/helper.ts
