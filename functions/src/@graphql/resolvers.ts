import { getScenesByTag, getMostRecentScenes } from "@api/query.api";
import { Resolvers } from "@customTypes/graphql-types";

const resolverFunctions: Resolvers = {
  Query: {
    getScenesByTag,
    getMostRecentScenes,
  },
};

export default resolverFunctions;
