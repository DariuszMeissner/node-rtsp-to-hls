const express = require('express')
const { logoutPostController } = require('../controllers/logout.controller')

class LogoutRoutes {
  router = express.Router()

  constructor() {
    this.intializeRoutes()
  }

  intializeRoutes() {
    this.router.post('/logout', logoutPostController)
  }
}

module.exports = new LogoutRoutes().router