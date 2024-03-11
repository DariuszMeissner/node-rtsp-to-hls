# node-rtsp-to-hls
Server nodej to translate signal from rtsp to hls

### Routing
- '/login' - login to admin panel
- '/panel' - manage our stream
- '/' - main route for all clients to see stream
  
### Functions
- login page to manage our stream
- by admin panel you can run stream and record stream
- translating video from rtsp camera to hls file
- record stream on server

### Teach Stack
- express.js
- fluent-ffmpeg

### To Run
**Configure .env file in main root of project:<br>**
RTSP_URL='rtsp://<login>:<password>!@<ip>:<port>'
SESSION_KEY='your session key'
USER_LOGIN='your login'
USER_PASSWORD='your password'
PORT='server port'

Go to the main root of project<br>
install dependencies **npm install**<br>
to run app, enter in terminal: **node app.js**
