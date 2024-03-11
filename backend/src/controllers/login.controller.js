const authenticateUser = (username, password, callback) => {
  if (username === process.env.USER_LOGIN && password === process.env.USER_PASSWORD) {
    callback(null, { username: process.env.USER_LOGIN });
  } else {
    callback(null, null);
  }
};

const loginPostController = async (req, res) => {
  try {
    const { username, password } = req.body;

    authenticateUser(username, password, (error, user) => {
      if (user) {
        console.log(user);
        req.session.user = user; // Set user in session
        req.session.save(error => { // Save the session
          if (error) {
            console.error(error);
            res.json({ success: false, message: 'Session could not be saved' });
          } else {
            res.json({ success: true, message: 'Credentials correct' });
            console.log('session created');
            console.log('Session ID:', req.sessionID);
            console.log('Session Cookie:', req.cookies['connect.sid']);
          }
        });
      } else {
        res.json({ success: false, message: 'Invalid credentials' });
      }
    });
  } catch (error) {
    console.error(error);
  }
};

const loginGetController = async (req, res) => {
  try {
    const session = await new Promise((resolve, reject) => {
      req.sessionStore.get(req.sessionID, (error, session) => {
        if (error) {
          reject(error);
        } else if (!session) {
          console.log('Session not found');
          resolve(null)
        } else {
          resolve(session);
        }
      });
    });


    if (session && session.user) {
      console.log('Session', session);
      res.json({ logged: true });
    } else {
      res.json({ logged: false });
    }
  } catch (error) {
    console.error(error);
    res.json({ logged: false });
  }
}

module.exports = { loginPostController, loginGetController }