import { gql } from "apollo-server-cloud-functions";

const schema = gql`
  type Query {
    getScenesByTag(tags: [Tag!]!): [Scene]
    getMostRecentScenes: [Scene]
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
