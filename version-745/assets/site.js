(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var siteNav = document.querySelector('[data-site-nav]');

  if (menuButton && siteNav) {
    menuButton.addEventListener('click', function () {
      siteNav.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var activeSlide = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    activeSlide = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === activeSlide);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === activeSlide);
    });
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      showSlide(Number(dot.dataset.heroDot || 0));
    });
  });

  if (slides.length > 1) {
    setInterval(function () {
      showSlide(activeSlide + 1);
    }, 5200);
  }

  document.querySelectorAll('[data-filter-root]').forEach(function (root) {
    var textInput = root.querySelector('[data-filter-text]');
    var regionSelect = root.querySelector('[data-filter-region]');
    var yearSelect = root.querySelector('[data-filter-year]');
    var cards = Array.prototype.slice.call(root.querySelectorAll('.movie-card'));
    var count = root.querySelector('[data-filter-count]');

    function applyFilter() {
      var text = (textInput && textInput.value ? textInput.value : '').trim().toLowerCase();
      var region = regionSelect && regionSelect.value ? regionSelect.value : '';
      var year = yearSelect && yearSelect.value ? yearSelect.value : '';
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = [
          card.dataset.title || '',
          card.dataset.genre || '',
          card.dataset.region || '',
          card.textContent || ''
        ].join(' ').toLowerCase();
        var okText = !text || haystack.indexOf(text) !== -1;
        var okRegion = !region || card.dataset.region === region;
        var okYear = !year || card.dataset.year === year;
        var shouldShow = okText && okRegion && okYear;

        card.style.display = shouldShow ? '' : 'none';
        if (shouldShow) {
          visible += 1;
        }
      });

      if (count) {
        count.textContent = String(visible);
      }
    }

    [textInput, regionSelect, yearSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilter);
        control.addEventListener('change', applyFilter);
      }
    });
  });

  document.querySelectorAll('[data-video-shell]').forEach(function (shell) {
    var video = shell.querySelector('video');
    var start = shell.querySelector('[data-video-start]');
    var status = shell.querySelector('[data-video-status]');
    var src = shell.dataset.src;
    var initialized = false;
    var hlsInstance = null;

    function setStatus(message) {
      if (status) {
        status.textContent = message;
      }
    }

    function initializePlayer() {
      if (!video || !src || initialized) {
        return;
      }

      initialized = true;

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(src);
        hlsInstance.attachMedia(video);
        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
          setStatus('播放源加载完成');
          video.play().catch(function () {
            setStatus('点击播放器继续播放');
          });
        });
        hlsInstance.on(window.Hls.Events.ERROR, function (_event, data) {
          if (data && data.fatal) {
            setStatus('播放源连接异常');
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
        video.addEventListener('loadedmetadata', function () {
          setStatus('播放源加载完成');
          video.play().catch(function () {
            setStatus('点击播放器继续播放');
          });
        }, { once: true });
      } else {
        video.src = src;
        setStatus('当前浏览器需要 HLS 支持');
      }
    }

    if (start) {
      start.addEventListener('click', function () {
        shell.classList.add('is-playing');
        initializePlayer();
        if (video) {
          video.setAttribute('controls', 'controls');
          video.play().catch(function () {
            setStatus('点击播放器继续播放');
          });
        }
      });
    }

    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          shell.classList.add('is-playing');
          initializePlayer();
          video.play().catch(function () {
            setStatus('点击播放器继续播放');
          });
        }
      });
    }

    window.addEventListener('beforeunload', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  });



  Array.prototype.slice.call(document.querySelectorAll('img')).forEach(function (image) {
    image.addEventListener('error', function () {
      var frame = image.closest('.poster-frame, .hero-poster, .detail-poster');
      if (frame) {
        frame.classList.add('is-missing');
        frame.setAttribute('data-fallback-title', image.getAttribute('alt') || '高清剧集');
      }
    });
  });

  var searchPage = document.querySelector('[data-search-page]');

  if (searchPage) {
    var input = searchPage.querySelector('[data-search-input]');
    var category = searchPage.querySelector('[data-search-category]');
    var button = searchPage.querySelector('[data-search-button]');
    var results = searchPage.querySelector('[data-search-results]');
    var count = searchPage.querySelector('[data-search-count]');
    var defaults = searchPage.querySelector('[data-search-default]');
    var defaultHeading = searchPage.querySelector('.search-default-heading');
    var movies = [];

    function escapeHtml(value) {
      return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function cardTemplate(movie) {
      return [
        '<article class="movie-card movie-card-compact">',
        '  <a class="poster-frame" href="movies/' + movie.id + '.html">',
        '    <img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
        '    <span class="play-mask">▶</span>',
        '    <span class="duration-badge">' + escapeHtml(movie.duration) + '</span>',
        '  </a>',
        '  <div class="movie-card-body">',
        '    <a class="movie-card-title" href="movies/' + movie.id + '.html">' + escapeHtml(movie.title) + '</a>',
        '    <p>' + escapeHtml(movie.oneLine) + '</p>',
        '    <div class="movie-meta-row">',
        '      <span>' + escapeHtml(movie.year) + '</span>',
        '      <span>' + escapeHtml(movie.region) + '</span>',
        '      <span>' + escapeHtml(movie.category) + '</span>',
        '    </div>',
        '  </div>',
        '</article>'
      ].join('');
    }

    function runSearch() {
      var keyword = (input && input.value ? input.value : '').trim().toLowerCase();
      var categoryValue = category && category.value ? category.value : '';

      var filtered = movies.filter(function (movie) {
        var haystack = [
          movie.title,
          movie.region,
          movie.year,
          movie.genre,
          movie.tags,
          movie.category,
          movie.oneLine
        ].join(' ').toLowerCase();
        var okKeyword = !keyword || haystack.indexOf(keyword) !== -1;
        var okCategory = !categoryValue || movie.category === categoryValue;
        return okKeyword && okCategory;
      }).slice(0, 120);

      if (results) {
        results.innerHTML = filtered.map(cardTemplate).join('');
      }

      if (count) {
        count.textContent = String(filtered.length);
      }

      var hasQuery = Boolean(keyword || categoryValue);
      if (defaults) {
        defaults.classList.toggle('is-hidden', hasQuery);
      }
      if (defaultHeading) {
        defaultHeading.classList.toggle('is-hidden', hasQuery);
      }
    }

    function readQuery() {
      var params = new URLSearchParams(window.location.search);
      var q = params.get('q');
      if (q && input) {
        input.value = q;
      }
    }

    fetch('assets/movies-index.json')
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        movies = data;
        readQuery();
        runSearch();
      })
      .catch(function () {
        if (count) {
          count.textContent = '0';
        }
      });

    if (button) {
      button.addEventListener('click', runSearch);
    }
    if (input) {
      input.addEventListener('input', runSearch);
    }
    if (category) {
      category.addEventListener('change', runSearch);
    }
  }
})();
