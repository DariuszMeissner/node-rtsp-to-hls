const express = require('express')
const isLoggedIn = require('../middlewares/loggedIn.middleware.js')
const { loginPostController, loginSendFileController, loginStatusController } = require('../controllers/login.controller')

class LoginRoutes {
  router = express.Router()

  constructor() {
    this.intializeRoutes()
  }

  intializeRoutes() {
    this.router.post('/login', loginPostController)
    this.router.get('/login', isLoggedIn, loginSendFileController)
    this.router.get('/login-status', loginStatusController)
  }
}

module.exports = new LoginRoutes().router