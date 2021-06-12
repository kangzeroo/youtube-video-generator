import { ApolloServer } from "apollo-server-cloud-functions";
import schema from "@graphql/schema";
import resolvers from "@graphql/resolvers";
import { firestore } from "@api/query.api";
import { IGraphQLContext } from "@customTypes/types.spec";

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const graphqpl = () => {
  const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    introspection: true,
    playground: true,
    context: ({
      req,
      res,
    }: {
      req: Request;
      res: Response;
    }): IGraphQLContext => ({
      headers: req.headers,
      req,
      res,
      firestore,
    }),
  });
  return server.createHandler({
    cors: {
      origin: "*",
      // change credentials to true to enable CORS response for requests with credentials (cookies, http auth)
      credentials: false,
    },
  });
};

export default graphqpl;
