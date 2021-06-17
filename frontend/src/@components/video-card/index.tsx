/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import { gql, useMutation } from "@apollo/client";
import {
  DislikeFilled,
  FolderOpenFilled,
  LikeFilled,
  TagsFilled,
} from "@ant-design/icons";
import { Tag } from "antd";
import { Card } from "antd";
import type { Scene } from "@customTypes/graphql-types";
import VideoPlayer from "@components/videoplayer";

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

const DELETE_SCENE = gql`
  mutation deleteScene($sceneId: String!) {
    deleteScene(sceneId: $sceneId)
  }
`;

interface IProps {
  item: Scene;
}
const VideoCard = ({ item }: IProps) => {
  const [deleteScene] = useMutation(DELETE_SCENE);
  const dislikeScene = (sceneId: string) => () => {
    deleteScene({ variables: { sceneId } });
  };
  return (
    <Card
      key={item.sceneId}
      hoverable
      cover={
        <VideoPlayer
          sceneId={item.sceneId}
          options={videoPlayerOptions(item)}
          thumbnail={item.thumbnails && item.thumbnails[0]}
          videoSrc={item.publicUrl}
        />
      }
      actions={[
        <div css={styles.action}>
          <LikeFilled key="like" />
          <span css={styles.actionText}>Like</span>
        </div>,
        <div onClick={dislikeScene(item.sceneId)} css={styles.action}>
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
        item.labels.map((t: string, index: number) => (
          <Tag key={`${item.sceneId}-${index}-${t}`}>{t}</Tag>
        ))}
    </Card>
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

export default VideoCard;
