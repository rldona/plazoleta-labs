// Inventario de prototipo: repos públicos de github.com/rldona (16-11-2026).
// stage: product = mantenido · experiment = en marcha, puede romperse · archive = ya no se desarrolla
// La clasificación stage/cat es una propuesta inicial, a revisar.
window.LABS = [
  { name: "FlupCode", repo: "rldona/FlupCode", site: "https://flupcode.com", stage: "product", cat: "devtools", lang: "TypeScript",
    desc: "Harness web y de escritorio al estilo Claude Code para OpenCode.", stars: 1, updated: "2026-11-15",
    releases: 100, lastRelease: "v4.3.1", downloads: 2655, featured: true,
    activity: [192,327,195,503,530,400,336,358,365,618,551,399,752,161,221,0,1,0,18,4] },
  { name: "OpenDisk", repo: "rldona/OpenDisk", site: "https://rldona.github.io/OpenDisk/", stage: "product", cat: "devtools", lang: "Rust",
    desc: "Limpiador de disco para developers y usuarios de IA/ML: ve qué ocupa espacio y libéralo sin riesgos.", stars: 0, updated: "2026-10-30" },
  { name: "OpenGit", repo: "rldona/OpenGit", stage: "product", cat: "devtools", lang: "TypeScript",
    desc: "Cliente Git moderno y open source para Windows, macOS y Linux.", stars: 0, updated: "2026-11-02" },
  { name: "OpenNote", repo: "rldona/OpenNote", stage: "product", cat: "apps", lang: "TypeScript",
    desc: "Notas local-first con el flujo de trabajo de Evernote. Electron + SQLite.", stars: 0, updated: "2026-11-05" },
  { name: "OpenLibrary", repo: "rldona/OpenLibrary", stage: "product", cat: "apps", lang: "TypeScript",
    desc: "Biblioteca personal self-hosted para tus libros físicos. Web y Android.", stars: 0, updated: "2026-11-11" },
  { name: "OpenPassword", repo: "rldona/OpenPassword", stage: "product", cat: "apps", lang: "Kotlin",
    desc: "Gestor de contraseñas, tarjetas y secretos offline-first para Android, con núcleo criptográfico en Rust.", stars: 0, updated: "2026-11-06" },
  { name: "OpenFinance", repo: "rldona/OpenFinance", stage: "product", cat: "apps", lang: "Python",
    desc: "Finanzas del hogar: importa extractos, categoriza, gráficas y ahorro. Self-hosted.", stars: 0, updated: "2026-11-06" },
  { name: "Zankup", repo: "rldona/Zankup", site: "https://zankup.com", stage: "product", cat: "apps", lang: "TypeScript",
    desc: "Alternativa personal a Strava: sincroniza Garmin, guarda los FIT originales y calcula sus propias métricas.", stars: 0, updated: "2026-11-16" },

  { name: "aemet-mcp", repo: "rldona/aemet-mcp", stage: "experiment", cat: "ia", lang: "TypeScript",
    desc: "Servidor MCP para consultar los datos de AEMET desde agentes de IA.", stars: 1, updated: "2026-10-03" },
  { name: "Benchmarks OpenCode", repo: "rldona/opencode-models-benchmarks", site: "https://rldona.github.io/opencode-models-benchmarks/", stage: "experiment", cat: "ia", lang: "TypeScript",
    desc: "Benchmark de modelos de programación: nota 0-10 con suite oculta, juez y métricas de coste.", stars: 1, updated: "2026-10-27" },
  { name: "OpenDub", repo: "rldona/OpenDub", stage: "experiment", cat: "ia", lang: "Python",
    desc: "Dobla vídeos de YouTube al español con voz sintética sincronizada (whisper, Claude, edge-tts).", stars: 0, updated: "2026-10-26" },
  { name: "OpenPixel", repo: "rldona/OpenPixel", site: "https://rldona.github.io/OpenPixel/", stage: "experiment", cat: "apps", lang: "Swift",
    desc: "Editor de pixel art y animación para iPad.", stars: 0, updated: "2026-10-29" },
  { name: "OpenViewer", repo: "rldona/OpenViewer", stage: "experiment", cat: "apps", lang: "Swift",
    desc: "Visor de imágenes rápido para iPad, pensado para carpetas enormes.", stars: 0, updated: "2026-10-21" },
  { name: "Calco", repo: "rldona/Calco", site: "https://rldona.github.io/Calco/", stage: "experiment", cat: "apps", lang: "Swift",
    desc: "Sin descripción en GitHub todavía.", stars: 0, updated: "2026-10-25" },
  { name: "crontab-converter", repo: "rldona/crontab-converter", stage: "experiment", cat: "devtools", lang: "JavaScript",
    desc: "Convierte expresiones crontab a lenguaje natural y viceversa.", stars: 1, updated: "2026-09-24" },
  { name: "Plantilla plataformas", repo: "rldona/unity-platformer-template", stage: "experiment", cat: "juegos", lang: "C#",
    desc: "Plantilla Unity 6 para plataformas 2D en pixel art: controlador afinado, plataformas, checkpoints y debug.", stars: 0, updated: "2026-10-28" },
  { name: "Plantilla metroidvania", repo: "rldona/unity-metroidvania-template", stage: "experiment", cat: "juegos", lang: "C#",
    desc: "Plantilla Unity 6 para metroidvanias 2D: combate direccional, doble salto, salas y habitaciones oscuras.", stars: 0, updated: "2026-10-27" },
  { name: "Galious", repo: "rldona/Galious", site: "https://rldona.github.io/Galious/", stage: "experiment", cat: "juegos", lang: "Unity",
    desc: "Proyecto educativo: remake en Unity de un clásico de MSX.", stars: 0, updated: "2026-10-17" },
  { name: "Flapo", repo: "rldona/flapo", site: "https://rldona.github.io/flapo/", stage: "experiment", cat: "juegos", lang: "TypeScript",
    desc: "Juego de un botón en HTML, Canvas y TypeScript. Jugable en el navegador.", stars: 0, updated: "2026-10-21" },
  { name: "Ahorcade", repo: "rldona/ahorcade", site: "https://rldona.github.io/ahorcade/", stage: "experiment", cat: "juegos", lang: "JavaScript",
    desc: "Arcade de palabras en HTML, CSS y JavaScript vanilla.", stars: 0, updated: "2026-10-21" },

  { name: "Filmist", repo: "rldona/filmist-angular", site: "https://filmistsoreapp.web.app", stage: "archive", cat: "apps", lang: "TypeScript",
    desc: "Busca, sincroniza y comparte películas y series. Angular.", stars: 1, updated: "2021-06-15" },
  { name: "FilmistRN", repo: "rldona/FilmistRN", stage: "archive", cat: "apps", lang: "JavaScript",
    desc: "La versión React Native de Filmist.", stars: 1, updated: "2021-06-15" },
  { name: "puppeteer-tor", repo: "rldona/puppeteer-tor", stage: "archive", cat: "devtools", lang: "JavaScript",
    desc: "PoC: Puppeteer usando Tor como proxy.", stars: 1, updated: "2021-06-15" },
  { name: "laSexta RN", repo: "rldona/laSexta-react-native-clone", stage: "archive", cat: "apps", lang: "JavaScript",
    desc: "Ejercicio: clon de una app de TV en React Native (Expo).", stars: 1, updated: "2021-06-15" },
  { name: "sodexo-flutter", repo: "rldona/sodexo-flutter-clone", stage: "archive", cat: "apps", lang: "Dart",
    desc: "Ejercicio: clon de una app en Flutter.", stars: 1, updated: "2021-06-15" },
  { name: "Curso React Native", repo: "rldona/ReactNativeCourseBeeva", stage: "archive", cat: "devtools", lang: "Material",
    desc: "Material de un curso de React Native.", stars: 1, updated: "2021-06-15" },
];

window.LABS_CATS = { all: "Todo", devtools: "Herramientas dev", apps: "Apps", ia: "IA y agentes", juegos: "Juegos" };
window.LABS_STAGES = {
  product: { title: "Productos", note: "Mantenidos. Puedes usarlos en tu día a día." },
  experiment: { title: "Experimentos", note: "En marcha. Iteramos rápido y pueden romperse." },
  archive: { title: "Archivo", note: "Ya no los desarrollamos. Se quedan como referencia." },
};
window.LABS_LANG_COLOR = { TypeScript: "#3178c6", JavaScript: "#e8c400", Rust: "#dea584", Kotlin: "#a97bff", Python: "#3572a5", Swift: "#f05138", "C#": "#178600", Dart: "#00b4ab", Unity: "#888", Material: "#888" };

window.labsAgo = function (iso) {
  const d = Math.round((new Date("2026-11-16") - new Date(iso)) / 864e5);
  if (d <= 0) return "hoy";
  if (d === 1) return "ayer";
  if (d < 30) return `hace ${d} días`;
  if (d < 365) return `hace ${Math.round(d / 30)} meses`;
  return `hace ${Math.round(d / 365)} años`;
};

// Slug para la URL de cada ficha: labs.plazoleta.dev/<slug>
window.LABS.forEach(p => { p.slug = p.repo.split("/")[1].toLowerCase(); });
window.labsBySlug = s => window.LABS.find(p => p.slug === s);

// Detalle ampliado. En producción saldría de la API de GitHub al construir:
// licencia, releases, README (portada + funcionalidades), issues y forks.
window.LABS_DETAIL = {
  flupcode: {
    tagline: "Toda la potencia de OpenCode en una app de escritorio y web pensada para trabajar todo el día.",
    cover: "https://raw.githubusercontent.com/rldona/FlupCode/main/docs/assets/cover.png",
    license: "MIT", forks: 1, issues: 2, since: "2026-09-12",
    platforms: ["macOS", "Windows", "Linux", "Web"],
    download: "https://github.com/rldona/FlupCode/releases/latest",
    extraLinks: [["App web", "https://app.flupcode.com"]],
    features: [
      ["Motor oficial", "Ejecuta el binario oficial de OpenCode 2 en una versión fijada y verificada."],
      ["Funciones de harness", "Panel de uso, mapa de actividad, espacios con varios proyectos y sesiones fijadas."],
      ["Ejecuciones que sobreviven a la ventana", "Un servidor propio mantiene ejecuciones, tareas y rutinas aunque cierres la app."],
      ["Control remoto", "Maneja las sesiones de tu ordenador desde el móvil, en cualquier red."],
      ["Actualizado cada semana", "Un PR semanal sube la versión de OpenCode a la última release."],
      ["Paridad con la TUI", "Todo lo que hace la terminal de OpenCode, también en la interfaz web."],
    ],
    releases: [
      { tag: "v4.3.1", date: "2026-11-15", dl: 36, note: "El panel de sesión se dibuja al instante al abrir una sesión." },
      { tag: "v4.3.0", date: "2026-11-15", dl: 30, note: "Nuevo panel lateral de sesión hecho de módulos, con vista corta y completa." },
      { tag: "v4.2.1", date: "2026-11-05", dl: 78, note: "Iconos de escritorio correctos en Linux." },
      { tag: "v4.2.0", date: "2026-11-01", dl: 45, note: "Lista de tareas que se puede vaciar desde el panel de detalles." },
    ],
  },
  opengit: {
    tagline: "Un grafo que se lee, staging por fragmentos y Git sin pasar por la terminal.",
    cover: "https://raw.githubusercontent.com/rldona/OpenGit/main/assets/cover.png",
    license: "MIT", forks: 0, issues: 0, since: "2026-09-18", releases_total: 18, downloads: 124, lastRelease: "v0.8.6",
    platforms: ["Windows", "macOS", "Linux"], stack: "Tauri 2",
    download: "https://github.com/rldona/OpenGit/releases/latest",
    note: "Los instaladores no están firmados: la primera vez el sistema te pedirá confirmación.",
    features: [
      ["Grafo de commits en canvas", "Carga incremental y fluido en repos con decenas de miles de commits."],
      ["Staging por fragmento, línea o selección", "Y descartar cambios sin salir de la app."],
      ["Diff de imágenes", "Antes/después sobre fondo de transparencia para PNG, JPEG, GIF y WebP."],
      ["Barra lateral completa", "Ramas, remotos, tags, stashes, submódulos y worktrees."],
      ["Operaciones de historial", "Merge, cherry-pick, revert, reset y rebase interactivo con vista previa."],
      ["Editor de conflictos por bloques", "Con un aviso de operación en curso: abortar, saltar o continuar."],
    ],
    releases: [
      { tag: "v0.8.6", date: "2026-10-01", dl: 46, note: "Borrar una rama usada en otro worktree explica por qué no se puede y ofrece arreglarlo." },
      { tag: "v0.8.5", date: "2026-09-24", dl: 9, note: "Nueva paleta de colores Code." },
      { tag: "v0.8.4", date: "2026-09-23", dl: 3, note: "Mejoras de tema." },
      { tag: "v0.8.2", date: "2026-09-22", dl: 4, note: "Renombrar pestañas de repositorio directamente." },
    ],
  },
};
