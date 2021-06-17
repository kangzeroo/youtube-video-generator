import React, { useEffect } from "react";
import videojs from "video.js";

// Styles
import "video.js/dist/video-js.css";

interface IVideoPlayerProps {
  options: videojs.PlayerOptions;
  thumbnail?: string | null;
  videoSrc: string;
}

const initialOptions: videojs.PlayerOptions = {
  controls: true,
  fluid: true,
  controlBar: {
    volumePanel: {
      inline: false,
    },
  },
};

const VideoPlayer: React.FC<IVideoPlayerProps> = ({
  options,
  thumbnail,
  videoSrc,
}) => {
  const videoNode = React.useRef<HTMLVideoElement>(null);
  const player = React.useRef<videojs.Player>();

  useEffect(() => {
    player.current = videojs(videoNode.current || "", {
      ...initialOptions,
      ...options,
    }).ready(function () {
      // console.log('onPlayerReady', this);
    });
    return () => {
      if (player.current) {
        player.current.dispose();
      }
    };
  }, [options]);

  const videoAttrs: { poster?: string } = {};
  if (thumbnail) {
    videoAttrs.poster = thumbnail;
  }

  return (
    <>
      {/* <link> lets us preload videos without blocking DOM */}
      <link rel="preload" as="video" href={videoSrc} />
      {/* <video preload="none"> because we don't want to spam max HTTP connections to same domain (HTTP 1.1-6 spec)
          this improves load speed significantly
      */}
      <video
        muted
        preload="none"
        autoPlay
        ref={videoNode}
        className="video-js"
        {...videoAttrs}
      />
    </>
  );
};

export default VideoPlayer;
