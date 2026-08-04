/* События для GoatCounter. Просмотры страниц он считает сам — здесь только то,
   чего в просмотрах не видно:
     cv-download-ru / -en      — клик по кнопке резюме (уход на Google Drive)
     case-read-<кейс>-<язык>   — дочитал кейс до блока с выводами
     lang-switch-to-en / -ru   — переключение языка
     tab-visual                — открыл вкладку «Визуал» на главной (URL не меняется)

   Счётчик на localhost намеренно молчит — GoatCounter сам игнорирует локальные
   адреса, поэтому тестовые заходы в статистику не попадают. */
(function () {
  var lang = location.pathname.indexOf("/en/") !== -1 ? "en" : "ru";

  function track(path, title) {
    if (!window.goatcounter || typeof window.goatcounter.count !== "function") return;
    window.goatcounter.count({ path: path, title: title || path, event: true });
  }

  /* Кнопка резюме. Ссылка открывается в новой вкладке, поэтому текущая страница
     остаётся жива и запрос успевает уйти — sendBeacon не нужен. */
  document.querySelectorAll(".pill--dark[href*='drive.google.com']").forEach(function (a) {
    a.addEventListener("click", function () {
      track("cv-download-" + lang, "Скачал резюме (" + lang.toUpperCase() + ")");
    });
  });

  /* Переключатель языка */
  var langLink = document.querySelector(".pill--lang");
  if (langLink) {
    langLink.addEventListener("click", function () {
      var to = lang === "ru" ? "en" : "ru";
      track("lang-switch-to-" + to, "Переключил язык на " + to.toUpperCase());
    });
  }

  /* Вкладка «Визуал» на главной: URL не меняется, в просмотрах её не видно */
  var visualTab = document.getElementById("tab-visual");
  if (visualTab) {
    var visualCounted = false;
    visualTab.addEventListener("click", function () {
      if (visualCounted) return;
      visualCounted = true;
      track("tab-visual", "Открыл вкладку «Визуал»");
    });
  }

  /* Дочитывание кейса: последний .case__section — это «Заключение» (у HR —
     «Результаты»), то есть место, где названы цифры. Если человек до него
     доскроллил, кейс прочитан, а не просто открыт.

     Намеренно на обычном слушателе скролла, а не на IntersectionObserver: во
     встроенных браузерах (Telegram и подобные) вкладка нередко считается
     скрытой, и колбэки наблюдателя там не вызываются вовсе. */
  var sections = document.querySelectorAll(".case__section");
  var last = sections[sections.length - 1];
  var slug = (location.pathname.match(/case-([a-z]+)\.html/) || [])[1];
  if (last && slug) {
    var counted = false;
    var check = function () {
      if (counted) return;
      var box = last.getBoundingClientRect();
      /* засчитываем, когда блок с выводами реально показался на экране */
      if (box.top > window.innerHeight * 0.8 || box.bottom < 0) return;
      counted = true;
      window.removeEventListener("scroll", check);
      track("case-read-" + slug + "-" + lang, "Дочитал кейс " + slug + " (" + lang.toUpperCase() + ")");
    };
    window.addEventListener("scroll", check, { passive: true });
    check();
  }
})();
