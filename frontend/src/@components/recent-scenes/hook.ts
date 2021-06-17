import { ApolloError, gql, useQuery } from "@apollo/client";
import type { Scene } from "@customTypes/graphql-types";

const GET_RECENT_SCENES = gql`
  query getMostRecentScenes {
    getMostRecentScenes {
      sceneId
      publicUrl
      durationInSeconds
      labels
      thumbnails
    }
  }
`;

export const useRecentScenes = () => {
  return useQuery(GET_RECENT_SCENES);
};

export interface IUseRecentScenesResults {
  loading: boolean;
  error?: ApolloError;
  data?: {
    getMostRecentScenes: Scene[];
  };
}
