// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
import * as functions from "firebase-functions";
// import { TDemoSharedType } from "@customTypes/sharedTypes.spec";

const graphql = functions.https.onRequest((req, res) => {
  // const heartbeat: TDemoSharedType = "Heartbeat alive...";
  const heartbeat = "Heartbeat alive...";
  res.send(heartbeat);
});

export default graphql;
