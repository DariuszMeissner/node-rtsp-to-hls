const express = require('express');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// HLS output directory
const hlsOutputDir = path.join(__dirname, 'public/hls');
if (!fs.existsSync(hlsOutputDir)) {
  fs.mkdirSync(hlsOutputDir, { recursive: true });
}

// RTSP Stream URL
const rtspUrl = 'your_rtsp_stream_url';

// Function to start converting RTSP to HLS
function startStreamConversion() {
  ffmpeg(rtspUrl, { timeout: 432000 })
    .addOptions([
      '-profile:v baseline',
      '-s 640x360',
      '-start_number 0',
      '-hls_time 10',
      '-hls_list_size 0',
      '-f hls'
    ])
    .output(`${hlsOutputDir}/stream.m3u8`)
    .on('end', () => console.log('Stream conversion ended.'))
    .on('error', (err) => console.error('Error:', err))
    .run();
}

// Serve HLS files
app.use('/hls', express.static('public/hls'));

// Endpoint to start streaming
app.get('/start-stream', (req, res) => {
  startStreamConversion();
  res.send('Stream conversion started.');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});