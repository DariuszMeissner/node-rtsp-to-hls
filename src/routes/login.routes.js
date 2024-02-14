const express = require('express')
const { loginPostController, loginGetController } = require('../controllers/login.controller')

class LoginRoutes {
  router = express.Router()

  constructor() {
    this.intializeRoutes()
  }

  intializeRoutes() {
    this.router.post('/login', loginPostController)
    this.router.get('/login', loginGetController)
  }
}

module.exports = new LoginRoutes().router