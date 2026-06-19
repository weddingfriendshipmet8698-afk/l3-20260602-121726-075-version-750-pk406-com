(function () {
  function setupPlayer(player) {
    var video = player.querySelector('video');
    var overlay = player.querySelector('.player-overlay');
    var hlsSource = player.dataset.hls;
    var mp4Source = player.dataset.mp4;
    var initialized = false;

    function initSource() {
      if (initialized || !video) {
        return;
      }
      initialized = true;
      if (hlsSource && video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = hlsSource;
        return;
      }
      if (mp4Source) {
        video.src = mp4Source;
      }
    }

    function reveal() {
      if (overlay) {
        overlay.classList.add('hidden');
      }
      if (video) {
        video.setAttribute('controls', 'controls');
      }
    }

    function play() {
      initSource();
      var result = video.play();
      if (result && typeof result.then === 'function') {
        result.then(reveal).catch(function () {
          if (mp4Source && video.src.indexOf(mp4Source) === -1) {
            video.src = mp4Source;
            video.play().then(reveal).catch(function () {});
          }
        });
        return;
      }
      reveal();
    }

    if (overlay) {
      overlay.addEventListener('click', play);
    }

    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          play();
        } else {
          video.pause();
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.movie-player').forEach(setupPlayer);
  });
})();
