const express = require('express');
const session = require('express-session');
require('dotenv').config();
const helmet = require('helmet');
const bodyParser = require("body-parser");
const path = require("path")
// const rateLimit = require('express-rate-limit');

const { startRecording, stopRecording } = require('./recordings');
const { startStreamConversion, scheduleStreamRestart } = require('./hlsStream');
const { isAuthenticated, isLoggedIn } = require('./auth')

const app = express();
const port = 3000;
let isRecording = false;
let recorderProcess = null;
let streamProcess = null;

// const limiter = rateLimit({
//  windowMs: 15 * 60 * 1000, // 15 minutes
//  max: 100 // limit each IP to 100 requests per windowMs
// });

express.static.mime.define({ 'application/x-mpegURL': ['m3u8'] });
express.static.mime.define({ 'video/MP2T': ['ts'] });

app.use(session({
  secret: 'secretCat',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: 'auto' } // auto or set true if using https
}));

app.use(helmet.contentSecurityPolicy({
  directives: {
    "default-src": ["'self'"],
    "media-src": ["'self'", "blob:"],
    "script-src": ["'self'", "https://cdn.jsdelivr.net/npm/hls.js@latest"],
    "worker-src": ["'self'", "blob:"]
  }
}));
app.use(bodyParser.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
// app.use(limiter);
app.use(express.static('public'));

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
  res.sendFile(path.join(__dirname, 'public', 'panel.html'));
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Here, you should validate the username and password (e.g., check against a database)
  // For demonstration purposes, we're assuming the credentials are valid
  if (username === process.env.USER_LOGIN && password === process.env.USER_PASSWORD) {
    req.session.user = { username: process.env.USER_LOGIN }; // Set user in session
    res.json({ success: true, redirect: '/panel' });
  } else {
    res.json({ success: false, message: 'Invalid credentials' });
  }
});

app.get('/login', isLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
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

// Start the stream
streamProcess = startStreamConversion(process.env.RTSP_URL);

scheduleStreamRestart(process.env.RTSP_UR)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
