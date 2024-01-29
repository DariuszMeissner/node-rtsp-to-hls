const statusInfo = document.getElementById('status')
const light = document.getElementById('light')
const startRecordingBtn = document.getElementById('startRecordingButton')
const endRecordingBtn = document.getElementById('endRecordingButton')

const recording = {
  state: {
    on: 'ON',
    off: 'OFF'
  }
}

if (Hls.isSupported()) {
  var video = document.getElementById('video');
  var hls = new Hls();
  hls.loadSource('/hls/stream.m3u8');
  hls.attachMedia(video);
}

startRecordingBtn.addEventListener('click', function () {
  fetch('/start-recording')
    .then(response => response.json())
    .then(data => {
      console.log(data)

      data.isRecording && startRecordingBtn.setAttribute('disabled', '');
      data.isRecording && endRecordingBtn.removeAttribute('disabled');


      statusInfo.innerHTML = data.isRecording && recording.state.on
      light.classList.add('blinking-button')
    })
    .catch(error => console.error('Error:', error));

});

endRecordingBtn.addEventListener('click', function () {
  fetch('/stop-recording',)
    .then(response => response.json())
    .then(data => {
      console.log(data)


      data.isRecording ? endRecordingBtn.setAttribute('disabled', '') : startRecordingBtn.removeAttribute('disabled');
      !data.isRecording && endRecordingBtn.setAttribute('disabled', '');

      statusInfo.innerHTML = !data.isRecording && recording.state.off
      light.classList.remove('blinking-button')
    })
    .catch(error => console.error('Error:', error));
});

document.addEventListener('DOMContentLoaded', () => {
  fetch('/recording-status')
    .then(response => response.json())
    .then(data => {
      console.log(data)
      
      data.isRecording ? startRecordingBtn.setAttribute('disabled', '') : startRecordingBtn.removeAttribute('disabled')
      data.isRecording ? endRecordingBtn.removeAttribute('disabled') : endRecordingBtn.setAttribute('disabled', '')

      statusInfo.innerHTML = data.isRecording ? recording.state.on : recording.state.off
      light.classList.add(`${data.isRecording ? 'blinking-button' : 'button-default'}`)
    })
    .catch(error => console.error('Error:', error));
})

document.getElementById('logoutButton').addEventListener('click', function() {
    fetch('/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include' // Important for including session cookies
    })
    .then(response => {
        if (response.ok) {
            window.location.href = '/login'; // Redirect to login page after successful logout
        } else {
            console.error('Logout failed');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
