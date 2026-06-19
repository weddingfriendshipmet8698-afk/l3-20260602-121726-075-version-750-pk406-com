import { H as Hls } from './player-dru42stk.js';

document.addEventListener('DOMContentLoaded', function () {
  var video = document.querySelector('[data-player]');
  var playButton = document.querySelector('[data-play-button]');
  var cover = document.querySelector('[data-player-cover]');
  var status = document.querySelector('[data-player-status]');
  var hls = null;
  var loaded = false;

  function setStatus(message) {
    if (status) {
      status.textContent = message;
    }
  }

  function loadSource() {
    if (!video || loaded) {
      return Promise.resolve();
    }

    var source = video.getAttribute('data-src');

    if (!source) {
      setStatus('未检测到播放源');
      return Promise.resolve();
    }

    loaded = true;
    setStatus('正在加载播放源');

    if (Hls && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });

      hls.loadSource(source);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        setStatus('播放源已就绪');
      });

      hls.on(Hls.Events.ERROR, function (event, data) {
        if (data && data.fatal) {
          setStatus('播放源加载失败，请检查网络或源地址');
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      setStatus('播放源已就绪');
    } else {
      setStatus('当前浏览器暂不支持该播放格式');
    }

    return Promise.resolve();
  }

  function startPlayback() {
    if (!video) {
      return;
    }

    loadSource().then(function () {
      if (cover) {
        cover.classList.add('is-hidden');
      }

      var playPromise = video.play();

      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {
          setStatus('请再次点击播放器开始播放');
        });
      }
    });
  }

  if (playButton) {
    playButton.addEventListener('click', startPlayback);
  }

  if (video) {
    video.addEventListener('play', function () {
      if (cover) {
        cover.classList.add('is-hidden');
      }
      setStatus('正在播放');
    });

    video.addEventListener('pause', function () {
      setStatus('播放已暂停');
    });
  }

  window.addEventListener('beforeunload', function () {
    if (hls) {
      hls.destroy();
    }
  });
});
