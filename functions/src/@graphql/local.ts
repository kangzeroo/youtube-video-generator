import { ApolloServer } from "apollo-server";

import schema from "@graphql/schema";
import resolvers from "@graphql/resolvers";

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  introspection: true,
  playground: true,
  context: ({ req, res }) => ({
    headers: req.headers,
    req,
    res,
  }),
});
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
