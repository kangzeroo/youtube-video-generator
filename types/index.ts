import { ApolloServer } from "apollo-server";

import schema from "../functions/src/@graphql/schema";
import resolvers from "../functions/src/@graphql/resolvers";

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
