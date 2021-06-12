import { gql } from "apollo-server-cloud-functions";

const schema = gql`
  type Query {
    "A simple type for getting started!"
    hello: String
  }
`;

export default schema;
