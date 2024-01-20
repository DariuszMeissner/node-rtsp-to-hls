const express = require('express');
const Stream = require('node-rtsp-stream');
const cors = require('cors');
const Recorder = require('node-rtsp-recorder').Recorder;

const app = express();
const port = 3002;
let stream = null;
let recorder = null;
let currentRtspStreamUrl = '';




app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.get('/stream', (req, res) => {
  const newRtspStreamUrl = req.query.rtsp;

  // Create the WebSocket stream only if it doesn't exist or the RTSP URL has changed
  if (!stream || currentRtspStreamUrl !== newRtspStreamUrl) {
    if (stream || newRtspStreamUrl === 'stop') {
      stream.stop();
      stream = null;
      stopRecording(); // Stop recording if stream is stopped
    }

    if (newRtspStreamUrl !== 'stop') {
      stream = new Stream({
        name: 'Camera Stream',
        streamUrl: newRtspStreamUrl,
        wsPort: 9999,
        quality: 'medium',
        ffmpegOptions: { // Options ffmpeg flags
          '-rtsp_transport': 'tcp', // Use TCP for RTSP transport
          '-preset': 'medium'
          // You can add other FFmpeg options as needed
        }
      });
      currentRtspStreamUrl = newRtspStreamUrl;
      startRecording(newRtspStreamUrl); // Start recording the new stream
    }
  }

  res.status(200).json({ url: `ws://localhost:9999` });
});

app.get('/start-recording', (req, res) => {
  const newRtspStreamUrl = req.query.rtsp;
  startRecording(newRtspStreamUrl)
  res.send('Recording started');
});



const startRecording = (rtspUrl) => {
  recorder = new Recorder({
    url: rtspUrl,
    timeLimit: 320,
    folder: 'stream', // Directory where recordings will be saved
    name: 'cameraStream',
    type: 'video', // Record video
  });
  recorder.startRecording();



  recorder.start()
  console.log('Recording started');

}

const stopRecording = () => {
  if (recorder) {
    recorder.stopRecording();
    recorder = null;
    console.log('Recording stopped');
  }
}

app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});