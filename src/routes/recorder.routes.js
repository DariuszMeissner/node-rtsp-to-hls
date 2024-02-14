const express = require('express')
const { startRecordingController, endRecordingController } = require('../controllers/recorder.controller')

class RecorderRoutes {
  router = express.Router()

  constructor() {
    this.intializeRoutes()
  }

  intializeRoutes() {
    this.router.get('/start-recording', startRecordingController)
    this.router.get('/end-recording', endRecordingController)
    this.router.get('/status-recording', startRecordingController)
  }
}

module.exports = new RecorderRoutes().router