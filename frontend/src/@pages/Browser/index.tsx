/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import { useState } from "react";
import { COLORS } from "@constants/styles.spec";
import logo from "@assets/youtube-generator-logo.png";
import { Input, Space, Image, Button } from "antd";
import ScenesByTags from "@components/scenes-by-tags";
import RecentScenes from "@components/recent-scenes";
const { Search } = Input;

const BrowserPage = () => {
  const [searchString, updateSearchString] = useState("");
  const [showMostRecent, updateShowMostRecent] = useState(true);

  const onSearch = (value: string) => {
    updateSearchString(value);
    updateShowMostRecent(false);
  };

  // we can use a closure to prevent re-rendering the same function in jsx
  const updateShowMostRecentFn = (bool: boolean) => () =>
    updateShowMostRecent(bool);

  return (
    <div css={styles.canvas}>
      <Space direction="vertical" align="center">
        <Space direction="horizontal" align="center">
          <Image src={logo} width="150px" />
          <h1 css={styles.h1}>{`Kangzeroo's YouTube Generator`}</h1>
        </Space>
        <div css={styles.searchBarWrapper}>
          <Search
            placeholder="Search For Scenes"
            allowClear
            enterButton="Search"
            size="large"
            onSearch={onSearch}
            style={styles.searchBar}
          />
          <Button onClick={updateShowMostRecentFn(true)}>
            Show Most Recent
          </Button>
        </div>
        {searchString && !showMostRecent && (
          <ScenesByTags searchString={searchString} />
        )}
        {showMostRecent && <RecentScenes />}
      </Space>
    </div>
  );
};

const styles = {
  h1: {
    fontSize: "1.8rem",
    fontWeight: 800,
  },
  canvas: {
    backgroundColor: COLORS.backgroundColorLightMode,
    minHeight: "100vh",
    height: "100%",
    width: "100vw",
    padding: "10px",
    display: "flex",
    flexDirection: "column" as "column",
    alignItems: "center",
  },
  searchBarWrapper: {},
  searchBar: {
    width: "300px",
    borderRadius: "20px",
    marginBottom: "20px",
  },
};

export default BrowserPage;
