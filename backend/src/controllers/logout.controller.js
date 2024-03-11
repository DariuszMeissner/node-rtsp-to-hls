const util = require('util');

const destroySession = async (session) => {
  const destroy = util.promisify(session.destroy).bind(session);
  try {
    await destroy();
  } catch (err) {
    console.error('Error destroying session:', err);
    throw err;
  }
};

const logoutPostController = async (req, res) => {
  if (req.session) {
    try {
      await destroySession(req.session);

      console.log(`Logout successful`);
      res.json({ message: 'Logout successful' })

    } catch (error) {
      res.status(500).send('Could not log out, please try again');
    }
  } else {
    res.end(); // End the response if there's no session
  }
}

module.exports = { logoutPostController }