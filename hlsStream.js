const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

const hlsOutputDir = path.join(__dirname, 'public/hls');

function cleanHlsDirectory(directory) {
  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(directory, file), (err) => {
        if (err) throw err;
      });
    }
  });
}

function startStreamConversion(rtspUrl) {
  // Clean HLS output directory on startup
  if (!fs.existsSync(hlsOutputDir)) {
    fs.mkdirSync(hlsOutputDir, { recursive: true });
  } else {
    cleanHlsDirectory(hlsOutputDir)
  }


  const streamProcess = ffmpeg(rtspUrl)
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
      console.log('Stream conversion ended.');
      startStreamConversion(rtspUrl);
    })
    .on('error', (err) => {
      console.error('Error:', err);
    })
    .on('start', () => {
      console.log('Stream started');
    });

  streamProcess.run();
  return streamProcess;
}

module.exports = { startStreamConversion };