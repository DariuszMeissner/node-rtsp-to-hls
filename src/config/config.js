const path = require('path');
require('dotenv').config();

const serverConfig = {
  cors: {
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  },
  limiter: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1500,
  },
  helmetOptions: {
    directives: {
      'default-src': ["'self'"],
      'media-src': ["'self'", 'blob:'],
      'script-src': [
        "'self'",
        'https://cdn.jsdelivr.net/npm/hls.js@latest',
        'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css',
        'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js',
      ],
      'worker-src': ["'self'", 'blob:'],
      connectSrc: ["'self'", 'ws://localhost:9000'],
    },
  },
  sessionOptions: {
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: 'auto', maxAge: 3600000 },
  },
};

const streamDirectory = {
  hls: {
    output: {
      dir: path.join(__dirname, '../../public/hls'),
      fileName: 'stream.m3u8',
    },
  },
};

const ffmpegConfig = {
  rtspUrl: process.env.RTSP_URL,
  rtspUrlSecond: process.env.RTSP_URL_SECOND,
  ffmpegOptions: [
    '-s 640x360',
    '-start_number 0',
    '-hls_time 2',
    '-hls_list_size 5',
    '-f hls',
    '-hls_flags delete_segments',
  ],
  codecs: {
    video: 'libx264',
    audio: 'aac',
  },
  output: `${streamDirectory.hls.output.dir}/${streamDirectory.hls.output.fileName}`,
  outputDirectory: streamDirectory.hls.output.dir,
  outputFile: streamDirectory.hls.output.fileName,
};

const recordingDirectory = {
  outputDirectory: path.join(__dirname, '../../recordings'),
};

const recorderFFmpegConfig = {
  rtspUrl: process.env.RTSP_URL,
  rtspUrlSecond: process.env.RTSP_URL_SECOND,
  size: '1280x720',
  format: 'mp4',
  output: recordingDirectory.outputDirectory,
};

module.exports = { serverConfig, streamDirectory, ffmpegConfig, recordingDirectory, recorderFFmpegConfig };
