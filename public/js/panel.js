const statusInfo = document.getElementById('status')
const light = document.getElementById('light')
const startRecordingBtn = document.getElementById('startRecordingButton')
const endRecordingBtn = document.getElementById('endRecordingButton')
const startStreamBtn = document.getElementById('startStream')
const endStreamBtn = document.getElementById('endStream')
const statusElement = document.getElementById('stream-status');
const video = document.getElementById('video');
const navigationPanel = document.querySelector('.navigation-panel');

const recording = {
  state: {
    on: 'ON',
    off: 'OFF'
  }
}

startStreamBtn.addEventListener('click', function () {
  fetch('/start-stream')
    .then(response => response.json())
    .then(data => {
      console.log(data)
    })
    .catch(error => console.error('Error:', error));
});

endStreamBtn.addEventListener('click', function () {
  fetch('/end-stream')
    .then(response => response.status)
    .then(() => {
      video.classList.add('hide');
      if (navigationPanel) { navigationPanel.classList.add('hide') }
      if (endStreamBtn) { endStreamBtn.classList.add('hide') }
      if (startStreamBtn) { startStreamBtn.classList.remove('hide') }

      statusElement.textContent = 'Stream offline'
    })
    .catch(error => console.error('Error:', error));
});

startRecordingBtn.addEventListener('click', function () {
  fetch('/start-recording')
    .then(response => response.json())
    .then(() => {
      statusInfo.innerHTML = recording.state.on
      light.classList.add('blinking-button')

      startRecordingBtn.classList.add('hide')
      endRecordingBtn.classList.remove('hide')
    })
    .catch(error => console.error('Error:', error));

});

endRecordingBtn.addEventListener('click', function () {
  fetch('/end-recording',)
    .then(response => response.json())
    .then(() => {
      statusInfo.innerHTML = recording.state.off
      light.classList.remove('blinking-button')

      startRecordingBtn.classList.remove('hide')
      endRecordingBtn.classList.add('hide')
    })
    .catch(error => console.error('Error:', error));
});

document.getElementById('logoutButton').addEventListener('click', function () {
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

document.addEventListener('DOMContentLoaded', () => {
  fetch('/recording-status')
    .then(response => response.json())
    .then(data => {

      if (data.isRecording) {
        statusInfo.innerHTML = recording.state.on
        light.classList.add('blinking-button')
        startRecordingBtn.classList.add('hide')
        endRecordingBtn.classList.remove('hide')
      } else {
        statusInfo.innerHTML = recording.state.off
        light.classList.add('button-default')
        startRecordingBtn.classList.remove('hide')
        endRecordingBtn.classList.add('hide')
      }
    })
    .catch(error => console.error('Error:', error));
})