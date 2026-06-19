document.addEventListener('DOMContentLoaded', function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var menu = document.querySelector('[data-main-nav]');

  if (menuButton && menu) {
    menuButton.addEventListener('click', function () {
      menu.classList.toggle('is-open');
    });
  }

  var slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
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

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showSlide(index);
    });
  });

  if (slides.length > 1) {
    window.setInterval(function () {
      showSlide(activeSlide + 1);
    }, 5200);
  }

  var filterForms = Array.from(document.querySelectorAll('[data-filter-panel]'));

  filterForms.forEach(function (panel) {
    var scope = panel.getAttribute('data-filter-target') || 'body';
    var target = document.querySelector(scope) || document;
    var cards = Array.from(target.querySelectorAll('[data-title]'));
    var keyword = panel.querySelector('[data-filter-keyword]');
    var year = panel.querySelector('[data-filter-year]');
    var type = panel.querySelector('[data-filter-type]');
    var region = panel.querySelector('[data-filter-region]');
    var reset = panel.querySelector('[data-filter-reset]');

    function readValue(input) {
      return input ? input.value.trim().toLowerCase() : '';
    }

    function applyFilter() {
      var keywordValue = readValue(keyword);
      var yearValue = readValue(year);
      var typeValue = readValue(type);
      var regionValue = readValue(region);

      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute('data-title'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-tags'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type')
        ].join(' ').toLowerCase();

        var matchesKeyword = !keywordValue || haystack.indexOf(keywordValue) !== -1;
        var matchesYear = !yearValue || card.getAttribute('data-year') === yearValue;
        var matchesType = !typeValue || card.getAttribute('data-type') === typeValue;
        var matchesRegion = !regionValue || card.getAttribute('data-region') === regionValue;

        card.hidden = !(matchesKeyword && matchesYear && matchesType && matchesRegion);
      });
    }

    [keyword, year, type, region].forEach(function (input) {
      if (input) {
        input.addEventListener('input', applyFilter);
        input.addEventListener('change', applyFilter);
      }
    });

    if (reset) {
      reset.addEventListener('click', function () {
        [keyword, year, type, region].forEach(function (input) {
          if (input) {
            input.value = '';
          }
        });
        applyFilter();
      });
    }

    var params = new URLSearchParams(window.location.search);
    if (keyword && params.get('q')) {
      keyword.value = params.get('q');
      applyFilter();
    }
  });
});
