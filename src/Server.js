const express = require('express')
const cors = require('cors')
const bodyParser = require("body-parser")
const helmet = require("helmet")
const session = require("express-session")
const rateLimit = require("express-rate-limit")
const { serverConfig } = require("./config/config.js")
const panelRoutes = require("./routes/panel.routes.js")
const streamRoutes = require("./routes/stream.routes.js")
const recorderRoutes = require('./routes/recorder.routes.js')
const logoutRoutes = require('./routes/logout.routes.js')
const loginRoutes = require('./routes/login.routes.js')

class Server {
  constructor(app) {
    this.config(app);

    app.use('/', panelRoutes);
    app.use('/', streamRoutes);
    app.use('/', recorderRoutes);
    app.use('/', logoutRoutes)
    app.use('/', loginRoutes)
  }

  config(app) {
    express.static.mime.define({ 'application/x-mpegURL': ['m3u8'] });
    express.static.mime.define({ 'video/MP2T': ['ts'] });

    app.use(cors(serverConfig.cors))
    app.use(bodyParser.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(rateLimit(serverConfig.limiter));
    app.use(helmet.contentSecurityPolicy(serverConfig.helmetOptions));
    app.use(session(serverConfig.sessionOptions));

    app.use(express.static('public'));
  }
}

module.exports = Server 