const path = require('path')

const getStatusStreamController = (req, res) => {
  // res.sendFile(path.join(__dirname, '../../public/pages', 'panel-admin.html'));
  if (req.session.user) {
    res.json({ logged: true })
  } else {
    res.json({ logged: false })
  }
}

const panelSendFileController = (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/pages', 'panel-admin.html'));
}

module.exports = { getStatusStreamController, panelSendFileController }