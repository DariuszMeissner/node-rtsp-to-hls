require('dotenv').config()
const express = require('express');
const Server = require("./src/Server.js");
const Stream = require('./src/Stream.js');
const WebSocket = require('ws')
const http = require('http')

class AppServer {
  constructor() {
    this.app = express();
    this.server = new Server(this.app);
    this.PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 9000;
    this.serverWebSocket = http.createServer(this.app);
    this.wss = new WebSocket.Server({ noServer: true });
    this.currentTranscription = '';
    this.lastWordIndex = 0;

    this.init();
  }

  init() {
    this.handleWsUpgrade();
    this.handleTranscriptionChange();
    this.handleServers();
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

  handleServers() {
    this.app.listen(this.PORT, "localhost", () => console.log(`Server running at http://localhost:${this.PORT}`))
      .on('error', (err) => {
        if (err.code === "EADDRINUSE") {
          console.log("Error: address already in use");
        } else {
          console.log(err);
        }
      });

    this.serverWebSocket.listen(9001, () => {
      console.log('Server WebSocket started on port 9001');
    });
  }

  handleWsUpgrade() {
    this.serverWebSocket.on('upgrade', (request, socket, head) => {
      this.wss.handleUpgrade(request, socket, head, ws => {
        this.wss.emit('connection', ws, request);
      });
    });
  }

}

// eslint-disable-next-line no-unused-vars
const appServer = new AppServer();