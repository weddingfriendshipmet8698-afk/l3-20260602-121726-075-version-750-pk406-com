(function () {
  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  onReady(function () {
    var menuToggle = document.querySelector("[data-menu-toggle]");
    var siteNav = document.querySelector("[data-site-nav]");
    if (menuToggle && siteNav) {
      menuToggle.addEventListener("click", function () {
        siteNav.classList.toggle("open");
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    var current = 0;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === current);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        showSlide(index);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    var filterRoots = Array.prototype.slice.call(document.querySelectorAll("[data-filter-root]"));
    filterRoots.forEach(function (root) {
      var input = root.querySelector("[data-search-input]");
      var yearFilter = root.querySelector("[data-year-filter]");
      var typeFilter = root.querySelector("[data-type-filter]");
      var cards = Array.prototype.slice.call(root.querySelectorAll(".movie-card"));
      var empty = root.querySelector("[data-empty-state]");

      function normalize(value) {
        return String(value || "").toLowerCase().trim();
      }

      function applyFilters() {
        var keyword = normalize(input && input.value);
        var year = yearFilter ? yearFilter.value : "";
        var type = typeFilter ? typeFilter.value : "";
        var visible = 0;

        cards.forEach(function (card) {
          var haystack = normalize(card.getAttribute("data-title") + " " + card.getAttribute("data-meta"));
          var matchKeyword = !keyword || haystack.indexOf(keyword) !== -1;
          var matchYear = !year || card.getAttribute("data-year") === year;
          var matchType = !type || card.getAttribute("data-type") === type;
          var match = matchKeyword && matchYear && matchType;
          card.style.display = match ? "" : "none";
          if (match) {
            visible += 1;
          }
        });

        if (empty) {
          empty.style.display = visible ? "none" : "block";
        }
      }

      if (input) {
        input.addEventListener("input", applyFilters);
      }
      if (yearFilter) {
        yearFilter.addEventListener("change", applyFilters);
      }
      if (typeFilter) {
        typeFilter.addEventListener("change", applyFilters);
      }
      applyFilters();
    });
  });
})();
