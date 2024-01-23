const express = require('express');
require('dotenv').config();
const { startRecording, stopRecording } = require('./recordings');
const { startStreamConversion } = require('./hlsStream');

const app = express();
const port = 3000;
let isRecording = false;
let recorderProcess = null;
let streamProcess = null;

express.static.mime.define({ 'application/x-mpegURL': ['m3u8'] });
express.static.mime.define({ 'video/MP2T': ['ts'] });

app.use(express.static('public'));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/start-recording', (req, res) => {
  recorderProcess = startRecording(process.env.RTSP_URL, isRecording);
  isRecording = !!recorderProcess;

  res.json({
    isRecording,
    message: isRecording ? 'Recording started' : 'Recording failed to start'
  });
});

app.get('/stop-recording', (req, res) => {
  stopRecording(recorderProcess);
  isRecording = false;

  res.json({
    isRecording,
    message: 'Recording stopped'
  });
});

app.get('/recording-status', (req, res) => {
  res.json({ isRecording: isRecording })
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Start the stream
streamProcess = startStreamConversion(process.env.RTSP_URL);