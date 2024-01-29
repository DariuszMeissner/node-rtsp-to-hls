if (Hls.isSupported()) {
  var video = document.getElementById('video');
  var hls = new Hls();
  hls.loadSource('/hls/stream.m3u8');
  hls.attachMedia(video);
}

