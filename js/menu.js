(function () {
  var topbar = document.querySelector(".topbar");
  var burger = document.querySelector(".burger");
  if (!topbar || !burger) return;

  function setOpen(open) {
    topbar.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Закрыть меню" : "Меню");
  }

  burger.addEventListener("click", function (e) {
    e.stopPropagation();
    setOpen(burger.getAttribute("aria-expanded") !== "true");
  });

  // клик мимо шапки и Esc закрывают меню
  document.addEventListener("click", function (e) {
    if (!topbar.contains(e.target)) setOpen(false);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setOpen(false);
  });

  // на десктопе меню не нужно — сбрасываем, чтобы не залипло после поворота
  window.addEventListener("resize", function () {
    if (window.innerWidth > 900) setOpen(false);
  });
})();
