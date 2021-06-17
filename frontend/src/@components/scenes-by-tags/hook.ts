import { ApolloError, gql, useQuery } from "@apollo/client";
import type { Scene } from "@customTypes/graphql-types";

const GET_SCENES_BY_TAGS = gql`
  query getScenesByTags($tags: [Tag!]!) {
    getScenesByTag(tags: $tags) {
      sceneId
      publicUrl
      durationInSeconds
      labels
      thumbnails
    }
  }
`;

export const useScenesByTags = (searchString: string) => {
  const queryTags = searchString.split(",").map((tag) => tag.trim());

  return useQuery(GET_SCENES_BY_TAGS, {
    variables: { tags: queryTags },
  });
};

export interface IUseScenesByTagsResults {
  loading: boolean;
  error?: ApolloError;
  data?: {
    getScenesByTag: Scene[];
  };
}
