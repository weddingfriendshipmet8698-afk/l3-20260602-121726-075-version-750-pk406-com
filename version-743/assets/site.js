(function () {
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var opened = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dots button'));
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
    setInterval(function () {
      showSlide(activeIndex + 1);
    }, 5200);
  }

  var filterInput = document.querySelector('[data-filter-input]');
  var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter-value]'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-search]'));
  var urlQuery = new URLSearchParams(window.location.search).get('q') || '';

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function applyFilter(kind) {
    var keyword = normalize(filterInput ? filterInput.value : urlQuery);
    var typeFilter = kind || '';

    cards.forEach(function (card) {
      var haystack = normalize(card.getAttribute('data-search'));
      var cardType = card.getAttribute('data-type') || '';
      var matchesKeyword = !keyword || haystack.indexOf(keyword) !== -1;
      var matchesType = !typeFilter || cardType === typeFilter;
      card.classList.toggle('hidden-card', !(matchesKeyword && matchesType));
    });
  }

  if (filterInput) {
    if (urlQuery) {
      filterInput.value = urlQuery;
    }

    filterInput.addEventListener('input', function () {
      var activeButton = document.querySelector('[data-filter-value].active');
      applyFilter(activeButton ? activeButton.getAttribute('data-filter-value') : '');
    });

    applyFilter('');
  }

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      filterButtons.forEach(function (item) {
        item.classList.remove('active');
      });
      button.classList.add('active');
      applyFilter(button.getAttribute('data-filter-value'));
    });
  });
})();
