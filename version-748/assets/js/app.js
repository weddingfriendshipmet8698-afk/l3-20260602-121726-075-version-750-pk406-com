(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
      return;
    }
    document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var nav = document.querySelector('[data-site-nav]');
    if (menuButton && nav) {
      menuButton.addEventListener('click', function () {
        nav.classList.toggle('open');
      });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
      var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
      var prev = hero.querySelector('[data-hero-prev]');
      var next = hero.querySelector('[data-hero-next]');
      var index = 0;
      var timer = null;

      function show(nextIndex) {
        if (!slides.length) {
          return;
        }
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle('active', i === index);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle('active', i === index);
        });
      }

      function restart() {
        if (timer) {
          window.clearInterval(timer);
        }
        timer = window.setInterval(function () {
          show(index + 1);
        }, 5200);
      }

      dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
          show(i);
          restart();
        });
      });

      if (prev) {
        prev.addEventListener('click', function () {
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

      restart();
    }

    var filterList = document.querySelector('[data-filter-list]');
    if (filterList) {
      var input = document.querySelector('[data-filter-input]');
      var year = document.querySelector('[data-filter-year]');
      var type = document.querySelector('[data-filter-type]');
      var empty = document.querySelector('[data-empty-state]');
      var cards = Array.prototype.slice.call(filterList.querySelectorAll('.movie-card'));
      var params = new URLSearchParams(window.location.search);
      var queryValue = params.get('q') || '';
      if (input && queryValue) {
        input.value = queryValue;
      }

      function matchYear(cardYear, selectedYear) {
        if (!selectedYear) {
          return true;
        }
        if (selectedYear === '2022') {
          return Number(cardYear) <= 2022;
        }
        return String(cardYear) === selectedYear;
      }

      function applyFilter() {
        var q = input ? input.value.trim().toLowerCase() : '';
        var selectedYear = year ? year.value : '';
        var selectedType = type ? type.value : '';
        var shown = 0;
        cards.forEach(function (card) {
          var haystack = [
            card.dataset.title,
            card.dataset.region,
            card.dataset.type,
            card.dataset.genre,
            card.dataset.tags,
            card.textContent
          ].join(' ').toLowerCase();
          var ok = (!q || haystack.indexOf(q) !== -1) && matchYear(card.dataset.year, selectedYear) && (!selectedType || card.dataset.type === selectedType);
          card.hidden = !ok;
          if (ok) {
            shown += 1;
          }
        });
        if (empty) {
          empty.hidden = shown !== 0;
        }
      }

      [input, year, type].forEach(function (el) {
        if (el) {
          el.addEventListener('input', applyFilter);
          el.addEventListener('change', applyFilter);
        }
      });
      applyFilter();
    }
  });
})();
