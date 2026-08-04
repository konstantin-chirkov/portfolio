(function () {
  var row = document.querySelector(".case__more-scroller");
  var prev = document.querySelector(".case__more-nav--prev");
  var next = document.querySelector(".case__more-nav--next");
  if (!row || !prev || !next) return;

  function step() {
    var card = row.querySelector(".card");
    return card ? card.getBoundingClientRect().width + 24 : row.clientWidth;
  }

  function sync() {
    var max = row.scrollWidth - row.clientWidth;
    prev.hidden = row.scrollLeft <= 8;
    next.hidden = row.scrollLeft >= max - 8;
  }

  prev.addEventListener("click", function () {
    row.scrollBy({ left: -step(), behavior: "smooth" });
  });

  next.addEventListener("click", function () {
    row.scrollBy({ left: step(), behavior: "smooth" });
  });

  row.addEventListener("scroll", sync, { passive: true });
  window.addEventListener("resize", sync);
  sync();
})();
