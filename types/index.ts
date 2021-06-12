import { ApolloServer } from "apollo-server";
import schema from "../functions/src/@graphql/schema";

// we omit the resolvers as this local server is only intended to generate types
// we cannot import resolvers here, as they depends on our generated types thus causing a circular dependency
const server = new ApolloServer({
  typeDefs: schema,
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
