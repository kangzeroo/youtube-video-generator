import {
  getScenesByTag,
  getMostRecentScenes,
  deleteScene,
} from "@api/query.api";
import { Resolvers } from "@customTypes/graphql-types";

const resolverFunctions: Resolvers = {
  Query: {
    getScenesByTag,
    getMostRecentScenes,
  },
  Mutation: {
    deleteScene,
  },
};

export default resolverFunctions;
