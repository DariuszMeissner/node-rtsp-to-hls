const path = require('path')

const loginPostController = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (username === process.env.USER_LOGIN && password === process.env.USER_PASSWORD) {
      req.session.user = { username: process.env.USER_LOGIN }; // Set user in session
      res.json({ success: true, redirect: '/panel' });
      console.log('Session created');
    } else {
      res.json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
  }
}

const loginStatusController = (req, res) => {
  if (req.session.user) {
    res.json({ logged: true })
  } else {
    res.json({ logged: false })
  }
}

const loginSendFileController = (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/pages', 'login-panel.html'));
}



module.exports = { loginPostController, loginStatusController, loginSendFileController }