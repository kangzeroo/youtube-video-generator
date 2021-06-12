/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import { useMediaQuery } from "react-responsive";
import { ApolloError, gql, useQuery } from "@apollo/client";
import {
  DislikeFilled,
  FolderOpenFilled,
  LikeFilled,
  TagsFilled,
} from "@ant-design/icons";
import { Tag } from "antd";
import { List, Card } from "antd";
import VideoPlayer from "@components/videoplayer";
import type { Scene } from "@customTypes/graphql-types";

const videoPlayerOptions = (item: Scene) => {
  return {
    sources: [
      {
        src: item.publicUrl,
        type: "video/mp4",
      },
    ],
  };
};

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

interface IProps {
  searchString: string;
}
const SceneResults = ({ searchString }: IProps) => {
  const isPortrait = useMediaQuery({ orientation: "portrait" });
  const queryTags = searchString.split(",").map((tag) => tag.trim());
  interface IGetScenesByTagsQuery {
    loading: boolean;
    error?: ApolloError;
    data?: {
      getScenesByTag: Scene[];
    };
  }
  const { loading, error, data }: IGetScenesByTagsQuery = useQuery(
    GET_SCENES_BY_TAGS,
    {
      variables: { tags: queryTags },
    }
  );
  if (loading) {
    return <div>{"Loading..."}</div>;
  }
  if (error) {
    return <div>{`Error! ${error.message}`}</div>;
  }
  const scenes = data?.getScenesByTag || [];

  return (
    <List
      grid={isPortrait ? { gutter: 16, column: 2 } : { gutter: 16, column: 4 }}
      dataSource={scenes}
      renderItem={(item: Scene) => {
        return (
          <List.Item>
            <Card
              key={item.sceneId}
              hoverable
              cover={<VideoPlayer options={videoPlayerOptions(item)} />}
              actions={[
                <div css={styles.action}>
                  <LikeFilled key="like" />
                  <span css={styles.actionText}>Like</span>
                </div>,
                <div css={styles.action}>
                  <DislikeFilled key="dislike" />
                  <span css={styles.actionText}>Dislike</span>
                </div>,
                <div css={styles.action}>
                  <TagsFilled />
                  <span css={styles.actionText}>Tags</span>
                </div>,
                <div
                  onClick={() => {
                    window?.open(item.publicUrl, "_blank")?.focus();
                  }}
                  css={styles.action}
                >
                  <FolderOpenFilled key="save" />
                  <span css={styles.actionText}>Save</span>
                </div>,
              ]}
              bodyStyle={styles.cardBody}
            >
              {item.labels &&
                item.labels.map((t: string) => <Tag key={t}>{t}</Tag>)}
            </Card>
          </List.Item>
        );
      }}
    />
  );
};

const styles = {
  cardBody: {
    textAlign: "center" as "center",
    padding: "5px",
  },
  action: {
    display: "flex",
    flexDirection: "column" as "column",
  },
  actionText: {
    fontSize: "0.5rem",
  },
};

export default SceneResults;
