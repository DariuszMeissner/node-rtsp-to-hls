import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import helmet from "helmet";
import session from "express-session";
import rateLimit from "express-rate-limit";
import { serverConfig } from "./config/config.js";

export default class Server {
  constructor(app) {
    this.config(app);
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