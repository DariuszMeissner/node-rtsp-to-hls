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
      res.json({ success: true, redirect: '/login' })

    } catch (error) {
      res.status(500).send('Could not log out, please try again');
    }
  } else {
    res.end(); // End the response if there's no session
  }
}

module.exports = { logoutPostController }