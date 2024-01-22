const express = require('express');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;
let recorderProcess;

const outputDirectory = path.join(__dirname, 'recordings');

if (!fs.existsSync(outputDirectory)) {
  fs.mkdirSync(outputDirectory, { recursive: true });
}

// HLS output directory
const hlsOutputDir = path.join(__dirname, 'public/hls');
if (!fs.existsSync(hlsOutputDir)) {
  fs.mkdirSync(hlsOutputDir, { recursive: true });
}

// RTSP Stream URL
const rtspUrl = 'rtsp://stream:stream!@88.220.95.114:8555';

const getOutputFilePath = () => {
  const fileName = `recording-${new Date().toISOString()}.mp4`;
  return path.join(outputDirectory, fileName);
};

// Function to start converting RTSP to HLS
function startStreamConversion() {
  ffmpeg(rtspUrl, { timeout: 432000 })
    .addOptions([
      '-profile:v baseline',
      '-s 640x360',
      '-start_number 0',
      '-hls_time 2',
      '-hls_list_size 5',
      '-f hls',
      '-hls_flags delete_segments'
    ])
    .output(`${hlsOutputDir}/stream.m3u8`)
    .on('end', () => console.log('Stream conversion ended.'))
    .on('error', (err) => console.error('Error:', err))
    .run();
}

function startRecording(rtspUrl) {
  const outputPath = getOutputFilePath();

  recorderProcess = ffmpeg(rtspUrl)
    .on('start', (commandLine) => {
      console.log(`Recording started: ${commandLine}`);
    })
    .on('error', (err, stdout, stderr) => {
      console.error('Error occurred:', err.message);
    })
    .on('end', () => {
      console.log('Recording stopped');
    })
    .size('640x360')
    .output(outputPath)
    .videoCodec('libx264')
    .format('mp4')
    .run();
}

function stopRecording() {
  if (recorderProcess) {
    // recorderProcess.kill('SIGINT');
    recorderProcess.kill();
  }
}

express.static.mime.define({ 'application/x-mpegURL': ['m3u8'] });
express.static.mime.define({ 'video/MP2T': ['ts'] });

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Serve HLS files
app.use('/hls', express.static('public/hls'));

// Serve static files
app.use(express.static('public'));

// Endpoint to start streaming
app.get('/start-stream', (req, res) => {
  startStreamConversion();
  res.send('Stream conversion started.');
});

app.get('/start-recording', (req, res) => {
  startRecording(rtspUrl);
  res.send('Recording started');
});

app.get('/stop-recording', (req, res) => {
  stopRecording();
  res.send('Recording stopped');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});