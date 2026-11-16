// Cabecera, pie y conmutador de tema compartidos por los prototipos.
(function () {
  const t = (() => { try { return localStorage.getItem("labs-theme"); } catch { return null; } })();
  if (t) document.documentElement.dataset.theme = t;
  window.toggleTheme = function () {
    const dark = getComputedStyle(document.documentElement).colorScheme.includes("dark");
    const next = dark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("labs-theme", next); } catch {}
  };
  window.labsChrome = function (label) {
    document.body.insertAdjacentHTML("afterbegin", `
      <header class="topbar"><div class="wrap">
        <a class="brand" href="index.html"><span class="dot"></span>Plazoleta <span class="labs">/ Labs</span></a>
        <nav class="topnav">
          <a class="hide-sm" href="#proyectos">Proyectos</a>
          <a class="hide-sm" href="https://github.com/rldona">GitHub</a>
          <a href="https://plazoleta.dev">plazoleta.dev ↗</a>
          <button class="theme-btn" onclick="toggleTheme()" aria-label="Cambiar tema">◐</button>
        </nav>
      </div></header>`);
    document.body.insertAdjacentHTML("beforeend", `
      <footer class="footer"><div class="wrap">
        <span>© 2026 Plazoleta · Experimentamos en abierto.</span>
        <span>Código bajo licencias open source · <a href="https://github.com/rldona">github.com/rldona</a></span>
      </div></footer>
      <div class="proto-tag">Prototipo ${label} · <a href="index.html">ver todos</a></div>`);
  };
})();
