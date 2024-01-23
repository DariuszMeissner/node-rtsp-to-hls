const express = require('express');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3000;
const outputDirectory = path.join(__dirname, 'recordings');
let isRecording = false;
let recorderProcessConfig = null;

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
  const timestamp = Date.now();
  const fileName = `posiedzenie-${timestamp}.mp4`;
  return path.join(outputDirectory, fileName);
};

let streamProcess = null;



// Function to start converting RTSP to HLS
function startStreamConversion() {
  if (streamProcess) {
    console.log("Stream already running.");
    return;
  }

  streamProcess = ffmpeg(rtspUrl)
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
    .audioCodec('aac')
    .on('end', () => {
      console.log('Stream conversion ended.')
      streamProcess = null;
      startStreamConversion();
    })
    .on('error', (err) => {
      console.error('Error:', err)
      streamProcess = null;
    })
    .on('start', () => {
      console.log('Stream started');
    })

  streamProcess.run();

}

function startRecording() {
  isRecording = true;

  const outputPath = getOutputFilePath();
  recorderProcessConfig = ffmpeg(rtspUrl)
    .output(outputPath)
    .size('640x360')
    .videoCodec('libx264')
    .audioCodec('aac')
    .format('mp4')
    .on('start', (commandLine) => {
      console.log(`Recording started: ${commandLine}`);
    })
    .on('error', (err, stdout, stderr) => {
      console.error('Error occurred:', err.message);
    })
    .on('end', () => {
      console.log(`Recording stopped!!!!!`);
    });

  recorderProcessConfig.run();
}

function stopRecording() {
  console.log("Attempting to stop recording");
  if (recorderProcessConfig) {
    recorderProcessConfig.kill('SIGINT');
    console.log('Recording stopped');
    isRecording = false;
  } else {
    console.log("No recording process found");
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

app.get('/start-recording', (req, res) => {
  startRecording(rtspUrl);

  const data = {
    isRecording: isRecording,
    message: 'Recording started'
  }
  res.json(data);
});

app.get('/stop-recording', (req, res) => {
  console.log("Received request to stop recording");

  stopRecording();

  const data = {
    isRecording: isRecording,
    message: 'Recording stopped'
  }
  res.json(data)
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// start stream
startStreamConversion()