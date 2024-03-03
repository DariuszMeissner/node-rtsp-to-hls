// Helper function to destroy a session and return a promise
const destroySession = (session) => {
  return new Promise((resolve, reject) => {
    session.destroy((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
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