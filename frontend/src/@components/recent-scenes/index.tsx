/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import ScenesList from "@components/scenes-list";
import {
  useRecentScenes,
  IUseRecentScenesResults,
} from "@components/recent-scenes/hook";

const SceneResults = () => {
  const { loading, error, data }: IUseRecentScenesResults = useRecentScenes();

  if (loading) {
    return <div>{"Loading..."}</div>;
  }
  if (error) {
    return <div>{`Error! ${error.message}`}</div>;
  }
  const scenes = data?.getMostRecentScenes || [];

  return <ScenesList scenes={scenes} />;
};

export default SceneResults;
