/**
 * El catálogo de Labs.
 *
 * Esto es lo único que se escribe a mano: qué repos salen, en qué etapa están,
 * en qué categoría y cómo se cuentan en español. Todo lo demás —estrellas,
 * releases, descargas, actividad, licencia, README y portada— se lee de GitHub
 * al construir la web (ver `lib/github.ts`) y se refresca solo cada hora.
 *
 * Para añadir un proyecto basta con una entrada nueva aquí. Para migrar repos a
 * la organización de GitHub, cambia `repo` ("rldona/X" → "plazoleta-dev/X"): GitHub
 * redirige las URLs antiguas, pero la API conviene apuntarla al sitio nuevo.
 */

/**
 * Solo dos etapas. Lo que ya no se desarrolla no sale en Labs: se quita del
 * catálogo y su ficha pasa a dar 404.
 */
export type Stage = "product" | "experiment";
export type Category = "devtools" | "apps" | "ia" | "juegos";

export type Project = {
  /** URL en Labs: labs.plazoleta.dev/<slug>. No lo cambies una vez publicado. */
  slug: string;
  /** owner/name en GitHub. */
  repo: string;
  name: string;
  stage: Stage;
  category: Category;
  /** Una línea, en español. Sustituye a la descripción (en inglés) de GitHub. */
  description: string;
  /** Frase de cabecera de la ficha. Si falta, se usa `description`. */
  tagline?: string;
  /** Lenguaje a mostrar si el que detecta GitHub no es representativo. */
  language?: string;
  stack?: string;
  platforms?: string[];
  /** Web propia. Si falta, se usa la `homepage` del repo. */
  site?: string;
  links?: { label: string; url: string }[];
  /** Funcionalidades destacadas, en español. Sin ellas, la ficha no muestra la sección. */
  features?: { title: string; body: string }[];
  /** Aviso que acompaña a las descargas. */
  downloadNote?: string;
  /** Proyecto destacado en la portada. Solo uno. */
  featured?: boolean;
  /** Se puede jugar en el navegador (en `site`). */
  playable?: { pitch: string };
};

export const STAGES: Record<Stage, { title: string; label: string; note: string }> = {
  product: { title: "Productos", label: "Producto", note: "Mantenidos. Puedes usarlos en tu día a día." },
  experiment: { title: "Experimentos", label: "Experimento", note: "En marcha. Iteramos rápido y pueden romperse." },
};

export const CATEGORIES: Record<Category, { title: string; note: string }> = {
  devtools: { title: "Herramientas dev", note: "Para trabajar mejor con el ordenador y el código." },
  apps: { title: "Apps", note: "Local-first, self-hosted y sin suscripción." },
  ia: { title: "IA y agentes", note: "MCPs, benchmarks y agentes." },
  juegos: { title: "Juegos", note: "Juegos y plantillas de Unity para empezar el tuyo." },
};

export const PROJECTS: Project[] = [
  // ── Productos ────────────────────────────────────────────────────────────
  {
    slug: "flupcode",
    repo: "plazoleta-dev/FlupCode",
    name: "FlupCode",
    stage: "product",
    category: "devtools",
    featured: true,
    description: "Harness web y de escritorio al estilo Claude Code para OpenCode.",
    tagline: "Toda la potencia de OpenCode en una app de escritorio y web pensada para trabajar todo el día.",
    platforms: ["macOS", "Windows", "Linux", "Web"],
    site: "https://flupcode.com",
    links: [{ label: "App web", url: "https://app.flupcode.com" }],
    features: [
      { title: "Motor oficial", body: "Ejecuta el binario oficial de OpenCode 2 en una versión fijada y verificada." },
      { title: "Funciones de harness", body: "Panel de uso, mapa de actividad, espacios con varios proyectos y sesiones fijadas." },
      { title: "Ejecuciones que sobreviven a la ventana", body: "Un servidor propio mantiene ejecuciones, tareas y rutinas aunque cierres la app." },
      { title: "Control remoto", body: "Maneja las sesiones de tu ordenador desde el móvil, en cualquier red." },
      { title: "Al día con OpenCode", body: "Un PR semanal sube la versión de OpenCode a la última release." },
      { title: "Paridad con la terminal", body: "Todo lo que hace la TUI de OpenCode, también en la interfaz web." },
    ],
  },
  {
    slug: "opendisk",
    repo: "rldona/OpenDisk",
    name: "OpenDisk",
    stage: "product",
    category: "devtools",
    description: "Limpiador de disco para developers y usuarios de IA/ML: ve qué ocupa espacio y libéralo sin riesgos.",
    stack: "Tauri",
  },
  {
    slug: "opengit",
    repo: "rldona/OpenGit",
    name: "OpenGit",
    stage: "product",
    category: "devtools",
    description: "Cliente Git moderno y open source para Windows, macOS y Linux.",
    tagline: "Un grafo que se lee, staging por fragmentos y Git sin pasar por la terminal.",
    stack: "Tauri 2",
    platforms: ["Windows", "macOS", "Linux"],
    downloadNote: "Los instaladores no están firmados: la primera vez el sistema te pedirá confirmación.",
    features: [
      { title: "Grafo de commits en canvas", body: "Carga incremental y fluido en repos con decenas de miles de commits." },
      { title: "Staging por fragmento, línea o selección", body: "Y descartar cambios sin salir de la app." },
      { title: "Diff de imágenes", body: "Antes y después sobre fondo de transparencia para PNG, JPEG, GIF y WebP." },
      { title: "Barra lateral completa", body: "Ramas, remotos, tags, stashes, submódulos y worktrees." },
      { title: "Operaciones de historial", body: "Merge, cherry-pick, revert, reset y rebase interactivo con vista previa." },
      { title: "Editor de conflictos por bloques", body: "Con un aviso de operación en curso: abortar, saltar o continuar." },
    ],
  },
  {
    slug: "opennote",
    repo: "rldona/OpenNote",
    name: "OpenNote",
    stage: "product",
    category: "apps",
    description: "Notas local-first con el flujo de trabajo de Evernote. Electron y SQLite.",
  },
  {
    slug: "openlibrary",
    repo: "rldona/OpenLibrary",
    name: "OpenLibrary",
    stage: "product",
    category: "apps",
    description: "Biblioteca personal self-hosted para tus libros físicos. Web y Android.",
  },
  {
    slug: "openpassword",
    repo: "plazoleta-dev/OpenPassword",
    name: "OpenPassword",
    stage: "product",
    category: "apps",
    description: "Gestor de contraseñas, tarjetas y secretos offline-first para Android, con núcleo criptográfico en Rust.",
  },
  {
    slug: "openfinance",
    repo: "plazoleta-dev/OpenFinance",
    name: "OpenFinance",
    stage: "product",
    category: "apps",
    description: "Finanzas del hogar: importa extractos, categoriza, gráficas y ahorro. Self-hosted.",
  },
  {
    slug: "zankup",
    repo: "rldona/Zankup",
    name: "Zankup",
    stage: "product",
    category: "apps",
    description: "Alternativa personal a Strava: sincroniza Garmin, guarda los FIT originales y calcula sus propias métricas.",
  },
  {
    slug: "openpixel",
    repo: "rldona/OpenPixel",
    name: "OpenPixel",
    stage: "product",
    category: "apps",
    description: "Editor de pixel art y animación para iPad.",
    platforms: ["iPad"],
  },
  {
    slug: "openviewer",
    repo: "plazoleta-dev/OpenViewer",
    name: "OpenViewer",
    stage: "product",
    category: "apps",
    description: "Visor de imágenes rápido para iPad, pensado para carpetas enormes con subcarpetas.",
    platforms: ["iPad"],
  },
  {
    slug: "calco",
    repo: "rldona/Calco",
    name: "Calco",
    stage: "product",
    category: "apps",
    description: "Animación de sprites dibujados a mano para iPad y Apple Pencil, con exportación lista para Unity.",
    tagline: "Dibuja fotograma a fotograma en el iPad y exporta sprite sheets que entran directos en Unity.",
    platforms: ["iPad"],
  },

  // ── Experimentos ─────────────────────────────────────────────────────────
  {
    slug: "aemet-mcp",
    repo: "rldona/aemet-mcp",
    name: "aemet-mcp",
    stage: "experiment",
    category: "ia",
    description: "Servidor MCP para consultar los datos de AEMET desde agentes de IA.",
  },
  {
    slug: "opencode-models-benchmarks",
    repo: "rldona/opencode-models-benchmarks",
    name: "Benchmarks OpenCode",
    stage: "experiment",
    category: "ia",
    description: "Benchmark de modelos de programación: nota de 0 a 10 con suite oculta, juez y métricas de coste.",
  },
  {
    slug: "opendub",
    repo: "plazoleta-dev/OpenDub",
    name: "OpenDub",
    stage: "experiment",
    category: "ia",
    description: "Dobla vídeos de YouTube al español con voz sintética sincronizada (whisper, Claude, edge-tts).",
  },
  {
    slug: "crontab-converter",
    repo: "rldona/crontab-converter",
    name: "crontab-converter",
    stage: "experiment",
    category: "devtools",
    description: "Convierte expresiones crontab a lenguaje natural y viceversa.",
  },
  {
    slug: "unity-platformer-template",
    repo: "plazoleta-dev/unity-platformer-template",
    name: "Plantilla plataformas",
    stage: "experiment",
    category: "juegos",
    description: "Plantilla Unity 6 para plataformas 2D en pixel art: controlador afinado, plataformas, checkpoints y debug.",
    stack: "Unity 6",
  },
  {
    slug: "unity-metroidvania-template",
    repo: "plazoleta-dev/unity-metroidvania-template",
    name: "Plantilla metroidvania",
    stage: "experiment",
    category: "juegos",
    description: "Plantilla Unity 6 para metroidvanias 2D: combate direccional, doble salto, salas y habitaciones oscuras.",
    stack: "Unity 6",
  },
  {
    slug: "galious",
    repo: "rldona/Galious",
    name: "Galious",
    stage: "experiment",
    category: "juegos",
    description: "Proyecto educativo: remake en Unity de un clásico de MSX.",
    language: "C#",
    stack: "Unity",
  },
  {
    slug: "flapo",
    repo: "rldona/flapo",
    name: "Flapo",
    stage: "experiment",
    category: "juegos",
    description: "Juego de un botón en HTML, Canvas y TypeScript. Jugable en el navegador.",
    language: "TypeScript",
    playable: { pitch: "Un botón, un pájaro con sobrepeso y Canvas 2D." },
  },
  {
    slug: "ahorcade",
    repo: "rldona/ahorcade",
    name: "Ahorcade",
    stage: "experiment",
    category: "juegos",
    description: "Arcade de palabras en HTML, CSS y JavaScript sin dependencias.",
    playable: { pitch: "El ahorcado, pero arcade. JavaScript sin dependencias." },
  },
];

export const getProjectBySlug = (slug: string) => PROJECTS.find((p) => p.slug === slug);
