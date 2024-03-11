const express = require('express')
const isAuthenticated = require('../middlewares/auth.middleware')
const { getStatusStreamController, panelSendFileController } = require('../controllers/panelStream.controller')

class PanelRoutes {
  router = express.Router()

  constructor() {
    this.intializeRoutes()
  }

  intializeRoutes() {
    this.router.get('/panel-status', getStatusStreamController)
    this.router.get('/panel', isAuthenticated, panelSendFileController)
  }
}

module.exports = new PanelRoutes().router