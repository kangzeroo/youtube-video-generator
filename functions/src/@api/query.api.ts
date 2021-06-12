import admin from "firebase-admin";
import type {
  QueryGetScenesByTagArgs,
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
    labels: scene.labels,
    thumbnails: scene.thumbnails,
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
