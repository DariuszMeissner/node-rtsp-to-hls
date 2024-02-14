const path = require('path')

const loginPostController = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (username === process.env.USER_LOGIN && password === process.env.USER_PASSWORD) {
      req.session.user = { username: process.env.USER_LOGIN }; // Set user in session
      res.json({ success: true, redirect: '/panel' });
    } else {
      res.json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
  }
}

const loginGetController = async (req, res) => {
  try {
    res.sendFile(path.join(__dirname, 'public/pages', 'login-panel.html'));
  } catch (error) {
    console.error(error);
  }
}

module.exports = { loginPostController, loginGetController }