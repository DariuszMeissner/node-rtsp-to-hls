const ffmpeg = require('fluent-ffmpeg');
const { recorderFFmpegConfig, recordingDirectory } = require("./config/config");
const { checkDirectoryExists, createDirectory } = require("./helpers");
const path = require('path')

class Recorder {
  recorderProcess = null;
  static instance = null;

  constructor() { }

  static getInstanceRecorder() {
    if (!Recorder.instance) {
      Recorder.instance = new Recorder();
    }
    return Recorder.instance;
  }

  clearInstance() {
    Recorder.instance = null;
  }

  setRecorderProcess(process) {
    this.recorderProcess = process;
  }

  getRecorderProcess() {
    return this.recorderProcess;
  }

  validateDirectory() {
    const recordingOutputDir = recordingDirectory.outputDirectory
    const isRecordingDirectory = checkDirectoryExists(recordingOutputDir)

    !isRecordingDirectory && createDirectory(recordingOutputDir)
  }

  getOutputFilePath(directoryPath) {
    const timestamp = Date.now();
    const fileName = `posiedzenie-${timestamp}.mp4`;

    return path.join(directoryPath, fileName);
  }

  processFFmpegRecording(config) {
    const outputPath = this.getOutputFilePath(config.output)

    const recorderProcess = ffmpeg(config.rtspUrl)
      .output(outputPath)
      .size(config.size)
      .format(config.format)
      .on('start', commandLine => {
        console.log(`Recording started: ${commandLine}`);
      })
      .on('error', err => {
        console.error('Error occurred:', err.message);
      })
      .on('end', () => {
        console.log(`Recording stopped`);
      });

    this.setRecorderProcess(recorderProcess)
  }

  startRecording() {
    if (this.recorderProcess) return

    this.validateDirectory()
    this.processFFmpegRecording(recorderFFmpegConfig)
    this.recorderProcess.run()

    return this.recorderProcess
  }

  endRecording() {
    if (this.recorderProcess) {
      this.recorderProcess.kill('SIGINT')
      this.clearInstance()
      this.setRecorderProcess(null)
    }
  }
}

module.exports = Recorder