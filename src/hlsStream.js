const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const schedule = require('node-schedule');

const { updateStatus } = require('./streamState')

function cleanHlsDirectory(directory) {
  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    files.forEach(file => {
      fs.unlink(path.join(directory, file), (err) => {
        if (err) throw err;
      });
    })

  });
}

async function findFile(directory, fileName) {
  try {
    const files = await fs.promises.readdir(directory);
    return files.includes(fileName);
  } catch (error) {
    console.error('Error reading directory:', error);
    return false;
  }
}

function startStreamConversion(rtspUrl) {
  const hlsOutputDir = '../public/hls';

  // Clean HLS output directory on startup
  if (!fs.existsSync(hlsOutputDir)) {
    fs.mkdirSync(hlsOutputDir, { recursive: true });
  } else {
    cleanHlsDirectory(hlsOutputDir)
  }

  const streamProcess = ffmpeg(rtspUrl)
    .addOptions([
      '-s 640x360',
      '-start_number 0',
      '-hls_time 2',
      '-hls_list_size 5',
      '-f hls',
      '-hls_flags delete_segments'
    ])
    .videoCodec('libx264')
    .audioCodec('aac')
    .output(`${hlsOutputDir}/stream.m3u8`)
    .on('end', () => {
      console.log('Stream conversion ended.');
      streamProcess.kill('SIGINT');
    })
    .on('error', (err) => {
      console.error(err);
      streamProcess.kill('SIGINT');
    })
    .on('start', () => {
      console.log('Stream started');

      // Check for stream.m3u8 at intervals
      const fileName = 'stream.m3u8';
      const interval = setInterval(async () => {
        const fileExists = await findFile(hlsOutputDir, fileName);

        if (fileExists) {
          clearInterval(interval);
          updateStatus(true, 'Stream Online');
          console.log(`${fileName} found in ${hlsOutputDir}`);
        } else {
          console.log(`${fileName} not found in ${hlsOutputDir}`);
          updateStatus(false, 'stream loading');
        }
      }, 1000); // Check every 5 seconds, adjust as needed
    });


  streamProcess.run();

  return streamProcess;
}

module.exports = { startStreamConversion };
