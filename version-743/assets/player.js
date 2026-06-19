(function () {
  var video = document.querySelector('[data-video-url]');
  var overlay = document.querySelector('.play-overlay');
  var playButton = document.querySelector('[data-play-button]');

  if (!video) {
    return;
  }

  var streamUrl = video.getAttribute('data-video-url');

  function attachStream() {
    if (!streamUrl || video.getAttribute('data-ready') === 'true') {
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      video.hlsInstance = hls;
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
    } else {
      video.src = streamUrl;
    }

    video.setAttribute('data-ready', 'true');
  }

  function startPlayback() {
    attachStream();

    if (overlay) {
      overlay.classList.add('is-hidden');
    }

    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {});
    }
  }

  if (playButton) {
    playButton.addEventListener('click', startPlayback);
  }

  video.addEventListener('click', function () {
    if (video.paused) {
      startPlayback();
    }
  });

  video.addEventListener('play', function () {
    if (overlay) {
      overlay.classList.add('is-hidden');
    }
  });

  attachStream();
})();
