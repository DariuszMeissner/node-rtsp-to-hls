import React, { useRef } from 'react';
import JSMpeg from '@cycjimmy/jsmpeg-player';
import axios from 'axios';

const App = () => {
  const playerRef = useRef(null);

  const rtspurl = 'rtsp://stream:stream!@88.220.95.114:8555'; // Enter the RTSP URL here

  const httpRequest = (url) => {
    axios.get(`http://localhost:3002/stream?rtsp=${url}`);
  };

  const startRTSPFeed = () => {
    httpRequest(rtspurl);

    // Initialize JSMpeg Player on user interaction
    if (!playerRef.current) {
      const url = 'ws://localhost:9999';
      const canvas = document.getElementById('video-canvas');
      playerRef.current = new JSMpeg.Player(url, { canvas: canvas, audio: true });
    }
  };

  const stopRTSPFeed = () => {
    httpRequest('stop');
    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
    }
  };

  const toggleFullScreen = () => {
    const canvas = document.getElementById('video-canvas');
    if (!document.fullscreenElement) {
      if (canvas.requestFullscreen) {
        canvas.requestFullscreen();
      } else if (canvas.msRequestFullscreen) { // For IE11
        canvas.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) { // For IE11
        document.msExitFullscreen();
      }
    }
  }

  return (
    <div>
      <div style={{ position: "relative", width: '400px', height: 'auto' }}>
        <canvas
          id="video-canvas"
          style={{ width: '400px', height: 'auto', backgroundColor: 'black' }}>
        </canvas>
        <button
          onClick={toggleFullScreen}
          style={{ position: "absolute", bottom: 20, right: 20 }}
        >Toggle Full Screen</button>
      </div>
      <div>
        <button onClick={startRTSPFeed}>Start RTSP Feed</button>
        <button onClick={stopRTSPFeed}> Stop RTSP Feed</button>
      </div>
    </div >
  )
}

export default App

