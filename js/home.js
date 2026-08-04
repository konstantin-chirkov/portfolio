(function () {
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tabs [role="tab"]'));
  if (tabs.length < 2) return;

  function select(tab, moveFocus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      var panel = document.getElementById(t.getAttribute("aria-controls"));
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      if (panel) panel.hidden = !on;
    });
    if (moveFocus) tab.focus();
    try {
      var name = tab.id.replace("tab-", "");
      history.replaceState(null, "", name === "cases" ? location.pathname : "#" + name);
    } catch (e) {}
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () {
      select(tab, false);
    });
    tab.addEventListener("keydown", function (e) {
      var step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!step) return;
      e.preventDefault();
      select(tabs[(i + step + tabs.length) % tabs.length], true);
    });
  });

  var fromHash = document.getElementById("tab-" + location.hash.replace("#", ""));
  if (fromHash && tabs.indexOf(fromHash) !== -1) select(fromHash, false);
})();
