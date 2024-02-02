const express = require('express');
const session = require('express-session');
require('dotenv').config();
const helmet = require('helmet');
const bodyParser = require("body-parser");
const path = require("path")
const rateLimit = require('express-rate-limit');

const { startRecording, stopRecording } = require('./recordings');
const { startStreamConversion } = require('./hlsStream');
const { isAuthenticated, isLoggedIn } = require('./auth')
const { getStatus, updateStatus } = require('./streamState')

const app = express();
const port = 3000;
let isRecording = false;
let recorderProcess = null;
let streamProcess = null;
let clients = [];

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

express.static.mime.define({ 'application/x-mpegURL': ['m3u8'] });
express.static.mime.define({ 'video/MP2T': ['ts'] });

app.use('/pages', (req, res, next) => {
  res.status(404).send('Not found');
});

app.use('/pages/*', (req, res, next) => {
  res.status(404).send('Not found');
});

app.use(session({
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: 'auto', maxAge: 60000 }
}));

app.use(helmet.contentSecurityPolicy({
  directives: {
    "default-src": ["'self'"],
    "media-src": ["'self'", "blob:"],
    "script-src": ["'self'", "https://cdn.jsdelivr.net/npm/hls.js@latest", "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css", "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"],
    "worker-src": ["'self'", "blob:"]
  }
}));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);
app.use(express.static('../public'));

app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();


  clients.push(res);

  req.on('close', () => {
    clients = clients.filter(client => client !== res);
  });
});

app.get('/start-stream', (req, res) => {

  streamProcess = startStreamConversion(process.env.RTSP_URL);

  res.json({
    isStarted: getStatus(),
  });
});

app.get('/end-stream', (req, res) => {
  if (streamProcess) {
    streamProcess.kill('SIGINT');
  }
  updateStatus(null, 'stream ended');

  clients.forEach(client => {
    client.write(`data: ${JSON.stringify({ isStarted: getStatus() })}\n\n`);
  });

  res.end();
});

app.get('/stream-status', (req, res) => {
  res.json(getStatus());
});

app.get('/start-recording', (req, res) => {
  recorderProcess = startRecording(process.env.RTSP_URL, isRecording);
  isRecording = !!recorderProcess;

  res.json({
    isRecording,
    message: isRecording ? 'Recording started' : 'Recording failed to start'
  });
});

app.get('/stop-recording', (req, res) => {
  stopRecording(recorderProcess);
  isRecording = false;

  res.json({
    isRecording,
    message: 'Recording stopped'
  });
});


app.get('/recording-status', (req, res) => {
  res.json({ isRecording: isRecording })
})

app.get('/panel', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pages', 'panel-admin.html'));
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === process.env.USER_LOGIN && password === process.env.USER_PASSWORD) {
    req.session.user = { username: process.env.USER_LOGIN }; // Set user in session
    res.json({ success: true, redirect: '/panel' });
  } else {
    res.json({ success: false, message: 'Invalid credentials' });
  }
});

app.get('/login', isLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, '../public/pages', 'login-panel.html'));
});

app.post('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).send('Could not log out, please try again');
      } else {
        res.send('Logout successful');
      }
    });
  } else {
    res.end();
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
