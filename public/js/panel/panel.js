import { hideElement, showElement, insertText, CAMERA_NAME } from '../utils/utils.js';

export default class Panel {
  hlsInstance = null;

  constructor() {
    this.startStreamBtn = document.getElementById('startStream');
    this.endStreamBtn = document.getElementById('endStream');
    this.streamStatus = document.getElementById('stream-status');
    this.recordingStatus = document.getElementById('status-wrapper');
    this.video = document.getElementById('video');
    this.videoWrapper = document.getElementById('video-wrapper');
    this.logoutButton = document.getElementById('logoutButton');
    this.captions = document.getElementById('captions');
    this.queue = [];
    this.radioElements = document.getElementsByName('camera');
    this.cameraName = document.getElementById('camera-name');
    this.chooseCameraBtn = document.getElementById('choose-camera');
    this.initEventListeners();
  }

  getInstance() {
    return Panel.hlsInstance;
  }

  clearInstance() {
    Panel.hlsInstance = null;
  }

  get radioValueStorage() {
    return localStorage.getItem('radioValue');
  }

  initEventListeners() {
    this.handleStartStreamEventListener();
    this.handleEndStreamEventListener();
    this.handleLogoutEventListener();
  }

  handleStartStreamEventListener() {
    this.startStreamBtn.addEventListener('click', async () => {
      this.radioElements.forEach((radio) => {
        if (radio.checked) {
          localStorage.setItem('radioValue', radio.value);
        }
      });

      insertText(this.cameraName, this.radioValueStorage == 'camera-first' ? CAMERA_NAME.camera1 : CAMERA_NAME.camera2);
      hideElement([this.chooseCameraBtn, this.startStreamBtn]);

      try {
        await fetch('/start-stream', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ value: this.radioValueStorage }),
        });
      } catch (error) {
        console.error('Error:', error);
      }
    });
  }

  handleEndStreamEventListener() {
    this.endStreamBtn.addEventListener('click', async () => {
      try {
        await fetch('/end-stream');

        hideElement([this.videoWrapper, this.endStreamBtn, this.recordingStatus]);
        showElement([this.startStreamBtn, this.chooseCameraBtn]);
        insertText(this.streamStatus, 'Transmisja offline');
        insertText(this.cameraName, '');

        this.clearInstance();
      } catch (error) {
        console.error('Error:', error);
      }
    });
  }

  handleLogoutEventListener() {
    this.logoutButton.addEventListener('click', async () => {
      try {
        const data = await fetch('/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        const response = await data.json();
        if (response.success) window.location.href = response.redirect;
      } catch (error) {
        console.error('Error:', error);
      }
    });
  }
}
