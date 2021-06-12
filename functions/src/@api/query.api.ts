import admin from "firebase-admin";
import type {
  ResolversParentTypes,
  QueryGetScenesByTagArgs,
  Scene,
} from "@customTypes/sharedTypes.spec";

export const firestore = (() => {
  return admin.firestore();
})();

export const getScenesByTag = async (
  _: ResolversParentTypes,
  { tag }: QueryGetScenesByTagArgs,
  { firestore }
): Promise<Scene> => {
  console.log(tag);
  await firestore.collection();
  return {
    sceneId: "String!",
    publicUrl: "String!",
    durationInSeconds: 1.44,
    labels: ["Tag"],
    thumbnails: ["String"],
  };
};
