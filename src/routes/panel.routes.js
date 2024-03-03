const express = require('express')
const panelStream = require('../controllers/panelStream.controller.js')

const routerPanel = express.Router();

routerPanel.get('/panel', panelStream)

module.exports = routerPanel 