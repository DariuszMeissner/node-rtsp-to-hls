import ffmpeg from 'fluent-ffmpeg'
import { ffmpegConfig, streamConfig } from './config/config';
import { checkDirectoryExists, cleanDirectory, createDirectory, findFile } from './helpers';

export default class Stream {
  data = {
    streamProcess: null,
    clients: [],
    streamfileStatus: {
      found: null,
      message: null
    }
  }

  constructor() { }

  setStream(processState) {
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
    const hlsOutputDir = streamConfig.hls.output.dir
    const isHlsDirectory = checkDirectoryExists(hlsOutputDir)

    isHlsDirectory ? cleanDirectory(hlsOutputDir) : createDirectory(hlsOutputDir)
  }

  checkFileStreamExists(hlsOutputDir, hlsOutputFileName) {
    const checkingTime = 1000;
    const interval = setInterval(async () => {
      const fileStreamExists = await findFile(hlsOutputDir, hlsOutputFileName);

      if (fileStreamExists) {
        clearInterval(interval);
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
      })
      .on('start', () => {
        console.log('Stream started');
        this.checkFileStreamExists(config.outputDirectory, config.outputFile)
      });

    this.setStream(streamProcess);
  }

  startStreamConversion() {
    this.validateDirectory();
    this.processFFmpegStream(ffmpegConfig)

    this.data.streamProcess.run();

    return this.data.streamProcess;
  }
}