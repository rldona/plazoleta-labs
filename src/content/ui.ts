/**
 * Textos de interfaz de Labs, por idioma.
 *
 * El español es la referencia: el inglés se tipa con `typeof es`, así que si se
 * añade un texto al español y se olvida el inglés, el build falla en lugar de
 * publicar media página sin traducir. Igual que en plazoleta.dev.
 */

import type { Lang } from "@/lib/i18n";

const es = {
  meta: {
    title: "Plazoleta Labs: proyectos open source de Plazoleta",
    description:
      "Herramientas, apps y experimentos open source de Plazoleta, estudio de ingeniería de software en Madrid. Los publicamos pronto y mantenemos los que resultan útiles.",
  },
  skip: "Saltar al contenido",
  header: {
    home: "Plazoleta Labs, inicio",
    nav: "Principal",
    projects: "Proyectos",
    darkMode: "Modo oscuro",
    switchTo: "Read in English",
  },
  footer: {
    featured: "Destacados",
    all: "Todos los proyectos",
    contribute: "Participa",
    studio: "El estudio",
    services: "Servicios",
    work: "Trabajo",
    method: "Método",
    contact: "Contacto",
    location: "Madrid, España",
    rights: "Todos los derechos reservados.",
    legal: "Aviso legal",
    privacy: "Privacidad",
    signature: "Experimentamos en abierto.",
  },
  home: {
    /** `mark` va con el subrayado de acento, como «contigo» en el titular de plazoleta.dev. */
    h1: { before: "Un ", mark: "laboratorio", after: " donde probamos ideas antes de que sean productos." },
    intro:
      "Herramientas, apps y experimentos open source que salen del estudio. Algunos acaban siendo cosas que usamos cada día. Otros se quedan en el camino. Todos están en GitHub.",
    products: "productos mantenidos",
    experiments: "experimentos en marcha",
    repos: "repos open source",
    featuredAria: "Destacados",
    featured: "Proyecto destacado",
    releases: "releases",
    downloads: "descargas",
    latestVersion: "última versión",
    viewProject: "Ver proyecto",
    commitsChart: "Commits por semana en las últimas 20 semanas",
    now: "● Ahora en el laboratorio",
    play: "Juega en el navegador",
    playCta: "▶ JUGAR",
    contributeTitle: "¿Usas alguno? ¿Quieres contribuir?",
    contributeBody:
      "Abre un issue, manda un PR o cuéntanos qué echas en falta. Y si necesitas algo así para tu empresa, eso es lo que hacemos en Plazoleta.",
    viewGithub: "Ver en GitHub ↗",
  },
  tabs: {
    all: "Todos los proyectos",
    stage: "Etapa",
  },
  project: {
    notFound: "Proyecto no encontrado",
    crumbs: "Migas",
    download: "↓ Descargar",
    play: "▶ Jugar",
    web: "Web",
    screenshot: (name: string) => `Captura de ${name}`,
    whatItDoes: "Qué hace",
    latestReleases: "Últimas versiones",
    seeAll: (n: number) => `Ver las ${n} →`,
    latest: "Última",
    downloads: "descargas",
    releases: "releases",
    lastActivity: "última actividad",
    openIssues: "issues abiertas",
    stars: "estrellas",
    moreInfo: "Más información",
    openGithub: "Abrir en GitHub →",
    readFull: "Leer el README completo",
    noReadme: "Este repositorio todavía no tiene README. Puedes ver el código directamente en GitHub.",
    commitsPerWeek: "commits / semana",
    weeks: "20 sem.",
    sheet: "Ficha",
    repository: "Repositorio",
    license: "Licencia",
    language: "Lenguaje",
    since: "Desde",
    updated: "Actualizado",
    contribute: "Participa",
    contributeBody: "¿Algo no funciona o echas algo en falta? Es open source: abre un issue o manda un PR.",
    openIssue: "Abrir issue",
    fork: "Hacer fork",
    moreIn: (category: string) => `Más en ${category}`,
    playHere: "Jugar aquí",
    playHint: "Se carga al pulsar. También puedes abrirlo a pantalla completa con «Jugar».",
  },
  notFound: {
    title: "Página no encontrada",
    h1: "Este experimento no existe (o ya no).",
    body: "Puede que el proyecto haya cambiado de nombre o que lo hayamos retirado. Todo lo que mantenemos está en la portada de Labs.",
    back: "Volver a Labs",
  },
};

export type Ui = typeof es;

const en: Ui = {
  meta: {
    title: "Plazoleta Labs: open source projects by Plazoleta",
    description:
      "Open source tools, apps and experiments by Plazoleta, a software engineering studio in Madrid. We publish them early and keep maintaining the ones that prove useful.",
  },
  skip: "Skip to content",
  header: {
    home: "Plazoleta Labs, home",
    nav: "Main",
    projects: "Projects",
    darkMode: "Dark mode",
    switchTo: "Leer en español",
  },
  footer: {
    featured: "Featured",
    all: "All projects",
    contribute: "Get involved",
    studio: "The studio",
    services: "Services",
    work: "Work",
    method: "Method",
    contact: "Contact",
    location: "Madrid, Spain",
    rights: "All rights reserved.",
    legal: "Legal notice",
    privacy: "Privacy",
    signature: "We experiment in the open.",
  },
  home: {
    h1: { before: "A ", mark: "lab", after: " where we try out ideas before they become products." },
    intro:
      "Open source tools, apps and experiments that come out of the studio. Some end up being things we use every day. Others fall by the wayside. All of them are on GitHub.",
    products: "maintained products",
    experiments: "ongoing experiments",
    repos: "open source repos",
    featuredAria: "Featured",
    featured: "Featured project",
    releases: "releases",
    downloads: "downloads",
    latestVersion: "latest version",
    viewProject: "View project",
    commitsChart: "Commits per week over the last 20 weeks",
    now: "● Now in the lab",
    play: "Play in your browser",
    playCta: "▶ PLAY",
    contributeTitle: "Using one of them? Want to contribute?",
    contributeBody:
      "Open an issue, send a PR or tell us what you're missing. And if you need something like this for your company, that's what we do at Plazoleta.",
    viewGithub: "View on GitHub ↗",
  },
  tabs: {
    all: "All projects",
    stage: "Stage",
  },
  project: {
    notFound: "Project not found",
    crumbs: "Breadcrumbs",
    download: "↓ Download",
    play: "▶ Play",
    web: "Website",
    screenshot: (name) => `Screenshot of ${name}`,
    whatItDoes: "What it does",
    latestReleases: "Latest releases",
    seeAll: (n) => `See all ${n} →`,
    latest: "Latest",
    downloads: "downloads",
    releases: "releases",
    lastActivity: "last activity",
    openIssues: "open issues",
    stars: "stars",
    moreInfo: "More information",
    openGithub: "Open on GitHub →",
    readFull: "Read the full README",
    noReadme: "This repository has no README yet. You can browse the code directly on GitHub.",
    commitsPerWeek: "commits / week",
    weeks: "20 wk.",
    sheet: "Details",
    repository: "Repository",
    license: "License",
    language: "Language",
    since: "Since",
    updated: "Updated",
    contribute: "Get involved",
    contributeBody: "Something not working, or missing something? It's open source: open an issue or send a PR.",
    openIssue: "Open an issue",
    fork: "Fork it",
    moreIn: (category) => `More in ${category}`,
    playHere: "Play here",
    playHint: "It loads when you press it. You can also open it full screen with “Play”.",
  },
  notFound: {
    title: "Page not found",
    h1: "This experiment doesn't exist (or no longer does).",
    body: "The project may have been renamed or retired. Everything we maintain is on the Labs home page.",
    back: "Back to Labs",
  },
};

const ui: Record<Lang, Ui> = { es, en };

export const getUi = (lang: Lang) => ui[lang];
