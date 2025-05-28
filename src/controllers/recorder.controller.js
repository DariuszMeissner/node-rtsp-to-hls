const Recorder = require('../Recorder');

const startRecordingController = async (req, res) => {
  try {
    const payload = req.body;

    const recorderInstance = Recorder.getInstanceRecorder();
    recorderInstance.startRecording(payload.value);

    res.json({
      isRecording: true,
      message: 'Recording started',
    });
  } catch (error) {
    res.status(500).json({ isRecording: false, message: 'Failed recording stream' });
  }
};

const endRecordingController = async (req, res) => {
  try {
    const recorderInstance = Recorder.getInstanceRecorder();
    recorderInstance.endRecording();
    res.json({ isRecording: false, message: 'Recording ended' });
  } catch (error) {
    console.error('Failed to end recording:', error);
    res.status(500).json({ isRecording: false, message: 'Failed recording stream' });
  }
};

const statusRecordingController = async (req, res) => {
  try {
    const recorderInstance = Recorder.getInstanceRecorder();
    const status = recorderInstance.getRecorderProcess();

    if (status) {
      res.json({ isRecording: true });
    } else {
      console.log('Recording process not started.');
      res.json({ isRecording: false, error: 'Recording process not started.' });
    }
  } catch (error) {
    console.error('Failed to get recorder status:', error);
    res.status(500).json({ error: 'Failed to get recorder status' });
  }
};

module.exports = { startRecordingController, endRecordingController, statusRecordingController };
