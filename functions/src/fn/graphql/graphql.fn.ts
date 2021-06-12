// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
import * as functions from "firebase-functions";
import gqlServer from "@graphql/server";

const server = gqlServer();
const graphql = functions.https.onRequest(server);

export default graphql;
