const express = require('express')
const cors = require('cors')
const bodyParser = require("body-parser")
const helmet = require("helmet")
const session = require("express-session")
const MongoDBStore = require('connect-mongodb-session')(session)
const rateLimit = require("express-rate-limit")
const { serverConfig } = require("./config/config.js")
const panelRoutes = require("./routes/panel.routes.js")
const streamRoutes = require("./routes/stream.routes.js")
const recorderRoutes = require('./routes/recorder.routes.js')
const logoutRoutes = require('./routes/logout.routes.js')
const loginRoutes = require('./routes/login.routes.js')
const eventsRoutes = require('./routes/events.routes.js')
const cookieParser = require('cookie-parser')
require('dotenv').config()

class Server {
  constructor(app) {
    this.store = new MongoDBStore({
      uri: 'mongodb://admin:admin@127.0.0.1:27017/admin',
      collection: 'mySessions',
    });
    this.config(app);

    app.use('/', panelRoutes);
    app.use('/', streamRoutes);
    app.use('/', recorderRoutes);
    app.use('/', logoutRoutes)
    app.use('/', loginRoutes)
    app.use('/', eventsRoutes)
  }

  config(app) {
    express.static.mime.define({ 'application/x-mpegURL': ['m3u8'] });
    express.static.mime.define({ 'video/MP2T': ['ts'] });

    app.use(cors(serverConfig.cors))
    app.use(bodyParser.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(rateLimit(serverConfig.limiter));
    app.use(helmet.contentSecurityPolicy(serverConfig.helmetOptions));
    app.use(cookieParser());
    app.use(session({
      secret: process.env.SESSION_KEY,
      resave: true,
      saveUninitialized: true,
      store: this.store,
      cookie: {
        secure: false,
        maxAge: 8 * 60 * 60 * 1000,
        sameSite: false,
        httpOnly: true,
      }
    }));

    app.use(express.static('public'));
  }
}

module.exports = Server 