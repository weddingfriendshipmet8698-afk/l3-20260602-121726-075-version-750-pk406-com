(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var activeIndex = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    activeIndex = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('active', slideIndex === activeIndex);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('active', dotIndex === activeIndex);
    });
  }

  dots.forEach(function (dot, dotIndex) {
    dot.addEventListener('click', function () {
      showSlide(dotIndex);
    });
  });

  if (slides.length > 1) {
    showSlide(0);
    window.setInterval(function () {
      showSlide(activeIndex + 1);
    }, 5200);
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function attachSearch(input) {
    var selector = input.getAttribute('data-search-input') || '[data-card]';
    var cards = Array.prototype.slice.call(document.querySelectorAll(selector));
    var empty = document.querySelector('[data-empty-tip]');

    input.addEventListener('input', function () {
      var keyword = normalize(input.value);
      var visibleCount = 0;

      cards.forEach(function (card) {
        var text = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-year'),
          card.textContent
        ].join(' '));
        var matched = !keyword || text.indexOf(keyword) !== -1;

        card.style.display = matched ? '' : 'none';
        if (matched) {
          visibleCount += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('show', visibleCount === 0);
      }
    });
  }

  Array.prototype.slice.call(document.querySelectorAll('[data-search-input]')).forEach(attachSearch);

  function startPlayer(box) {
    var video = box.querySelector('video');
    var source = box.getAttribute('data-src') || (video && video.getAttribute('data-src'));

    if (!video || !source) {
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      if (!video.__hlsInstance) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        video.__hlsInstance = hls;
      }
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      if (!video.getAttribute('src')) {
        video.setAttribute('src', source);
      }
    } else {
      if (!video.getAttribute('src')) {
        video.setAttribute('src', source);
      }
    }

    video.setAttribute('controls', 'controls');
    box.classList.add('is-playing');

    var promise = video.play();
    if (promise && promise.catch) {
      promise.catch(function () {
        video.setAttribute('controls', 'controls');
      });
    }
  }

  Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(function (box) {
    var video = box.querySelector('video');
    var button = box.querySelector('[data-play]');

    if (button) {
      button.addEventListener('click', function () {
        startPlayer(box);
      });
    }

    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          startPlayer(box);
        }
      });
    }
  });
}());
