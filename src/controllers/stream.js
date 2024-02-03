
// Methods to be executed on routes 
const { getStatus } = require("../streamState");
const { startStreamConversion } = require("../hlsStream")

const startStream = (req, res) => {
  streamProcess = startStreamConversion(process.env.RTSP_URL);

  res.json({
    isStarted: getStatus(),
  });
}

module.exports = { startStream }