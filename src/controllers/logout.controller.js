const Stream = require('../Stream')
const Recorder = require('../Recorder')

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
    const streamInstance = Stream.getInstance();
    const recorderInstance = Recorder.getInstanceRecorder();

    try {
      await destroySession(req.session);
      streamInstance.killStreamProcess();
      recorderInstance.endRecording();

      console.log(`Logout successful`);
      res.json({ success: true, redirect: '/login' })

    } catch (error) {
      res.status(500).send('Could not log out, please try again');
    }
  } else {
    res.end(); // End the response if there's no session
  }
}

module.exports = { logoutPostController }