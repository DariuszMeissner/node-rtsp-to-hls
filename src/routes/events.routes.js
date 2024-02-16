const express = require('express')
const { eventsController, eventsStatusController } = require('../controllers/events.controller')

class EventsRoutes {
  router = express.Router()

  constructor() {
    this.intializeRoutes()
  }

  intializeRoutes() {
    this.router.get('/events', eventsController)
    this.router.get('/stream-status-events', eventsStatusController)
  }
}

module.exports = new EventsRoutes().router