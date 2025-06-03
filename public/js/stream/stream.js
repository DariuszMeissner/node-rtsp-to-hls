import Panel from '../panel/panel.js';
import { insertText, showElement, hideElement, CAMERA_NAME } from '../utils/utils.js';

export default class Stream extends Panel {
  constructor() {
    super();
    this.btnFullscreen = document.getElementById('btn-fullscrean');
    this.btnPlay = document.getElementById('btn-play');
    this.btnStop = document.getElementById('btn-stop');
    this.checkStreamOnStartPage();
    this.initEventListeners();
    this.initWebSocket();
  }

  get radioValueStorage() {
    return localStorage.getItem('radioValue');
  }

  initEventListeners() {
    if (this.startStreamBtn) this.startStreamBtn.addEventListener('click', async () => this.checkStreamStatus());
    if (this.btnFullscreen) this.btnFullscreen.addEventListener('click', () => this.toggleFullScreen());
    if (this.btnPlay) this.btnPlay.addEventListener('click', () => this.playStopVideo());
    if (this.btnStop) this.btnStop.addEventListener('click', () => this.playStopVideo());
  }

  initWebSocket() {
    this.ws = new WebSocket('ws://localhost:3000');

    this.ws.onerror = (error) => console.error('WebSocket Error:', error);
    this.ws.onopen = () => console.log('WebSocket is open now.');
    this.ws.onclose = () => console.log('WebSocket is closed now.');
    this.ws.onmessage = (event) => {
      const transcription = event.data;

      if (transcription.size === 0) return;

      insertText(this.captions, transcription);
    };
  }

  toggleFullScreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      this.videoWrapper.requestFullscreen();
    }
  }

  playStopVideo() {
    if (this.video.paused) {
      this.video.play();
      hideElement([this.btnPlay]);
      showElement([this.btnStop]);
    } else {
      this.video.pause();
      hideElement([this.btnStop]);
      showElement([this.btnPlay]);
    }
  }

  async startRecording() {
    try {
      await fetch('/start-recording', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: this.radioValueStorage }),
      });
      showElement([this.recordingStatus]);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  showStream() {
    if (typeof Hls === 'undefined') {
      insertText(this.streamStatus, 'Hls is not supported');
      return;
    }
    // eslint-disable-next-line no-undef
    if (Hls.isSupported()) {
      // eslint-disable-next-line no-undef
      if (!this.hlsInstance) this.hlsInstance = new Hls();

      if (this.endStreamBtn && this.videoWrapper) {
        showElement([this.endStreamBtn, this.videoWrapper]);
      }

      if (this.startStreamBtn) {
        hideElement([this.startStreamBtn]);
      }

      this.hlsInstance.attachMedia(this.video);
      // eslint-disable-next-line no-undef
      this.hlsInstance.on(Hls.Events.MEDIA_ATTACHED, () => this.hlsInstance.loadSource('/hls/stream.m3u8'));

      hideElement([this.btnStop]);
      showElement([this.btnPlay]);
    }
  }

  async checkStreamStatus() {
    let continuePolling = true;

    while (continuePolling) {
      try {
        const response = await fetch('/stream-status');
        const transcription = await response.json();

        if (transcription.found) {
          insertText(this.streamStatus, transcription.message);

          continuePolling = false;

          this.showStream();
          this.startRecording();
        } else if (transcription.found === false) {
          insertText(this.streamStatus, 'Ładowanie transmisji...');
          if (this.startStreamBtn) hideElement([this.startStreamBtn]);
        } else {
          insertText(this.streamStatus, 'Transmisja offline');
        }
      } catch (error) {
        console.error('Error fetching stream status:', error);
        insertText(this.streamStatus, 'Error checking status.');
        break; // Optionally stop polling in case of an error
      }

      // Wait for 2 seconds before next poll
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  async checkStreamOnStartPage() {
    try {
      const response = await fetch('/stream-status');
      const transcription = await response.json();

      if (transcription.found) {
        this.showStream();

        if (this.cameraName && this.radioValueStorage) {
          const cameraTxt = this.radioValueStorage == 'camera-first' ? CAMERA_NAME.camera1 : CAMERA_NAME.camera2;
          insertText(this.cameraName, cameraTxt);
        }

        if (this.chooseCameraBtn) {
          hideElement([this.chooseCameraBtn]);
        }

        showElement([this.videoWrapper]);
        insertText(this.streamStatus, 'Transmisja online');
        this.recordingStatus && showElement([this.recordingStatus]);
        return;
      }

      insertText(this.streamStatus, 'Transmisja offline');
    } catch (error) {
      console.error('Error fetching stream status:', error);
      insertText(this.streamStatus, 'Error checking status.');
    }
  }
}
