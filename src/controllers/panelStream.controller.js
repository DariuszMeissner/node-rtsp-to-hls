const path = require('path')

const panelStream = (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages', 'panel-admin.html'));
}

module.exports = panelStream 