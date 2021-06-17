import { gql } from "apollo-server-cloud-functions";

const schema = gql`
  type Query {
    getScenesByTag(tags: [Tag!]!): [Scene]
    getMostRecentScenes: [Scene]
  }
  type Mutation {
    deleteScene(sceneId: String!): String
  }
  scalar Date
  scalar Tag
  type Scene {
    sceneId: String!
    publicUrl: String!
    durationInSeconds: Float
    labels: [Tag]!
    thumbnails: [String]
    downloadedDate: Date
  }
`;

export default schema;
