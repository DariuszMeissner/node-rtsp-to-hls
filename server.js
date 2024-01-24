const express = require('express');
require('dotenv').config();
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { startRecording, stopRecording } = require('./recordings');
const { startStreamConversion, scheduleStreamRestart } = require('./hlsStream');

const app = express();
const port = 3000;
let isRecording = false;
let recorderProcess = null;
let streamProcess = null;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

express.static.mime.define({ 'application/x-mpegURL': ['m3u8'] });
express.static.mime.define({ 'video/MP2T': ['ts'] });

app.use(helmet.contentSecurityPolicy({
  directives: {
    "default-src": ["'self'"],
    "media-src": ["'self'", "blob:"],
    "script-src": ["'self'", "https://cdn.jsdelivr.net/npm/hls.js@latest"],
    "worker-src": ["'self'", "blob:"]
  }
}));
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(limiter);

app.use(express.static('public'));

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

// Start the stream
streamProcess = startStreamConversion(process.env.RTSP_URL);

scheduleStreamRestart(process.env.RTSP_UR)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});