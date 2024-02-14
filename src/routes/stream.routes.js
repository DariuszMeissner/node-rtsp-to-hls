const express = require('express')
const { startStreamController, endStreamController, statusStreamController } = require('../controllers/stream.controller');


class StreamRoutes {
  router = express.Router()

  constructor() {
    this.intializeRoutes()
  }

  intializeRoutes() {
    this.router.get('/start-stream', startStreamController)
    this.router.get('/end-stream', endStreamController)
    this.router.get('/status-stream', statusStreamController)

  }
}

module.exports = new StreamRoutes().router