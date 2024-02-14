const express = require('express')
const isAuthenticated = require('../middlewares/auth.middleware.js')
const panelStream = require('../controllers/panelStream.controller.js')

const routerPanel = express.Router();

routerPanel.get('/panel', isAuthenticated, panelStream)

module.exports = routerPanel 