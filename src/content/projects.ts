/**
 * El catálogo de Labs.
 *
 * Esto es lo único que se escribe a mano: qué repos salen, en qué etapa están,
 * en qué categoría y cómo se cuentan en español y en inglés. Todo lo demás
 * —estrellas, releases, descargas, actividad, licencia, README y portada— se lee
 * de GitHub al construir la web (ver `lib/github.ts`) y se refresca solo cada hora.
 *
 * Los textos van como `{ es, en }`: el tipo obliga a escribir los dos, así que
 * un proyecto nuevo sin traducir no compila. Los nombres propios (FlupCode,
 * OpenGit…) son un `string` sin más; solo se traduce el nombre cuando es una
 * descripción ("Plantilla plataformas").
 *
 * Para añadir un proyecto basta con una entrada nueva aquí. Para migrar repos a
 * la organización de GitHub, cambia `repo` ("rldona/X" → "plazoleta-dev/X"): GitHub
 * redirige las URLs antiguas, pero la API conviene apuntarla al sitio nuevo.
 */

import type { Lang } from "@/lib/i18n";

/** Un texto en los dos idiomas. */
export type L = Record<Lang, string>;

/**
 * Solo dos etapas. Lo que ya no se desarrolla no sale en Labs: se quita del
 * catálogo y su ficha pasa a dar 404.
 */
export type Stage = "product" | "experiment";
export type Category = "devtools" | "apps" | "ia" | "juegos";

/** Forma de una entrada del catálogo, con los textos en los dos idiomas. */
type Entry = {
  /** URL en Labs: labs.plazoleta.dev/<slug> y /en/<slug>. No lo cambies una vez publicado. */
  slug: string;
  /** owner/name en GitHub. */
  repo: string;
  name: string | L;
  stage: Stage;
  category: Category;
  /** Una línea. Sustituye a la descripción de GitHub. */
  description: L;
  /** Frase de cabecera de la ficha. Si falta, se usa `description`. */
  tagline?: L;
  /** Lenguaje a mostrar si el que detecta GitHub no es representativo. */
  language?: string;
  stack?: string;
  platforms?: string[];
  /** Web propia. Si falta, se usa la `homepage` del repo. */
  site?: string;
  links?: { label: L; url: string }[];
  /** Funcionalidades destacadas. Sin ellas, la ficha no muestra la sección. */
  features?: { title: L; body: L }[];
  /** Aviso que acompaña a las descargas. */
  downloadNote?: L;
  /** Proyecto destacado en la portada. Solo uno. */
  featured?: boolean;
  /** Se puede jugar en el navegador (en `site`). */
  playable?: { pitch: L };
};

/** Una entrada ya resuelta a un idioma: es lo que consumen las páginas. */
export type Project = Omit<Entry, "name" | "description" | "tagline" | "links" | "features" | "downloadNote" | "playable"> & {
  name: string;
  description: string;
  tagline?: string;
  links?: { label: string; url: string }[];
  features?: { title: string; body: string }[];
  downloadNote?: string;
  playable?: { pitch: string };
};

const STAGE_TEXT: Record<Stage, { title: L; label: L; note: L }> = {
  product: {
    title: { es: "Productos", en: "Products" },
    label: { es: "Producto", en: "Product" },
    note: { es: "Mantenidos. Puedes usarlos en tu día a día.", en: "Maintained. You can use them every day." },
  },
  experiment: {
    title: { es: "Experimentos", en: "Experiments" },
    label: { es: "Experimento", en: "Experiment" },
    note: { es: "En marcha. Iteramos rápido y pueden romperse.", en: "In progress. We iterate fast and things may break." },
  },
};

const CATEGORY_TEXT: Record<Category, { title: L; note: L }> = {
  devtools: {
    title: { es: "Herramientas dev", en: "Dev tools" },
    note: { es: "Para trabajar mejor con el ordenador y el código.", en: "For working better with your computer and your code." },
  },
  apps: {
    title: { es: "Apps", en: "Apps" },
    note: { es: "Local-first, self-hosted y sin suscripción.", en: "Local-first, self-hosted and subscription-free." },
  },
  ia: {
    title: { es: "IA y agentes", en: "AI and agents" },
    note: { es: "MCPs, benchmarks y agentes.", en: "MCPs, benchmarks and agents." },
  },
  juegos: {
    title: { es: "Juegos", en: "Games" },
    note: { es: "Juegos y plantillas de Unity para empezar el tuyo.", en: "Games, plus Unity templates to start your own." },
  },
};

export function getStages(lang: Lang) {
  const out = {} as Record<Stage, { title: string; label: string; note: string }>;
  for (const [k, v] of Object.entries(STAGE_TEXT) as [Stage, (typeof STAGE_TEXT)[Stage]][])
    out[k] = { title: v.title[lang], label: v.label[lang], note: v.note[lang] };
  return out;
}

export function getCategories(lang: Lang) {
  const out = {} as Record<Category, { title: string; note: string }>;
  for (const [k, v] of Object.entries(CATEGORY_TEXT) as [Category, (typeof CATEGORY_TEXT)[Category]][])
    out[k] = { title: v.title[lang], note: v.note[lang] };
  return out;
}

export const CATEGORY_KEYS = Object.keys(CATEGORY_TEXT) as Category[];
export const STAGE_KEYS = Object.keys(STAGE_TEXT) as Stage[];

const ENTRIES: Entry[] = [
  // ── Productos ────────────────────────────────────────────────────────────
  {
    slug: "flupcode",
    repo: "plazoleta-dev/FlupCode",
    name: "FlupCode",
    stage: "product",
    category: "devtools",
    featured: true,
    description: {
      es: "Harness web y de escritorio al estilo Claude Code para OpenCode.",
      en: "A Claude Code-style web and desktop harness for OpenCode.",
    },
    tagline: {
      es: "Toda la potencia de OpenCode en una app de escritorio y web pensada para trabajar todo el día.",
      en: "All the power of OpenCode in a desktop and web app built for working with all day long.",
    },
    platforms: ["macOS", "Windows", "Linux", "Web"],
    site: "https://flupcode.com",
    links: [{ label: { es: "App web", en: "Web app" }, url: "https://app.flupcode.com" }],
    features: [
      {
        title: { es: "Motor oficial", en: "Official engine" },
        body: {
          es: "Ejecuta el binario oficial de OpenCode 2 en una versión fijada y verificada.",
          en: "Runs the official OpenCode 2 binary, pinned to a verified version.",
        },
      },
      {
        title: { es: "Funciones de harness", en: "Harness features" },
        body: {
          es: "Panel de uso, mapa de actividad, espacios con varios proyectos y sesiones fijadas.",
          en: "Usage dashboard, activity map, multi-project workspaces and pinned sessions.",
        },
      },
      {
        title: { es: "Ejecuciones que sobreviven a la ventana", en: "Runs that outlive the window" },
        body: {
          es: "Un servidor propio mantiene ejecuciones, tareas y rutinas aunque cierres la app.",
          en: "Its own server keeps runs, tasks and routines going even after you close the app.",
        },
      },
      {
        title: { es: "Control remoto", en: "Remote control" },
        body: {
          es: "Maneja las sesiones de tu ordenador desde el móvil, en cualquier red.",
          en: "Drive your computer's sessions from your phone, on any network.",
        },
      },
      {
        title: { es: "Al día con OpenCode", en: "Up to date with OpenCode" },
        body: {
          es: "Un PR semanal sube la versión de OpenCode a la última release.",
          en: "A weekly PR bumps OpenCode to its latest release.",
        },
      },
      {
        title: { es: "Paridad con la terminal", en: "Parity with the terminal" },
        body: {
          es: "Todo lo que hace la TUI de OpenCode, también en la interfaz web.",
          en: "Everything the OpenCode TUI does, in the web interface too.",
        },
      },
    ],
  },
  {
    slug: "opendisk",
    repo: "rldona/OpenDisk",
    name: "OpenDisk",
    stage: "product",
    category: "devtools",
    description: {
      es: "Limpiador de disco para developers y usuarios de IA/ML: ve qué ocupa espacio y libéralo sin riesgos.",
      en: "A disk cleaner for developers and AI/ML users: see what's taking up space and free it safely.",
    },
    stack: "Tauri",
  },
  {
    slug: "opengit",
    repo: "rldona/OpenGit",
    name: "OpenGit",
    stage: "product",
    category: "devtools",
    description: {
      es: "Cliente Git moderno y open source para Windows, macOS y Linux.",
      en: "A modern, open source Git client for Windows, macOS and Linux.",
    },
    tagline: {
      es: "Un grafo que se lee, staging por fragmentos y Git sin pasar por la terminal.",
      en: "A graph you can actually read, hunk-level staging and Git without the terminal.",
    },
    stack: "Tauri 2",
    platforms: ["Windows", "macOS", "Linux"],
    downloadNote: {
      es: "Los instaladores no están firmados: la primera vez el sistema te pedirá confirmación.",
      en: "The installers aren't signed: the first time, your system will ask you to confirm.",
    },
    features: [
      {
        title: { es: "Grafo de commits en canvas", en: "Canvas commit graph" },
        body: {
          es: "Carga incremental y fluido en repos con decenas de miles de commits.",
          en: "Loads incrementally and stays smooth in repos with tens of thousands of commits.",
        },
      },
      {
        title: { es: "Staging por fragmento, línea o selección", en: "Stage by hunk, line or selection" },
        body: { es: "Y descartar cambios sin salir de la app.", en: "And discard changes without leaving the app." },
      },
      {
        title: { es: "Diff de imágenes", en: "Image diffs" },
        body: {
          es: "Antes y después sobre fondo de transparencia para PNG, JPEG, GIF y WebP.",
          en: "Before and after on a transparency grid for PNG, JPEG, GIF and WebP.",
        },
      },
      {
        title: { es: "Barra lateral completa", en: "Complete sidebar" },
        body: {
          es: "Ramas, remotos, tags, stashes, submódulos y worktrees.",
          en: "Branches, remotes, tags, stashes, submodules and worktrees.",
        },
      },
      {
        title: { es: "Operaciones de historial", en: "History operations" },
        body: {
          es: "Merge, cherry-pick, revert, reset y rebase interactivo con vista previa.",
          en: "Merge, cherry-pick, revert, reset and interactive rebase with a preview.",
        },
      },
      {
        title: { es: "Editor de conflictos por bloques", en: "Block-based conflict editor" },
        body: {
          es: "Con un aviso de operación en curso: abortar, saltar o continuar.",
          en: "With an in-progress operation banner: abort, skip or continue.",
        },
      },
    ],
  },
  {
    slug: "opennote",
    repo: "rldona/OpenNote",
    name: "OpenNote",
    stage: "product",
    category: "apps",
    description: {
      es: "Notas local-first con el flujo de trabajo de Evernote. Electron y SQLite.",
      en: "Local-first notes with an Evernote-style workflow. Electron and SQLite.",
    },
  },
  {
    slug: "openlibrary",
    repo: "rldona/OpenLibrary",
    name: "OpenLibrary",
    stage: "product",
    category: "apps",
    description: {
      es: "Biblioteca personal self-hosted para tus libros físicos. Web y Android.",
      en: "A self-hosted personal library for your physical books. Web and Android.",
    },
  },
  {
    slug: "openpassword",
    repo: "plazoleta-dev/OpenPassword",
    name: "OpenPassword",
    stage: "product",
    category: "apps",
    description: {
      es: "Gestor de contraseñas, tarjetas y secretos offline-first para Android, con núcleo criptográfico en Rust.",
      en: "An offline-first password, card and secrets manager for Android, with a cryptographic core in Rust.",
    },
  },
  {
    slug: "openfinance",
    repo: "plazoleta-dev/OpenFinance",
    name: "OpenFinance",
    stage: "product",
    category: "apps",
    description: {
      es: "Finanzas del hogar: importa extractos, categoriza, gráficas y ahorro. Self-hosted.",
      en: "Household finances: import statements, categorise, charts and savings. Self-hosted.",
    },
  },
  {
    slug: "zankup",
    repo: "rldona/Zankup",
    name: "Zankup",
    stage: "product",
    category: "apps",
    description: {
      es: "Alternativa personal a Strava: sincroniza Garmin, guarda los FIT originales y calcula sus propias métricas.",
      en: "A personal alternative to Strava: syncs Garmin, keeps the original FIT files and computes its own metrics.",
    },
  },
  {
    slug: "openpixel",
    repo: "rldona/OpenPixel",
    name: "OpenPixel",
    stage: "product",
    category: "apps",
    description: { es: "Editor de pixel art y animación para iPad.", en: "A pixel art and animation editor for iPad." },
    platforms: ["iPad"],
  },
  {
    slug: "openviewer",
    repo: "plazoleta-dev/OpenViewer",
    name: "OpenViewer",
    stage: "product",
    category: "apps",
    description: {
      es: "Visor de imágenes rápido para iPad, pensado para carpetas enormes con subcarpetas.",
      en: "A fast image viewer for iPad, built for huge folders full of subfolders.",
    },
    platforms: ["iPad"],
  },
  {
    slug: "calco",
    repo: "rldona/Calco",
    name: "Calco",
    stage: "product",
    category: "apps",
    description: {
      es: "Animación de sprites dibujados a mano para iPad y Apple Pencil, con exportación lista para Unity.",
      en: "Hand-drawn sprite animation for iPad and Apple Pencil, with Unity-ready export.",
    },
    tagline: {
      es: "Dibuja fotograma a fotograma en el iPad y exporta sprite sheets que entran directos en Unity.",
      en: "Draw frame by frame on your iPad and export sprite sheets that drop straight into Unity.",
    },
    platforms: ["iPad"],
  },

  // ── Experimentos ─────────────────────────────────────────────────────────
  {
    slug: "aemet-mcp",
    repo: "rldona/aemet-mcp",
    name: "aemet-mcp",
    stage: "experiment",
    category: "ia",
    description: {
      es: "Servidor MCP para consultar los datos de AEMET desde agentes de IA.",
      en: "An MCP server for querying AEMET (Spain's weather agency) data from AI agents.",
    },
  },
  {
    slug: "opencode-models-benchmarks",
    repo: "rldona/opencode-models-benchmarks",
    name: { es: "Benchmarks OpenCode", en: "OpenCode benchmarks" },
    stage: "experiment",
    category: "ia",
    description: {
      es: "Benchmark de modelos de programación: nota de 0 a 10 con suite oculta, juez y métricas de coste.",
      en: "A benchmark for coding models: a 0–10 score with a hidden suite, a judge and cost metrics.",
    },
  },
  {
    slug: "opendub",
    repo: "plazoleta-dev/OpenDub",
    name: "OpenDub",
    stage: "experiment",
    category: "ia",
    description: {
      es: "Dobla vídeos de YouTube al español con voz sintética sincronizada (whisper, Claude, edge-tts).",
      en: "Dubs YouTube videos into Spanish with synchronised synthetic voice (whisper, Claude, edge-tts).",
    },
  },
  {
    slug: "crontab-converter",
    repo: "rldona/crontab-converter",
    name: "crontab-converter",
    stage: "experiment",
    category: "devtools",
    description: {
      es: "Convierte expresiones crontab a lenguaje natural y viceversa.",
      en: "Converts crontab expressions to natural language and back.",
    },
  },
  {
    slug: "unity-platformer-template",
    repo: "plazoleta-dev/unity-platformer-template",
    name: { es: "Plantilla plataformas", en: "Platformer template" },
    stage: "experiment",
    category: "juegos",
    description: {
      es: "Plantilla Unity 6 para plataformas 2D en pixel art: controlador afinado, plataformas, checkpoints y debug.",
      en: "A Unity 6 template for 2D pixel art platformers: a tuned controller, platforms, checkpoints and debug tools.",
    },
    stack: "Unity 6",
  },
  {
    slug: "unity-metroidvania-template",
    repo: "plazoleta-dev/unity-metroidvania-template",
    name: { es: "Plantilla metroidvania", en: "Metroidvania template" },
    stage: "experiment",
    category: "juegos",
    description: {
      es: "Plantilla Unity 6 para metroidvanias 2D: combate direccional, doble salto, salas y habitaciones oscuras.",
      en: "A Unity 6 template for 2D metroidvanias: directional combat, double jump, rooms and dark areas.",
    },
    stack: "Unity 6",
  },
  {
    slug: "galious",
    repo: "rldona/Galious",
    name: "Galious",
    stage: "experiment",
    category: "juegos",
    description: {
      es: "Proyecto educativo: remake en Unity de un clásico de MSX.",
      en: "An educational project: a Unity remake of an MSX classic.",
    },
    language: "C#",
    stack: "Unity",
  },
  {
    slug: "flapo",
    repo: "rldona/flapo",
    name: "Flapo",
    stage: "experiment",
    category: "juegos",
    description: {
      es: "Juego de un botón en HTML, Canvas y TypeScript. Jugable en el navegador.",
      en: "A one-button game in HTML, Canvas and TypeScript. Playable in the browser.",
    },
    language: "TypeScript",
    playable: {
      pitch: { es: "Un botón, un pájaro con sobrepeso y Canvas 2D.", en: "One button, one overweight bird and Canvas 2D." },
    },
  },
  {
    slug: "ahorcade",
    repo: "rldona/ahorcade",
    name: "Ahorcade",
    stage: "experiment",
    category: "juegos",
    description: {
      es: "Arcade de palabras en HTML, CSS y JavaScript sin dependencias.",
      en: "A word arcade game in HTML, CSS and dependency-free JavaScript.",
    },
    playable: {
      pitch: { es: "El ahorcado, pero arcade. JavaScript sin dependencias.", en: "Hangman, but arcade. Dependency-free JavaScript." },
    },
  },
];

function localize(e: Entry, lang: Lang): Project {
  return {
    ...e,
    name: typeof e.name === "string" ? e.name : e.name[lang],
    description: e.description[lang],
    tagline: e.tagline?.[lang],
    links: e.links?.map((l) => ({ label: l.label[lang], url: l.url })),
    features: e.features?.map((f) => ({ title: f.title[lang], body: f.body[lang] })),
    downloadNote: e.downloadNote?.[lang],
    playable: e.playable && { pitch: e.playable.pitch[lang] },
  };
}

/** Slugs del catálogo, comunes a los dos idiomas. */
export const SLUGS = ENTRIES.map((e) => e.slug);

export const getProjects = (lang: Lang) => ENTRIES.map((e) => localize(e, lang));

export function getProjectBySlug(slug: string, lang: Lang) {
  const e = ENTRIES.find((x) => x.slug === slug);
  return e ? localize(e, lang) : undefined;
}
