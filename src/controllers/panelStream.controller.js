// const path = require('path')

const panelStream = (req, res) => {
  // res.sendFile(path.join(__dirname, '../../public/pages', 'panel-admin.html'));
  if (req.session.user) {
    res.json({ logged: true })
  } else {
    res.json({ logged: false })
  }
}

module.exports = panelStream 