# node-rtsp-to-hls

Server nodejs to translate signal from rtsp to hls<br>
and displaying transciptions converted from video stream by Google Cloud Speech-to-text

### Routing

- '/login' - login to admin panel
- '/panel' - manage our stream
- '/' - main route for all clients to see stream

### Functions

- login page to manage our stream
- by admin panel you can run stream and record stream
- translating live video from rtsp camera to hls file and sending on frontend
- record stream on server
- translating audio from live stream and displaying transciptions on video stream by Google Cloud Speech-to-text

### Teach Stack

- express.js
- fluent-ffmpeg
- @google-cloud/speech
- websocekt

### To Run

**Configure .env file in main root of project:<br>**
RTSP_URL= your rtsp url 'rtsp://<login>:<password>!@<ip>:<port>' or any other source of video<br>
SESSION_KEY='your session key'<br>
USER_LOGIN='your login'<br>
USER_PASSWORD='your password'<br>
GOOGLE_APPLICATION_CREDENTIALS='your path to key from gooogle-cloud/speech to text API'<br>

Go to the main root of project<br>
install dependencies: **npm install**<br>
run server, enter in terminal: **node app.js**
and run app, in browser:**http:locallhost:3000**
