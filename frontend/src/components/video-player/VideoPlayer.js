import React, { useEffect, useRef, } from 'react'
import PropTypes from 'prop-types'
import Hls from 'hls.js'
import { videoSource } from '../../config/config'

const VideoPlayer = ({ streamStarted }) => {
  const videoRef = useRef()
  const hls = useRef()

  function showStream() {
    const video = videoRef.current;
    let hls;

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(videoSource);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => video.play());
    } else if (video.canPlayType('application/x-mpegURL')) {
      video.src = videoSource;
      video.addEventListener('loadedmetadata', () => video.play());
    }
  }

  useEffect(() => {
    const currentHls = hls.current;
    if (streamStarted) {
      showStream();
    }

    return () => {
      if (currentHls) {
        currentHls.destroy();
      }
    };
  }, [streamStarted]);

  if (!streamStarted) return null

  return (
    <video ref={videoRef} controls>
      <source src={videoSource} type="application/x-mpegURL" />
      Your browser does not support the video tag.
    </video>
  )
}

VideoPlayer.propTypes = {
  streamStarted: PropTypes.bool.isRequired
}

export default VideoPlayer