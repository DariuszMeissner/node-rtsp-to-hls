const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const session = require('express-session');
// const rateLimit = require('express-rate-limit');
const { serverConfig } = require('./config/config.js');
const panelRoutes = require('./routes/panel.routes.js');
const streamRoutes = require('./routes/stream.routes.js');
const recorderRoutes = require('./routes/recorder.routes.js');
const logoutRoutes = require('./routes/logout.routes.js');
const loginRoutes = require('./routes/login.routes.js');
const eventsRoutes = require('./routes/events.routes.js');

class Server {
  constructor(app) {
    this.config(app);

    app.use('/', panelRoutes);
    app.use('/', streamRoutes);
    app.use('/', recorderRoutes);
    app.use('/', logoutRoutes);
    app.use('/', loginRoutes);
    app.use('/', eventsRoutes);

    app.get('/', (_, res) => {
      res.redirect('/app');
    });

    app.get('/app', (req, res) => {
      res.sendFile(path.join(__dirname, '../public/app', 'index.html'));
    });
  }

  config(app) {
    app.use(express.static(path.join(__dirname, '../public')));

    app.use('/assets', (req, res, next) => {
      res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT');
      res.setHeader('Cache-Control', 'no-cache');
      next();
    });

    express.static.mime.define({ 'application/x-mpegURL': ['m3u8'] });
    express.static.mime.define({ 'video/MP2T': ['ts'] });

    app.use(cors());
    app.use(bodyParser.json());
    app.use(express.urlencoded({ extended: true }));
    // app.use(rateLimit(serverConfig.limiter));
    app.use(helmet.contentSecurityPolicy(serverConfig.helmetOptions));
    app.use(session(serverConfig.sessionOptions));
  }
}

module.exports = Server;
