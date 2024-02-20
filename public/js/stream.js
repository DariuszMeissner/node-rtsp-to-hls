const evtSource = new EventSource("/events");
evtSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (!data.isStarted.found) {
    window.location.reload();
  }
};

function showStream() {
  // eslint-disable-next-line no-undef
  if (Hls.isSupported()) {
    const video = document.getElementById('video');
    const navigationPanel = document.querySelector('.navigation-panel');
    const startStreamBtn = document.getElementById('startStream')
    const endStreamBtn = document.getElementById('endStream')

    if (navigationPanel) { navigationPanel.classList.remove('hide'); }
    if (startStreamBtn) { startStreamBtn.classList.add('hide') }
    if (endStreamBtn) { endStreamBtn.classList.remove('hide') }
    video.classList.remove('hide');

    // eslint-disable-next-line no-undef
    const hls = new Hls();
    hls.loadSource('/hls/stream.m3u8');
    hls.attachMedia(video);
  }
}

async function checkStreamStatus() {
  let continuePolling = true;
  const startStreamBtn = document.getElementById('startStream')

  while (continuePolling) {
    try {
      const response = await fetch('/stream-status');
      const data = await response.json();
      const statusElement = document.getElementById('stream-status');

      if (data.found) {
        statusElement.textContent = data.message;
        continuePolling = false

        showStream()
      } else if (data.found === false) {
        statusElement.textContent = "Stream loading...";
        if (startStreamBtn) startStreamBtn.classList.add('hide');
      } else {
        continuePolling = false
        statusElement.textContent = "Brak sygnału z kamery. Stream offline. ";
      }
    } catch (error) {
      console.error('Error fetching stream status:', error);
      document.getElementById('stream-status').textContent = "Error checking status.";
      break; // Optionally stop polling in case of an error
    }

    // Wait for 2 seconds before next poll
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

async function chechStreamOnStartPage() {
  try {
    const response = await fetch('/stream-status');
    const data = await response.json();

    if (data.found) {
      showStream()
      document.getElementById('stream-status').textContent = "Stream online"
    } else {
      document.getElementById('stream-status').textContent = "Stream offline"
    }
  } catch (error) {
    console.error('Error fetching stream status:', error);
    document.getElementById('stream-status').textContent = "Error checking status.";
  }
}

document.addEventListener('DOMContentLoaded', () => {
  chechStreamOnStartPage()

  const startStreamBtn = document.getElementById('startStream')
  if (startStreamBtn) {
    startStreamBtn.addEventListener('click', checkStreamStatus)
  }
})