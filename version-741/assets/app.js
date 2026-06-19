document.addEventListener('DOMContentLoaded', function () {
  initMobileNavigation();
  initHeroCarousel();
  initImageFallbacks();
  initHlsPlayers();
  initSearchPage();
});

function initMobileNavigation() {
  var toggle = document.querySelector('[data-menu-toggle]');
  var nav = document.querySelector('[data-mobile-nav]');

  if (!toggle || !nav) {
    return;
  }

  toggle.addEventListener('click', function () {
    nav.classList.toggle('is-open');
  });
}

function initHeroCarousel() {
  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));

  if (slides.length === 0) {
    return;
  }

  var activeIndex = 0;

  function showSlide(index) {
    activeIndex = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === activeIndex);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === activeIndex);
    });
  }

  dots.forEach(function (dot, dotIndex) {
    dot.addEventListener('click', function () {
      showSlide(dotIndex);
    });
  });

  showSlide(0);

  if (slides.length > 1) {
    window.setInterval(function () {
      showSlide(activeIndex + 1);
    }, 5200);
  }
}

function initImageFallbacks() {
  var images = Array.prototype.slice.call(document.querySelectorAll('img'));

  images.forEach(function (image) {
    image.addEventListener('error', function () {
      if (image.dataset.missingHandled === 'true') {
        return;
      }

      image.dataset.missingHandled = 'true';
      image.style.opacity = '0';

      var parent = image.parentElement;
      if (parent) {
        parent.classList.add('img-missing');
      }
    });
  });
}

function initHlsPlayers() {
  var players = Array.prototype.slice.call(document.querySelectorAll('video[data-hls-src]'));

  players.forEach(function (video) {
    var source = video.getAttribute('data-hls-src');

    if (!source) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });

      hls.loadSource(source);
      hls.attachMedia(video);

      hls.on(window.Hls.Events.ERROR, function (event, data) {
        if (!data || !data.fatal) {
          return;
        }

        if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
          hls.startLoad();
        } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
          hls.recoverMediaError();
        } else {
          hls.destroy();
        }
      });
    }
  });
}

function initSearchPage() {
  var resultRoot = document.querySelector('[data-search-results]');

  if (!resultRoot || !window.SEARCH_INDEX) {
    return;
  }

  var params = new URLSearchParams(window.location.search);
  var query = (params.get('q') || '').trim();
  var input = document.querySelector('[data-search-input]');

  if (input) {
    input.value = query;
  }

  if (!query) {
    resultRoot.innerHTML = '<p class="movie-meta">请输入影片名称、类型、地区、年份或标签进行搜索。</p>';
    return;
  }

  var normalizedQuery = query.toLowerCase();
  var results = window.SEARCH_INDEX.filter(function (item) {
    return item.searchText.toLowerCase().indexOf(normalizedQuery) !== -1;
  }).slice(0, 120);

  if (results.length === 0) {
    resultRoot.innerHTML = '<p class="movie-meta">没有找到匹配结果，可以换一个关键词继续搜索。</p>';
    return;
  }

  resultRoot.innerHTML = '<div class="movie-grid">' + results.map(renderSearchCard).join('') + '</div>';
}

function renderSearchCard(item) {
  return [
    '<article class="movie-card">',
    '  <a class="movie-card-link" href="' + escapeHtml(item.url) + '">',
    '    <div class="poster-wrap">',
    '      <img class="movie-poster" src="' + escapeHtml(item.cover) + '" alt="' + escapeHtml(item.title) + '封面" loading="lazy">',
    '      <span class="poster-badge">' + escapeHtml(item.year) + '</span>',
    '      <span class="poster-type">' + escapeHtml(item.type) + '</span>',
    '    </div>',
    '    <div class="movie-card-body">',
    '      <h3>' + escapeHtml(item.title) + '</h3>',
    '      <p class="movie-meta">' + escapeHtml(item.region) + ' · ' + escapeHtml(item.genre) + '</p>',
    '      <p class="movie-one-line">' + escapeHtml(item.oneLine) + '</p>',
    '    </div>',
    '  </a>',
    '</article>'
  ].join('');
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
