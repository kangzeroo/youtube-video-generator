import { getScenesByTag } from "@api/query.api";
import { Resolvers } from "@customTypes/graphql-types";

const resolverFunctions: Resolvers = {
  Query: {
    getScenesByTag,
  },
};

export default resolverFunctions;
