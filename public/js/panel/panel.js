import { hideElement, showElement, insertText } from "../utils/utils.js";

export default class Panel {
  hlsInstance = null;

  constructor() {
    this.startStreamBtn = document.getElementById('startStream');
    this.endStreamBtn = document.getElementById('endStream');
    this.streamStatus = document.getElementById('stream-status');
    this.recordingStatus = document.getElementById('status-wrapper');
    this.video = document.getElementById('video');
    this.logoutButton = document.getElementById('logoutButton');
    this.initEventListeners();
  }

  getInstance() {
    return Panel.hlsInstance
  }

  clearInstance() {
    Panel.hlsInstance = null;
  }

  initEventListeners() {
    this.handleStartStreamEventListener();
    this.handleEndStreamEventListener();
    this.handleLogoutEventListener();
  }

  handleStartStreamEventListener() {
    this.startStreamBtn.addEventListener('click', async () => {
      try {
        await fetch('/start-stream')
      } catch (error) {
        console.error('Error:', error);
      }
    });
  }


  handleEndStreamEventListener() {
    this.endStreamBtn.addEventListener('click', async () => {
      try {
        await fetch('/end-stream')
        hideElement([this.video, this.endStreamBtn, this.recordingStatus])
        showElement([this.startStreamBtn])
        insertText(this.streamStatus, 'Stream offline')

        this.clearInstance()
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
          credentials: 'include'
        });

        const response = await data.json();
        if (response.success) window.location.href = response.redirect
      } catch (error) {
        console.error('Error:', error);
      }
    });
  }
}