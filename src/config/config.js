const serverConfig = {
  cors: {
    origin: `http://localhost:${process.env.PORT}`
  },
  limiter: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  },
  helmetOptions: {
    directives: {
      "default-src": ["'self'"],
      "media-src": ["'self'", "blob:"],
      "script-src": ["'self'", "https://cdn.jsdelivr.net/npm/hls.js@latest", "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css", "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"],
      "worker-src": ["'self'", "blob:"]
    }
  },
  sessionOptions: {
    secret: `${process.env.SESSION_KEY}`,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: 'auto', maxAge: 60000 }
  }
}

const streamDirectory = {
  hls: {
    output: {
      dir: 'public/hls',
      fileName: 'stream.m3u8'
    }
  },
}

const ffmpegConfig = {
  rtspUrl: process.env.RTSP_URL,
  ffmpegOptions: [
    '-s 640x360',
    '-start_number 0',
    '-hls_time 2',
    '-hls_list_size 5',
    '-f hls',
    '-hls_flags delete_segments'
  ],
  codecs: {
    video: 'libx264',
    audio: 'aac'
  },
  output: `${streamDirectory.hls.output.dir}/${streamDirectory.hls.output.fileName}`,
  outputDirectory: streamDirectory.hls.output.dir,
  outputFile: streamDirectory.hls.output.fileName
}


export { serverConfig, streamDirectory, ffmpegConfig }