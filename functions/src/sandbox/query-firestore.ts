import admin from "firebase-admin";

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
admin.initializeApp({
  credential: admin.credential.cert(params),
});

const firestore = admin.firestore();

const transformFirestoreSceneToGQL = (scene: any) => {
  return {
    sceneId: scene.sceneId,
    publicUrl: scene.publicUrl,
    durationInSeconds: scene.durationInSeconds,
    labels: scene.labels,
    thumbnails: scene.thumbnails,
  };
};

const run = async (): Promise<void> => {
  const maxTenTags = ["roti", "pizza"];
  const results = await firestore
    .collection("scenes")
    .where("labels", "array-contains-any", maxTenTags)
    .limit(30)
    .get()
    .then((querySnapshot) => {
      const results: any[] = [];
      querySnapshot.forEach((doc) => {
        results.push(transformFirestoreSceneToGQL(doc.data()));
      });
      return results;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
  console.log("results...");
  console.log(results);
  return new Promise((res, rej) => {
    setTimeout(() => {
      res();
    }, 9999999);
  });
};
run();

// $ npm run sandbox ./src/sandbox/query-firestore.ts
