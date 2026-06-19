(() => {
  const menuButton = document.querySelector('[data-menu-toggle]');
  const mobilePanel = document.querySelector('[data-mobile-panel]');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', () => {
      mobilePanel.classList.toggle('is-open');
    });
  }

  const hero = document.querySelector('[data-hero]');
  if (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    let current = 0;

    const showSlide = (index) => {
      if (!slides.length) return;
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, idx) => slide.classList.toggle('is-active', idx === current));
      dots.forEach((dot, idx) => dot.classList.toggle('is-active', idx === current));
    };

    dots.forEach((dot) => {
      dot.addEventListener('click', () => showSlide(Number(dot.dataset.heroDot || 0)));
    });

    window.setInterval(() => showSlide(current + 1), 5200);
  }

  const normalize = (value) => String(value || '').trim().toLowerCase();

  document.querySelectorAll('[data-filter-scope]').forEach((scope) => {
    const input = scope.querySelector('[data-filter-input]');
    const year = scope.querySelector('[data-year-filter]');
    const region = scope.querySelector('[data-region-filter]');
    const list = document.querySelector('[data-card-list]');

    if (!list) return;

    const cards = Array.from(list.querySelectorAll('.movie-card'));

    const applyFilter = () => {
      const keyword = normalize(input ? input.value : '');
      const yearValue = normalize(year ? year.value : '');
      const regionValue = normalize(region ? region.value : '');

      cards.forEach((card) => {
        const haystack = normalize([
          card.dataset.title,
          card.dataset.region,
          card.dataset.type,
          card.dataset.genre,
          card.textContent
        ].join(' '));
        const matchKeyword = !keyword || haystack.includes(keyword);
        const matchYear = !yearValue || normalize(card.dataset.year) === yearValue;
        const matchRegion = !regionValue || normalize(card.dataset.region) === regionValue;
        card.classList.toggle('is-hidden', !(matchKeyword && matchYear && matchRegion));
      });
    };

    [input, year, region].forEach((control) => {
      if (control) control.addEventListener('input', applyFilter);
      if (control) control.addEventListener('change', applyFilter);
    });

    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');
    if (query && input) {
      input.value = query;
      applyFilter();
    }
  });

  const playButton = document.querySelector('[data-play-button]');
  const video = document.querySelector('#videoPlayer');

  if (playButton && video) {
    const startPlayer = () => {
      const source = video.dataset.src;
      if (!source) return;

      if (window.Hls && window.Hls.isSupported()) {
        const hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => {});
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        video.addEventListener('loadedmetadata', () => {
          video.play().catch(() => {});
        }, { once: true });
      } else {
        video.src = source;
        video.play().catch(() => {});
      }

      playButton.classList.add('is-hidden');
    };

    playButton.addEventListener('click', startPlayer);
  }
})();
