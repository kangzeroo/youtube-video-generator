import admin from "firebase-admin";
import type {
  QueryGetScenesByTagArgs,
  MutationDeleteSceneArgs,
  Scene,
} from "@customTypes/graphql-types";
import type {
  IGraphQLContext,
  TApolloConstructorRootValue,
} from "@customTypes/types.spec";

export const firestore = (() => {
  return admin.firestore();
})();

/* eslint-disable @typescript-eslint/no-explicit-any */
const transformFirestoreSceneToGQL = (scene: any) => {
  return {
    sceneId: scene.sceneId,
    publicUrl: scene.publicUrl,
    durationInSeconds: scene.durationInSeconds,
    labels: scene.labels || [],
    thumbnails: scene.thumbnails || [],
    downloadedDate: scene.downloadedDate,
  };
};

export const getScenesByTag = async (
  _: TApolloConstructorRootValue,
  { tags }: QueryGetScenesByTagArgs,
  { firestore }: IGraphQLContext
): Promise<Scene[]> => {
  let maxTenTags = tags;
  if (tags && tags.length > 10) {
    maxTenTags = tags.slice(9);
  }
  const scenes = await firestore
    .collection("scenes")
    .where("labels", "array-contains-any", maxTenTags)
    .orderBy("downloadedDate", "desc")
    .limit(50)
    .get()
    .then((querySnapshot) => {
      const results: Scene[] = [];
      querySnapshot.forEach((doc) => {
        results.push(transformFirestoreSceneToGQL(doc.data()));
      });
      return results;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
  return scenes;
};

export const getMostRecentScenes = async (): Promise<Scene[]> => {
  const scenes = await firestore
    .collection("scenes")
    .orderBy("downloadedDate", "desc")
    .limit(100)
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
  return scenes;
};

export const deleteScene = async (
  _: any,
  { sceneId }: MutationDeleteSceneArgs,
  { firestore }: IGraphQLContext
): Promise<string> => {
  const results = await firestore
    .collection("scenes")
    .where("sceneId", "==", sceneId)
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
  return `Deleted scenes ${results.join(", ")}`;
};
