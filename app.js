import express from "express"
import Server from "./src/Server.js"

const app = express();
// eslint-disable-next-line no-unused-vars
const server = new Server(app)
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

app.listen(PORT, "localhost", () => console.log(`Server running at http://localhost:${PORT}`))
  .on('error', (err) => {
    if (err.code === "EADDRINUSE") {
      console.log("Error: address already in use");
    } else {
      console.log(err);
    }
  })