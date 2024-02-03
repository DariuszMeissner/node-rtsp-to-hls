const { Router } = require('express');
const controller = require('../controllers/stream')

const router = Router();

router.get('/start-stream', controller.startStream)

module.exports = router