/** @jsxRuntime classic */
/** @jsx jsx */

/**
 *
 * This component should be moved out to a HOC!
 * Pass in the GraphQL data into the Scenes so that we arent repeating our UI code
 *
 */

import { jsx } from "@emotion/react";
import { useMediaQuery } from "react-responsive";
import { ApolloError, gql, useQuery } from "@apollo/client";
import { List } from "antd";
import type { Scene } from "@customTypes/graphql-types";
import VideoCard from "@components/video-card";

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

const SceneResults = () => {
  const isPortrait = useMediaQuery({ orientation: "portrait" });
  interface IGetRecentScenesQuery {
    loading: boolean;
    error?: ApolloError;
    data?: {
      getMostRecentScenes: Scene[];
    };
  }
  const { loading, error, data }: IGetRecentScenesQuery =
    useQuery(GET_RECENT_SCENES);
  if (loading) {
    return <div>{"Loading..."}</div>;
  }
  if (error) {
    return <div>{`Error! ${error.message}`}</div>;
  }
  const scenes = data?.getMostRecentScenes || [];

  return (
    <List
      grid={isPortrait ? { gutter: 16, column: 2 } : { gutter: 16, column: 4 }}
      dataSource={scenes}
      renderItem={(item: Scene) => {
        return (
          <List.Item>
            <VideoCard item={item} />
          </List.Item>
        );
      }}
    />
  );
};

export default SceneResults;
