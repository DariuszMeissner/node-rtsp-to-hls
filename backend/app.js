const express = require('express');
const Server = require("./src/Server.js");

class AppServer {
  constructor() {
    this.app = express();
    this.server = new Server(this.app);
    this.PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 9000;

    this.init();
  }

  init() {
    this.app.listen(this.PORT, "localhost", () => console.log(`Server running at http://localhost:${this.PORT}`))
      .on('error', (err) => {
        if (err.code === "EADDRINUSE") {
          console.log("Error: address already in use");
        } else {
          console.log(err);
        }
      });
  }
}

// eslint-disable-next-line no-unused-vars
const appServer = new AppServer();