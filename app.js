require('dotenv').config()
const express = require('express');
const Server = require("./src/Server.js");
const Stream = require('./src/Stream.js');
const WebSocket = require('ws')

class AppServer {
  constructor() {
    this.PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 9000;
    this.app = express();
    this.server = new Server(this.app);
    this.expressInstance = this.app.listen(this.PORT, "localhost", () => console.log(`Server running at http://localhost:${this.PORT}`));
    this.wss = new WebSocket.Server({ server: this.expressInstance });
    this.currentTranscription = '';
    this.lastWordIndex = 0;

    this.init();
  }

  init() {
    this.handleTranscriptionChange();
  }

  handleTranscriptionChange() {
    this.wss.on('connection', ws => {
      const stream = Stream.getInstance().transcription;

      const words = this.currentTranscription.split(' ');
      const transcriptionFromLastWord = words.slice(this.lastWordIndex).join(' ');
      ws.send(transcriptionFromLastWord);

      stream.events.on('transcriptionChanged', newTranscription => {
        this.currentTranscription = newTranscription;
        this.lastWordIndex = words.length;

        this.wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) client.send(newTranscription);
        })
      })

      console.log('WebSocket connection opened', ws.url);
    });
  }
}

// eslint-disable-next-line no-unused-vars
const appServer = new AppServer();