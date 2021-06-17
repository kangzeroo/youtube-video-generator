/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import {
  useScenesByTags,
  IUseScenesByTagsResults,
} from "@components/scenes-by-tags/hook";
import ScenesList from "@components/scenes-list";

interface IProps {
  searchString: string;
}
const ScenesByTags = ({ searchString }: IProps) => {
  const { loading, error, data }: IUseScenesByTagsResults =
    useScenesByTags(searchString);
  if (loading) {
    return <div>{"Loading..."}</div>;
  }
  if (error) {
    return <div>{`Error! ${error.message}`}</div>;
  }
  const scenes = data?.getScenesByTag || [];

  return <ScenesList scenes={scenes} />;
};

export default ScenesByTags;
