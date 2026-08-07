(function () {
  // только для мыши: на тачскрине наводить нечем, а курсор рисовать не на что
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  var cards = document.querySelectorAll(".card");
  if (!cards.length) return;

  document.documentElement.classList.add("has-cursor");

  var dot = document.createElement("div");
  dot.className = "cursor";
  dot.setAttribute("aria-hidden", "true");
  // файл общий для обеих языковых версий — подпись берём из языка страницы
  dot.textContent = document.documentElement.lang === "en" ? "Open" : "Открыть";
  document.body.appendChild(dot);

  var toX = 0,
    toY = 0,
    x = 0,
    y = 0,
    raf = null;

  function place() {
    dot.style.transform =
      "translate(" + x + "px, " + y + "px) translate(-50%, -50%)";
  }

  // кружок догоняет курсор, а не приклеен к нему — так движение читается мягче
  function loop() {
    x += (toX - x) * 0.2;
    y += (toY - y) * 0.2;
    place();
    raf =
      Math.abs(toX - x) > 0.1 || Math.abs(toY - y) > 0.1
        ? requestAnimationFrame(loop)
        : null;
  }

  function move(e) {
    toX = e.clientX;
    toY = e.clientY;
    if (!raf) raf = requestAnimationFrame(loop);
  }

  cards.forEach(function (card) {
    card.addEventListener("mouseenter", function (e) {
      // при входе ставим сразу под курсор, иначе кружок приезжает с прошлого места
      toX = x = e.clientX;
      toY = y = e.clientY;
      place();
      dot.classList.add("is-on");
    });
    card.addEventListener("mousemove", move);
    card.addEventListener("mouseleave", function () {
      dot.classList.remove("is-on");
    });
  });
})();
