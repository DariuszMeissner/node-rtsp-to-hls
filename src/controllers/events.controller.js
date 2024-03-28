const Stream = require('../Stream.js');

const eventsController = async (req, res) => {
  const streamInstance = Stream.getInstance();
  const clients = streamInstance.data.clients

  try {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    streamInstance.addClient(res)

    req.on('close', () => {
      streamInstance.data.clients = clients.filter(client => client !== res);
    });
  } catch (error) {
    console.error(error);
  }
}

const eventsStatusController = async (req, res) => {
  try {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const sendStatus = () => {
      const data = { found: true, message: "Transmisja online" };
      res.json(data);
    };

    const intervalId = setInterval(sendStatus, 2000);

    req.on('close', () => {
      clearInterval(intervalId);
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = { eventsController, eventsStatusController }