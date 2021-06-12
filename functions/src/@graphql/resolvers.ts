// import { getScenesByTag } from "@api/query.api";
import { Resolvers, Scene } from "@customTypes/sharedTypes.spec";

const resolverFunctions: Resolvers = {
  Query: {
    getScenesByTag: async (_, __, { firestore }): Promise<Scene> => {
      await firestore.collection();
      return {
        sceneId: "String!",
        publicUrl: "String!",
        durationInSeconds: 1.44,
        labels: ["Tag"],
        thumbnails: ["String"],
      };
    },
  },
};

export default resolverFunctions;
