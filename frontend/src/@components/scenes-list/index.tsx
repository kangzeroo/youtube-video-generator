/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import { Fragment } from "react";
import { useMediaQuery } from "react-responsive";
import VideoCard from "@components/video-card";
import { List } from "antd";
import type { Scene } from "@customTypes/graphql-types";

interface IProps {
  scenes: Scene[];
}
const ScenesList = ({ scenes }: IProps) => {
  const isPortrait = useMediaQuery({ orientation: "portrait" });
  return (
    <Fragment>
      <List
        grid={
          isPortrait ? { gutter: 16, column: 2 } : { gutter: 16, column: 4 }
        }
        dataSource={scenes}
        renderItem={(item: Scene) => {
          return (
            <List.Item>
              <VideoCard item={item} />
            </List.Item>
          );
        }}
      />
    </Fragment>
  );
};

export default ScenesList;
