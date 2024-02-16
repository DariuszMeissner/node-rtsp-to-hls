const Recorder = require('../Recorder')
const Stream = require('../Stream.js');

const startStreamController = async (req, res) => {
  try {
    const streamInstance = Stream.getInstance();
    streamInstance.startStreamConversion();

    const status = streamInstance.getStatus();
    res.json(status);
  } catch (error) {
    console.error('Failed to start stream:', error);
    res.status(500).json({ error: 'Failed to start stream' });
  }
};

const endStreamController = async (req, res) => {
  try {
    const streamInstance = Stream.getInstance();
    const recorderInstance = Recorder.getInstanceRecorder()

    streamInstance.killStreamProcess();
    if (recorderInstance) recorderInstance.endRecording()

    const status = streamInstance.getStatus()
    res.json(status);
  } catch (error) {
    console.error('Failed to end stream:', error);
    res.status(500).json({ error: 'Failed to end stream' });
  }
};

const statusStreamController = async (req, res) => {
  try {
    const streamInstance = Stream.getInstance();
    const status = await streamInstance.getStatus();

    if (status) {
      res.json(status)
    }
  } catch (error) {
    console.error('Failed to get stream status:', error);
    res.status(500).json({ error: 'Failed to get stream status' });
  }
}

module.exports = { startStreamController, endStreamController, statusStreamController }

