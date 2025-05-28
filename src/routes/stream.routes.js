const express = require('express');
const {
  startStreamController,
  endStreamController,
  statusStreamController,
} = require('../controllers/stream.controller');

class StreamRoutes {
  router = express.Router();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.post('/start-stream', startStreamController);
    this.router.get('/end-stream', endStreamController);
    this.router.get('/stream-status', statusStreamController);
  }
}

module.exports = new StreamRoutes().router;
