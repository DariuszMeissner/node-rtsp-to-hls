const statusInfo = document.getElementById('status')
const light = document.getElementById('light')

if (Hls.isSupported()) {
  var video = document.getElementById('video');
  var hls = new Hls();
  hls.loadSource('/hls/stream.m3u8');
  hls.attachMedia(video);
}

document.getElementById('startRecordingButton').addEventListener('click', function () {
  fetch('/start-recording')
    .then(response => response.json())
    .then(data => {
      console.log(data)

      statusInfo.innerHTML = data.isRecording && 'NAGRYWANIE'
      light.classList.add('blinking-button')
    })
    .catch(error => console.error('Error:', error));

});

document.getElementById('endRecordingButton').addEventListener('click', function () {
  fetch('/stop-recording')
    .then(response => response.json())
    .then(data => {
      console.log(data)

      statusInfo.innerHTML = !data.isRecording && 'WYŁĄCZONE'
      light.classList.remove('blinking-button')
    })
    .catch(error => console.error('Error:', error));
});

document.addEventListener('DOMContentLoaded', () => {
  fetch('/recording-status')
    .then(response => response.json())
    .then(data => {
      console.log(data)

      statusInfo.innerHTML = data.isRecording ? 'NAGRYWANIE' : 'WYŁĄCZONE'
      light.classList.add(`${data.isRecording ? 'blinking-button' : 'button-default'}`)
    })
    .catch(error => console.error('Error:', error));
})