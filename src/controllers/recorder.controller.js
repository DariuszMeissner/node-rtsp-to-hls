const Recorder = require('../Recorder');

const startRecordingController = async (req, res) => {
  try {
    const recorderInstance = Recorder.getInstanceRecorder()
    const response = await recorderInstance.startRecording()

    if (response) {
      res.json({
        isRecording: true,
        message: 'Recording started'
      })
    }
  } catch (error) {
    res.status(500).json({ isRecording: false, message: 'Failed recording stream' })
  }
}

const endRecordingController = async (req, res) => {
  try {
    const recorderInstance = Recorder.getInstanceRecorder()
    const response = await recorderInstance.endRecording()

    if (response) {
      res.json({ isRecording: false, message: 'Recording ended' })
    } else {
      console.error('Recording process could not be killed because not exist.');
      res.status(400).json({ error: 'Recording process could not be killed because not exist.' });
    }
  } catch (error) {
    console.error('Failed to end recording:', error);
    res.status(500).json({ isRecording: false, message: 'Failed recording stream' })
  }
}

const statusRecordingController = async (req, res) => {
  try {
    const recorderInstance = Recorder.getInstance();
    const status = await recorderInstance.getRecorderProcess();

    if (status) {
      res.json({ isRecording: true })
    } else {
      console.error('Recording process not started.');
      res.status(400).json({ isRecording: true, error: 'Recording process not started.' });
    }
  } catch (error) {
    console.error('Failed to get recorder status:', error);
    res.status(500).json({ error: 'Failed to get recorder status' });
  }
}



module.exports = { startRecordingController, endRecordingController, statusRecordingController }