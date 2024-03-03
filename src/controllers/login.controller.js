// const path = require('path')

const loginPostController = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (username === process.env.USER_LOGIN && password === process.env.USER_PASSWORD) {
      req.session.user = { username: process.env.USER_LOGIN }; // Set user in session
      res.json({ success: true, message: 'Credentials correct' });
      console.log('session created');
    } else {
      res.json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
  }
}

const loginGetController = (req, res) => {
  if (req.session.user) {
    res.json({ logged: true })
  } else {
    res.json({ logged: false })
  }
}

module.exports = { loginPostController, loginGetController }