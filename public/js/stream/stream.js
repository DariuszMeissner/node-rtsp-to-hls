import Panel from '../panel/panel.js';
import { insertText, showElement, hideElement } from '../utils/utils.js';

export default class Stream extends Panel {
  constructor() {
    super();
    this.chechStreamOnStartPage()
    this.initEventListeners();
  }

  initEventListeners() {
    if (this.startStreamBtn) {
      this.startStreamBtn.addEventListener('click', async () => this.checkStreamStatus());
    }
  }

  async startRecording() {
    try {
      await fetch('/start-recording');
      showElement([this.recordingStatus]);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  showStream() {
    // eslint-disable-next-line no-undef
    if (Hls.isSupported()) {
      if (this.endStreamBtn && this.video) showElement([this.endStreamBtn, this.video]);
      if (this.startStreamBtn) hideElement([this.startStreamBtn]);

      if (typeof Hls === 'undefined') {
        console.error('Hls is not supported');
      } else {
        if (!this.hlsInstance) {
          // eslint-disable-next-line no-undef
          this.hlsInstance = new Hls();
        }
        this.hlsInstance.attachMedia(this.video);
        // eslint-disable-next-line no-undef
        this.hlsInstance.on(Hls.Events.MEDIA_ATTACHED, () => {
          this.hlsInstance.loadSource('/hls/stream.m3u8');

        });
      }
    }
  }

  async checkStreamStatus() {
    let continuePolling = true;

    while (continuePolling) {
      try {
        const response = await fetch('/stream-status');
        const data = await response.json();

        if (data.found) {
          insertText(this.streamStatus, data.message);
          continuePolling = false

          this.showStream()
          this.startRecording()
        } else if (data.found === false) {
          insertText(this.streamStatus, 'Stream loading...');
          if (this.startStreamBtn) hideElement([this.startStreamBtn]);
        } else {
          insertText(this.streamStatus, 'Stream offline.');
        }
      } catch (error) {
        console.error('Error fetching stream status:', error);
        insertText(this.streamStatus, 'Error checking status.');
        break; // Optionally stop polling in case of an error
      }

      // Wait for 2 seconds before next poll
      await new Promise(resolve => setTimeout(resolve, 4000));
    }
  }

  async chechStreamOnStartPage() {
    try {
      const response = await fetch('/stream-status');
      const data = await response.json();

      if (data.found) {
        this.showStream()
        this.recordingStatus && showElement([this.recordingStatus])
        showElement([this.video]);
        insertText(this.streamStatus, 'Stream online');
      } else {
        insertText(this.streamStatus, 'Stream offline');
      }
    } catch (error) {
      console.error('Error fetching stream status:', error);
      insertText(this.streamStatus, 'Error checking status.');
    }
  }
}