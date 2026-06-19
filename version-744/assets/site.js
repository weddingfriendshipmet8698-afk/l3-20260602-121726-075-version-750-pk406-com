function toggleMobileMenu() {
  var button = document.querySelector('[data-menu-toggle]');
  var nav = document.querySelector('[data-mobile-nav]');

  if (!button || !nav) {
    return;
  }

  button.addEventListener('click', function () {
    nav.classList.toggle('open');
  });
}

function initHeroCarousel() {
  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var previous = document.querySelector('[data-hero-prev]');
  var next = document.querySelector('[data-hero-next]');
  var index = 0;
  var timer = null;

  if (!slides.length) {
    return;
  }

  function show(nextIndex) {
    index = (nextIndex + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('active', slideIndex === index);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('active', dotIndex === index);
    });
  }

  function start() {
    timer = window.setInterval(function () {
      show(index + 1);
    }, 5200);
  }

  function restart() {
    if (timer) {
      window.clearInterval(timer);
    }

    start();
  }

  dots.forEach(function (dot, dotIndex) {
    dot.addEventListener('click', function () {
      show(dotIndex);
      restart();
    });
  });

  if (previous) {
    previous.addEventListener('click', function () {
      show(index - 1);
      restart();
    });
  }

  if (next) {
    next.addEventListener('click', function () {
      show(index + 1);
      restart();
    });
  }

  show(0);
  start();
}

function initFilters() {
  var panel = document.querySelector('[data-filter-panel]');

  if (!panel) {
    return;
  }

  var input = panel.querySelector('[data-filter-keyword]');
  var year = panel.querySelector('[data-filter-year]');
  var type = panel.querySelector('[data-filter-type]');
  var category = panel.querySelector('[data-filter-category]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-search]'));
  var counter = document.querySelector('[data-result-count]');

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function filter() {
    var keyword = normalize(input && input.value);
    var yearValue = normalize(year && year.value);
    var typeValue = normalize(type && type.value);
    var categoryValue = normalize(category && category.value);
    var visible = 0;

    cards.forEach(function (card) {
      var haystack = normalize(card.getAttribute('data-search'));
      var cardYear = normalize(card.getAttribute('data-year'));
      var cardType = normalize(card.getAttribute('data-type'));
      var cardCategory = normalize(card.getAttribute('data-category'));
      var matched = true;

      if (keyword && haystack.indexOf(keyword) === -1) {
        matched = false;
      }

      if (yearValue && cardYear !== yearValue) {
        matched = false;
      }

      if (typeValue && cardType !== typeValue) {
        matched = false;
      }

      if (categoryValue && cardCategory !== categoryValue) {
        matched = false;
      }

      card.classList.toggle('hidden-by-filter', !matched);

      if (matched) {
        visible += 1;
      }
    });

    if (counter) {
      counter.textContent = String(visible);
    }
  }

  [input, year, type, category].forEach(function (control) {
    if (control) {
      control.addEventListener('input', filter);
      control.addEventListener('change', filter);
    }
  });

  filter();
}

function setupMoviePlayer(config) {
  var video = document.getElementById(config.videoId);
  var overlay = document.getElementById(config.overlayId);
  var button = document.getElementById(config.buttonId);
  var initialized = false;
  var hls = null;

  if (!video || !config.source) {
    return;
  }

  function loadVideo() {
    if (initialized) {
      return;
    }

    initialized = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = config.source;
    } else if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(config.source);
      hls.attachMedia(video);
    } else {
      video.src = config.source;
    }
  }

  function playVideo() {
    loadVideo();

    if (overlay) {
      overlay.classList.add('hidden');
    }

    var playPromise = video.play();

    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {});
    }
  }

  if (overlay) {
    overlay.addEventListener('click', playVideo);
    overlay.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        playVideo();
      }
    });
  }

  if (button) {
    button.addEventListener('click', function (event) {
      event.stopPropagation();
      playVideo();
    });
  }

  video.addEventListener('play', function () {
    if (overlay) {
      overlay.classList.add('hidden');
    }
  });

  window.addEventListener('beforeunload', function () {
    if (hls) {
      hls.destroy();
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  toggleMobileMenu();
  initHeroCarousel();
  initFilters();
});
