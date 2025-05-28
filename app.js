require('dotenv').config();
const express = require('express');
const Server = require('./src/Server.js');
const Stream = require('./src/Stream.js');
const WebSocket = require('ws');

const INFINITY_LISTENERS = 0;

class AppServer {
  constructor() {
    this.PORT = 3000; // Use a non-privileged port like 8080
    this.app = express();
    this.server = new Server(this.app);
    this.serverInstance = this.app.listen(this.PORT, (error) => {
      if (error) {
        console.error(`Server failed to start: ${error}`);
      } else {
        console.log(`--------Server running at http://localhost:${this.PORT} ----------`);
      }
    });

    this.wss = new WebSocket.Server({ server: this.serverInstance });
    this.currentTranscription = '';
    this.lastWordIndex = 0;

    this.init();
  }

  init() {
    this.handleTranscriptionChange();
  }

  handleTranscriptionChange() {
    this.wss.on('connection', (ws) => {
      const stream = Stream.getInstance()?.transcription ?? '';

      const words = this.currentTranscription.split(' ');
      const transcriptionFromLastWord = words.slice(this.lastWordIndex).join(' ');
      ws.send(transcriptionFromLastWord);

      stream.events.setMaxListeners(INFINITY_LISTENERS);

      stream.events.on('transcriptionChanged', (newTranscription) => {
        this.currentTranscription = newTranscription;
        this.lastWordIndex = words.length;

        this.wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) client.send(newTranscription);
        });
      });

      const pingInterval = setInterval(() => {
        if (ws.readyState === ws.OPEN) {
          ws.ping();
        } else {
          clearInterval(pingInterval);
        }
      }, 30000); // Send a ping every 30 seconds

      console.log('WebSocket connection opened', ws.url);
    });

    this.wss.on('error', (error) => {
      console.log('WebSocket error', error);
    });
  }
}

// eslint-disable-next-line no-unused-vars
const appServer = new AppServer();
