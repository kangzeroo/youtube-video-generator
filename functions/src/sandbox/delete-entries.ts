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

const run = async (): Promise<void> => {
  const minDuration = 5;
  const results = await firestore
    .collection("scenes")
    .where("durationInSeconds", "<", minDuration)
    .get()
    .then((querySnapshot) => {
      const results: any[] = [];
      querySnapshot.forEach((doc) => {
        results.push(doc.data());
      });
      return results;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
  console.log("results...");
  console.log(results);
  await Promise.all(
    results.map(async (doc) => {
      await firestore
        .collection("scenes")
        .doc(doc.sceneId)
        .delete()
        .then(() => {
          console.log("Document successfully deleted! ", doc.sceneId);
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
        });
    })
  );

  return new Promise((res, rej) => {
    setTimeout(() => {
      res();
    }, 9999999);
  });
};
run();

// $ npm run sandbox ./src/sandbox/delete-entries.ts
