/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
// import { CSSProperties } from "react";
import {
  DislikeFilled,
  FolderOpenFilled,
  LikeFilled,
  TagsFilled,
} from "@ant-design/icons";
import VideoPlayer from "@components/videoplayer";
import { COLORS } from "@constants/styles.spec";
import { useMediaQuery } from "react-responsive";
import logo from "@assets/youtube-generator-logo.png";
import { List, Card } from "antd";
import { Input, Space, Image, Tag } from "antd";
const { Search } = Input;

interface IDataItem {
  title: string[];
  thumbnail: string[];
  video: string;
}
const data: IDataItem[] = [
  {
    title: ["Title 1", "Title 2", "Title 3", "Title 4"],
    thumbnail: [
      "https://firebasestorage.googleapis.com/v0/b/video-thumbnails-88-prod/o/scene%2Fscene-00c64a66-47e4-4b76-9194-1da3e7b54f60%2Fthumbnail%2Fthumbnail-0-scene-00c64a66-47e4-4b76-9194-1da3e7b54f60.png?alt=media&token=1d7ebd57-fc47-4372-b1b9-0122186332f1",
    ],
    video:
      "https://firebasestorage.googleapis.com/v0/b/scene-videos-88-prod/o/user%2Fdefault-user%2Fvideo%2F2895bc3c-c4eb-42b3-a0f0-2e0397db79aa%2Fscene%2Fscene-08d29165-86c5-4294-946c-eaf22f380406%2Fscene-08d29165-86c5-4294-946c-eaf22f380406.mp4?alt=media&token=9d6ce3df-15ee-48df-9b7b-20ba78b3b6ee",
  },
  {
    title: ["Title 2", "Title 2", "Title 3"],
    thumbnail: [
      "https://firebasestorage.googleapis.com/v0/b/video-thumbnails-88-prod/o/scene%2Fscene-00c64a66-47e4-4b76-9194-1da3e7b54f60%2Fthumbnail%2Fthumbnail-1-scene-00c64a66-47e4-4b76-9194-1da3e7b54f60.png?alt=media&token=1c423780-4ee9-4046-ab2d-50c5933a1795",
    ],
    video:
      "https://firebasestorage.googleapis.com/v0/b/scene-videos-88-prod/o/user%2Fdefault-user%2Fvideo%2F2895bc3c-c4eb-42b3-a0f0-2e0397db79aa%2Fscene%2Fscene-12d51097-13a5-4c8a-8ffe-e27a58076b85%2Fscene-12d51097-13a5-4c8a-8ffe-e27a58076b85.mp4?alt=media&token=7aa9c6f1-938d-477d-a28b-3b7e770a5a76",
  },
  {
    title: ["Title 3"],
    thumbnail: [
      "https://firebasestorage.googleapis.com/v0/b/video-thumbnails-88-prod/o/scene%2Fscene-00c64a66-47e4-4b76-9194-1da3e7b54f60%2Fthumbnail%2Fthumbnail-1-scene-00c64a66-47e4-4b76-9194-1da3e7b54f60.png?alt=media&token=1c423780-4ee9-4046-ab2d-50c5933a1795",
    ],
    video:
      "https://firebasestorage.googleapis.com/v0/b/scene-videos-88-prod/o/user%2Fdefault-user%2Fvideo%2F2895bc3c-c4eb-42b3-a0f0-2e0397db79aa%2Fscene%2Fscene-32b631a5-3f97-45bb-b88a-f25b603088e2%2Fscene-32b631a5-3f97-45bb-b88a-f25b603088e2.mp4?alt=media&token=6baf90c1-b8ca-42e4-88c3-ae97fee6eefc",
  },
  {
    title: ["Title 4", "Title 2"],
    thumbnail: [
      "https://firebasestorage.googleapis.com/v0/b/video-thumbnails-88-prod/o/scene%2Fscene-00c64a66-47e4-4b76-9194-1da3e7b54f60%2Fthumbnail%2Fthumbnail-3-scene-00c64a66-47e4-4b76-9194-1da3e7b54f60.png?alt=media&token=c13cdade-1886-4253-8bca-527cebdd5fa6",
    ],
    video:
      "https://firebasestorage.googleapis.com/v0/b/scene-videos-88-prod/o/user%2Fdefault-user%2Fvideo%2F2895bc3c-c4eb-42b3-a0f0-2e0397db79aa%2Fscene%2Fscene-15c274f3-55cb-49e6-b26b-a388f76918df%2Fscene-15c274f3-55cb-49e6-b26b-a388f76918df.mp4?alt=media&token=b313c27b-14d6-4f11-a532-12c9142f7309",
  },
  {
    title: ["Title 1"],
    thumbnail: [
      "https://firebasestorage.googleapis.com/v0/b/video-thumbnails-88-prod/o/scene%2Fscene-00c64a66-47e4-4b76-9194-1da3e7b54f60%2Fthumbnail%2Fthumbnail-4-scene-00c64a66-47e4-4b76-9194-1da3e7b54f60.png?alt=media&token=838bbf8f-7efa-404c-8944-fb719e1bf7d0",
    ],
    video:
      "https://firebasestorage.googleapis.com/v0/b/scene-videos-88-prod/o/user%2Fdefault-user%2Fvideo%2F2895bc3c-c4eb-42b3-a0f0-2e0397db79aa%2Fscene%2Fscene-3dabf722-09c4-4de2-8585-8220e20dde86%2Fscene-3dabf722-09c4-4de2-8585-8220e20dde86.mp4?alt=media&token=fdbda8b6-2dbe-41cf-937e-89e873991969",
  },
  {
    title: ["Title 2", "Title 2", "Title 3", "Title 4", "Title 5"],
    thumbnail: [
      "https://firebasestorage.googleapis.com/v0/b/video-thumbnails-88-prod/o/scene%2Fscene-00c64a66-47e4-4b76-9194-1da3e7b54f60%2Fthumbnail%2Fthumbnail-5-scene-00c64a66-47e4-4b76-9194-1da3e7b54f60.png?alt=media&token=7c854842-c5ba-47a0-ab6a-3bd7d4ac314b",
    ],
    video:
      "https://firebasestorage.googleapis.com/v0/b/scene-videos-88-prod/o/user%2Fdefault-user%2Fvideo%2F2895bc3c-c4eb-42b3-a0f0-2e0397db79aa%2Fscene%2Fscene-b633255b-2a8e-49f9-ad3c-7642c6fa1f35%2Fscene-b633255b-2a8e-49f9-ad3c-7642c6fa1f35.mp4?alt=media&token=4b14e114-fabc-467d-9b71-543f99dbd8ae",
  },
  {
    title: ["Title 3"],
    thumbnail: [
      "https://firebasestorage.googleapis.com/v0/b/video-thumbnails-88-prod/o/scene%2Fscene-08d29165-86c5-4294-946c-eaf22f380406%2Fthumbnail%2Fthumbnail-0-scene-08d29165-86c5-4294-946c-eaf22f380406.png?alt=media&token=4c531a8d-ff49-42c0-bdde-b4256d414889",
    ],
    video:
      "https://firebasestorage.googleapis.com/v0/b/scene-videos-88-prod/o/user%2Fdefault-user%2Fvideo%2F2895bc3c-c4eb-42b3-a0f0-2e0397db79aa%2Fscene%2Fscene-43af5d60-d7c4-46ba-a7e7-8f3df07bee11%2Fscene-43af5d60-d7c4-46ba-a7e7-8f3df07bee11.mp4?alt=media&token=4fa58fb2-c122-4b38-a135-f8c30666f517",
  },
  {
    title: ["Title 4"],
    thumbnail: [
      "https://firebasestorage.googleapis.com/v0/b/video-thumbnails-88-prod/o/scene%2Fscene-08d29165-86c5-4294-946c-eaf22f380406%2Fthumbnail%2Fthumbnail-1-scene-08d29165-86c5-4294-946c-eaf22f380406.png?alt=media&token=d543b592-3fbf-4cc8-b563-09b3bd2e1164",
    ],
    video:
      "https://firebasestorage.googleapis.com/v0/b/scene-videos-88-prod/o/user%2Fdefault-user%2Fvideo%2F2895bc3c-c4eb-42b3-a0f0-2e0397db79aa%2Fscene%2Fscene-8a2966dd-8450-47f6-9559-e8560e526782%2Fscene-8a2966dd-8450-47f6-9559-e8560e526782.mp4?alt=media&token=ed81c456-ea24-4579-be2c-5a0bfd206c2f",
  },
  {
    title: ["Title 1"],
    thumbnail: [
      "https://firebasestorage.googleapis.com/v0/b/video-thumbnails-88-prod/o/scene%2Fscene-08d29165-86c5-4294-946c-eaf22f380406%2Fthumbnail%2Fthumbnail-2-scene-08d29165-86c5-4294-946c-eaf22f380406.png?alt=media&token=19661e59-3529-4223-83ac-476aa45875cc",
    ],
    video:
      "https://firebasestorage.googleapis.com/v0/b/scene-videos-88-prod/o/user%2Fdefault-user%2Fvideo%2F2895bc3c-c4eb-42b3-a0f0-2e0397db79aa%2Fscene%2Fscene-6cefa1f7-a64e-4217-bec6-0dec965e18ee%2Fscene-6cefa1f7-a64e-4217-bec6-0dec965e18ee.mp4?alt=media&token=112f98c4-80ca-4f58-afd4-3a10225b4642",
  },
  {
    title: ["Title 2"],
    thumbnail: [
      "https://firebasestorage.googleapis.com/v0/b/video-thumbnails-88-prod/o/scene%2Fscene-08d29165-86c5-4294-946c-eaf22f380406%2Fthumbnail%2Fthumbnail-3-scene-08d29165-86c5-4294-946c-eaf22f380406.png?alt=media&token=e3f81584-d4a1-4898-8960-f2f51fe89d7c",
    ],
    video:
      "https://firebasestorage.googleapis.com/v0/b/scene-videos-88-prod/o/user%2Fdefault-user%2Fvideo%2F2895bc3c-c4eb-42b3-a0f0-2e0397db79aa%2Fscene%2Fscene-790bdc8b-13db-420c-8077-74aa12aff69a%2Fscene-790bdc8b-13db-420c-8077-74aa12aff69a.mp4?alt=media&token=fa3a6f57-6833-4516-8423-b658c7b9aeb2",
  },
  {
    title: ["Title 3"],
    thumbnail: [
      "https://firebasestorage.googleapis.com/v0/b/video-thumbnails-88-prod/o/scene%2Fscene-26ee2022-6f00-4f6a-ba93-e5bc81263da9%2Fthumbnail%2Fthumbnail-0-scene-26ee2022-6f00-4f6a-ba93-e5bc81263da9.png?alt=media&token=d7ff1c80-720b-47e0-8006-07eaf2b880a4",
    ],
    video:
      "https://firebasestorage.googleapis.com/v0/b/scene-videos-88-prod/o/user%2Fdefault-user%2Fvideo%2F2895bc3c-c4eb-42b3-a0f0-2e0397db79aa%2Fscene%2Fscene-61b8b9e4-3559-426b-a828-6252862b79b5%2Fscene-61b8b9e4-3559-426b-a828-6252862b79b5.mp4?alt=media&token=3224681d-04ec-4f59-beb5-9c9e217d6430",
  },
  {
    title: ["Title 4"],
    thumbnail: [
      "https://firebasestorage.googleapis.com/v0/b/video-thumbnails-88-prod/o/scene%2Fscene-26ee2022-6f00-4f6a-ba93-e5bc81263da9%2Fthumbnail%2Fthumbnail-1-scene-26ee2022-6f00-4f6a-ba93-e5bc81263da9.png?alt=media&token=2e2a7883-9fe7-4871-b826-af7a59b100a6",
    ],
    video:
      "https://firebasestorage.googleapis.com/v0/b/scene-videos-88-prod/o/user%2Fdefault-user%2Fvideo%2F2895bc3c-c4eb-42b3-a0f0-2e0397db79aa%2Fscene%2Fscene-e9f29cce-750f-466c-8a2e-dd1d0b725c49%2Fscene-e9f29cce-750f-466c-8a2e-dd1d0b725c49.mp4?alt=media&token=e857765e-995e-456e-a24a-e5c3c0e58bf7",
  },
];

const BrowserPage = () => {
  const onSearch = (value: string) => console.log(value);

  const isPortrait = useMediaQuery({ orientation: "portrait" });
  console.log(`isPortrait=${isPortrait}`);

  const videoPlayerOptions = (item: IDataItem) => {
    return {
      sources: [
        {
          src: item.video,
          type: "video/mp4",
        },
      ],
    };
  };

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
        </div>
        <List
          grid={
            isPortrait ? { gutter: 16, column: 2 } : { gutter: 16, column: 6 }
          }
          dataSource={data}
          renderItem={(item) => (
            <List.Item>
              <Card
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
                  <div css={styles.action}>
                    <FolderOpenFilled key="save" />
                    <span css={styles.actionText}>Save</span>
                  </div>,
                ]}
                bodyStyle={styles.cardBody}
              >
                {item.title.map((t) => (
                  <Tag>{t}</Tag>
                ))}
              </Card>
            </List.Item>
          )}
        />
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

export default BrowserPage;
