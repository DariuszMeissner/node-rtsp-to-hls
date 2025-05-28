const ffmpeg = require('fluent-ffmpeg');
const { ffmpegConfig, streamDirectory } = require('./config/config.js');
const { checkDirectoryExists, cleanDirectory, createDirectory, findFile } = require('./helpers/index.js');
const { clearInterval } = require('timers');
const Transcription = require('./Transcription.js');

class Stream {
  data = {
    streamProcess: null,
    clients: [],
    intervalId: null,
    streamfileStatus: {
      found: null,
      message: null,
    },
  };
  static instance = null;

  constructor() {
    this.transcription = new Transcription();
  }

  static getInstance() {
    if (!Stream.instance) {
      Stream.instance = new Stream();
    }
    return Stream.instance;
  }

  clearInstance() {
    Stream.instance = null;
  }

  setStreamProcess(processState) {
    this.data.streamProcess = processState;
  }

  getStream() {
    return this.data.streamProcess;
  }

  updateStatus(found, message) {
    this.data.streamfileStatus.found = found;
    this.data.streamfileStatus.message = message;
  }

  getStatus() {
    return this.data.streamfileStatus;
  }

  validateDirectory() {
    const hlsOutputDir = streamDirectory.hls.output.dir;
    const isHlsDirectory = checkDirectoryExists(hlsOutputDir);

    if (isHlsDirectory) {
      cleanDirectory(hlsOutputDir);
    } else {
      createDirectory(hlsOutputDir);
    }
  }

  checkFileStreamExists(hlsOutputDir, hlsOutputFileName) {
    const checkingTime = 1000;

    // Check if codecs are defined in the configuration
    if (!ffmpegConfig.codecs || !ffmpegConfig.codecs.video || !ffmpegConfig.codecs.audio) {
      console.error('Error: Missing required codecs in ffmpeg configuration.');
      this.updateStatus(false, 'Codec error, stream cannot start');
      return;
    }

    this.data.intervalId = setInterval(async () => {
      const fileStreamExists = await findFile(hlsOutputDir, hlsOutputFileName);

      if (fileStreamExists) {
        console.log(`${hlsOutputFileName} found in public/hls`);

        clearInterval(this.data.intervalId);
        this.updateStatus(true, 'Transmisja online');

        this.transcription.captureAndTranscribeAudio(ffmpegConfig.rtspUrl);

        return;
      }

      console.log(`${hlsOutputFileName} not found in public/hls`);
      this.updateStatus(false, 'Ładowanie tramsmisji');
    }, checkingTime);
  }

  processFFmpegStream(config, camera) {
    const camUrl = camera == 'camera-first' ? config.rtspUrl : config.rtspUrlSecond;

    const streamProcess = ffmpeg(camUrl)
      .inputOptions(['-rtsp_transport tcp'])
      .addOptions(config.ffmpegOptions)
      .videoCodec(config.codecs.video)
      .audioCodec(config.codecs.audio)
      .output(config.output)
      .on('end', () => {
        console.log('Stream conversion ended.');
        streamProcess.kill('SIGINT');
      })
      .on('error', (err) => {
        console.error('error:', err);
        streamProcess.kill('SIGINT');
        clearInterval(this.data.intervalId);
        console.log('Stream ended due to error:', err.message);
      })
      .on('start', (commandLine) => {
        console.log('Stream started', commandLine);
        this.checkFileStreamExists(config.outputDirectory, config.outputFile);
      });

    this.setStreamProcess(streamProcess);
  }

  startStreamConversion(camera) {
    if (this.data.streamProcess) return;

    this.validateDirectory();
    this.processFFmpegStream(ffmpegConfig, camera);
    this.data.streamProcess.run();

    return this.data.streamProcess;
  }

  killStreamProcess() {
    if (this.data.streamProcess) {
      this.transcription.destroy();
      this.data.streamProcess.kill('SIGINT');
      this.setStreamProcess(null);
      this.updateStatus(null, 'stream ended');
      this.clearInstance();
    }
  }
}

module.exports = Stream;
