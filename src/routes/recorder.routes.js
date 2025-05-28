const express = require('express');
const {
  startRecordingController,
  endRecordingController,
  statusRecordingController,
} = require('../controllers/recorder.controller');

class RecorderRoutes {
  router = express.Router();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.post('/start-recording', startRecordingController);
    this.router.get('/end-recording', endRecordingController);
    this.router.get('/recording-status', statusRecordingController);
  }
}

module.exports = new RecorderRoutes().router;
