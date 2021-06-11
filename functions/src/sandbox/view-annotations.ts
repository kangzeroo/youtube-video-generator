import * as jsonVideoIntel from "./video-labels-wholesome.json";
import admin from "firebase-admin";
import { protos } from "@google-cloud/video-intelligence";
import camelize from "camelize";

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

const run = async (
  jsonObj: protos.google.cloud.videointelligence.v1.AnnotateVideoResponse
): Promise<void> => {
  console.log(jsonObj);
  return new Promise((res, rej) => {
    setTimeout(() => {
      res();
    }, 9999999);
  });
};
const camelJson = camelize(jsonVideoIntel);
run(camelJson);

// $ npm run sandbox ./src/sandbox/view-annotations.ts
