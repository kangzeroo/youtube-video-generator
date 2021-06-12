import admin from "firebase-admin";
import type {
  ResolversParentTypes,
  QueryGetScenesByTagArgs,
  Scene,
} from "@customTypes/sharedTypes.spec";
import type { IGraphQLContext } from "@customTypes/types.spec";

export const firestore = (() => {
  return admin.firestore();
})();

export const getScenesByTag = async (
  _: ResolversParentTypes,
  { tag }: QueryGetScenesByTagArgs,
  { firestore }: IGraphQLContext
): Promise<Scene> => {
  console.log(tag);
  console.log(firestore);
  // await firestore.collection();
  return {
    sceneId: "String!",
    publicUrl: "String!",
    durationInSeconds: 1.44,
    labels: ["Tag"],
    thumbnails: ["String"],
  };
};
