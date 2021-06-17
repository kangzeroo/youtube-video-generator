import React, { useEffect, useRef } from "react";
import videojs from "video.js";

// Styles
import "video.js/dist/video-js.css";

interface IVideoPlayerProps {
  options: videojs.PlayerOptions;
  thumbnail?: string | null;
  videoSrc: string;
  sceneId: string;
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
  sceneId,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoNode = useRef<HTMLVideoElement>(null);
  const player = useRef<videojs.Player>();

  const videoPlayerId = `videoplayer-${sceneId}`;
  const videoPlayerWrapperId = `wrapper-${videoPlayerId}`;

  useEffect(() => {
    const intersectionObserverOptions = {
      // root=null means the viewport will be the window
      root: null,
      rootMargin: "0px",
      // how much of the video must appear in viewport in order to play
      threshold: 1.0,
    };
    const intersectionObserverCallback: IntersectionObserverCallback = (
      entries,
      observer
    ) => {
      entries.forEach((entry) => {
        if (entry.target.id === videoPlayerWrapperId) {
          if (entry.isIntersecting) {
            videoNode.current?.play();
          } else if (!videoNode.current?.paused) {
            videoNode.current?.pause();
          }
        }
      });
    };
    const observer = new IntersectionObserver(
      intersectionObserverCallback,
      intersectionObserverOptions
    );
    if (wrapperRef.current) {
      observer.observe(wrapperRef.current);
    }
  }, [videoPlayerWrapperId]);

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
      <link
        key={`preload-link-${videoPlayerId}`}
        rel="preload"
        as="video"
        href={videoSrc}
      />
      {/* we do not set <video preload="none"> because we don't want to spam max HTTP connections to same domain (HTTP 1.1-6 spec)
          this improves load speed significantly
      */}
      <div id={videoPlayerWrapperId} ref={wrapperRef}>
        <video
          id={videoPlayerId}
          muted
          preload="none"
          autoPlay={false}
          ref={videoNode}
          className="video-js"
          {...videoAttrs}
        />
      </div>
    </>
  );
};

export default VideoPlayer;
