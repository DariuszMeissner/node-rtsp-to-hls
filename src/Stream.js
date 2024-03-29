const ffmpeg = require('fluent-ffmpeg')
const { ffmpegConfig, streamDirectory } = require('./config/config.js')
const { checkDirectoryExists, cleanDirectory, createDirectory, findFile } = require('./helpers/index.js')
const { clearInterval } = require('timers')
class Stream {
  data = {
    streamProcess: null,
    clients: [],
    intervalId: null,
    streamfileStatus: {
      found: null,
      message: null
    }
  }
  static instance = null

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

  addClient(client) {
    this.data.clients.push(client)
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

    this.data.intervalId = setInterval(async () => {
      const fileStreamExists = await findFile(hlsOutputDir, hlsOutputFileName);

      if (fileStreamExists) {
        clearInterval(this.data.intervalId);
        this.updateStatus(true, 'Stream Online');
        console.log(`${hlsOutputFileName} found in ${hlsOutputDir}`);
      } else {
        console.log(`${hlsOutputFileName} not found in ${hlsOutputDir}`);
        this.updateStatus(false, 'stream loading');
      }
    }, checkingTime);
  }

  processFFmpegStream(config) {
    const streamProcess = ffmpeg(config.rtspUrl)
      .addOptions(config.ffmpegOptions)
      .videoCodec(config.codecs.video)
      .audioCodec(config.codecs.audio)
      .output(config.output)
      .on('end', () => {
        console.log('Stream conversion ended.');
        streamProcess.kill('SIGINT');
      })
      .on('error', (err) => {
        console.error(err);
        streamProcess.kill('SIGINT');
        clearInterval(this.data.intervalId)
        console.log('Signal not found, stream ended');
      })
      .on('start', () => {
        console.log('Stream started');
        this.checkFileStreamExists(config.outputDirectory, config.outputFile)
      });

    this.setStreamProcess(streamProcess);
  }

  startStreamConversion() {
    this.validateDirectory()
    this.processFFmpegStream(ffmpegConfig)

    this.data.streamProcess.run();

    return this.data.streamProcess;
  }

  killStreamProcess() {
    if (this.data.streamProcess) {
      this.data.streamProcess.kill('SIGINT');
      this.setStreamProcess(null)
      this.updateStatus(null, 'stream ended');
      this.clearInstance();
    }
  }


}

module.exports = Stream 