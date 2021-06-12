import { gql } from "apollo-server-cloud-functions";

const schema = gql`
  type Query {
    "A simple type for getting started!"
    getScenesByTag(tag: Tag): Scene
  }
  scalar Tag
  type Scene {
    sceneId: String!
    publicUrl: String!
    durationInSeconds: Float
    labels: [Tag]!
    thumbnails: [String]
  }
`;

export default schema;
