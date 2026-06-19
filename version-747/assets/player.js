(function () {
  var scriptElement = document.currentScript;
  var assetBase = scriptElement && scriptElement.src ? scriptElement.src.replace(/[^/]+$/, "") : "";

  function startPlayer(container) {
    var video = container.querySelector("video");
    var overlay = container.querySelector(".play-overlay");
    var url = container.getAttribute("data-stream");
    var started = false;

    function begin() {
      if (!video || !url || started) {
        return;
      }
      started = true;
      if (overlay) {
        overlay.classList.add("hidden");
      }

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = url;
        video.play().catch(function () {});
        return;
      }

      if (window.Hls && window.Hls.isSupported && window.Hls.isSupported()) {
        var hls = new window.Hls();
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          video.play().catch(function () {});
        });
        return;
      }

      import(assetBase + "hls-vendor.js").then(function (module) {
        var Hls = module.H;
        if (Hls && Hls.isSupported()) {
          var hls = new Hls();
          hls.loadSource(url);
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED, function () {
            video.play().catch(function () {});
          });
        } else {
          video.src = url;
          video.play().catch(function () {});
        }
      }).catch(function () {
        video.src = url;
        video.play().catch(function () {});
      });
    }

    if (overlay) {
      overlay.addEventListener("click", begin);
    }
    if (video) {
      video.addEventListener("click", begin);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      Array.prototype.forEach.call(document.querySelectorAll("[data-player]"), startPlayer);
    });
  } else {
    Array.prototype.forEach.call(document.querySelectorAll("[data-player]"), startPlayer);
  }
})();
