const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

const outputDirectory = path.join(__dirname, '/recordings');

if (!fs.existsSync(outputDirectory)) {
  fs.mkdirSync(outputDirectory, { recursive: true });
}

function getOutputFilePath() {
  const timestamp = Date.now();
  const fileName = `posiedzenie-${timestamp}.mp4`;
  return path.join(outputDirectory, fileName);
}

function startRecording(rtspUrl, isRecording) {
  if (isRecording) {
    console.log('Recording is already running.');
    return;
  }

  const outputPath = getOutputFilePath();

  const recorderProcess = ffmpeg(rtspUrl)
    .output(outputPath)
    .size('1280x720')
    .format('mp4')
    .on('start', (commandLine) => {
      console.log(`Recording started: ${commandLine}`);
    })
    .on('error', (err, stdout, stderr) => {
      console.error('Error occurred:', err.message);
    })
    .on('end', () => {
      console.log(`Recording stopped`);
    });

  recorderProcess.run();

  return recorderProcess;
}

function stopRecording(recorderProcess) {
  if (recorderProcess) {
    recorderProcess.kill('SIGINT');
    console.log('Recording stopped');
  } else {
    console.log("No recording process found");
  }
}

module.exports = { startRecording, stopRecording };
