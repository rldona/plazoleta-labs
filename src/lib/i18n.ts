/**
 * Capa de idioma, con el mismo esquema que plazoleta.dev: el español vive en la
 * raíz (`/flupcode`) y el inglés cuelga de `/en` (`/en/flupcode`). Los slugs de
 * proyecto son los mismos en los dos idiomas, así que la página equivalente en
 * el otro idioma es siempre la misma ruta con o sin prefijo.
 */

import { SITE } from "./site";

export type Lang = "es" | "en";

/** El primero es el idioma por defecto y el que vive en la raíz. */
export const LANGS: Lang[] = ["es", "en"];
export const DEFAULT_LANG: Lang = "es";

/** Código para `<html lang>` y hreflang. */
export const localeHtml: Record<Lang, string> = { es: "es-ES", en: "en" };

/** Locale de Open Graph. */
export const localeOg: Record<Lang, string> = { es: "es_ES", en: "en" };

/** Locale de `Intl` para fechas y números. */
export const localeIntl: Record<Lang, string> = { es: "es", en: "en" };

/** "" para español, "/en" para inglés. */
export const prefix = (lang: Lang) => (lang === DEFAULT_LANG ? "" : `/${lang}`);

/** Portada del idioma: "/" o "/en" (sin barra final, que Next redirigiría). */
export const homePath = (lang: Lang) => prefix(lang) || "/";

/** Ruta de una ficha de proyecto. */
export const projectPath = (lang: Lang, slug: string) => `${prefix(lang)}/${slug}`;

/** Ancla dentro de la portada: "/#proyectos" o "/en#proyectos". */
export const homeAnchor = (lang: Lang, id: string) => `${prefix(lang) || "/"}#${id}`;

/** Quita el prefijo de idioma de una ruta: "/en/flupcode" → "/flupcode". */
function stripPrefix(pathname: string) {
  for (const lang of LANGS) {
    const p = prefix(lang);
    if (!p) continue;
    if (pathname === p) return "/";
    if (pathname.startsWith(`${p}/`)) return pathname.slice(p.length);
  }
  return pathname;
}

/** Misma página en el otro idioma. */
export function equivalentPath(pathname: string, lang: Lang) {
  const base = stripPrefix(pathname);
  return base === "/" ? homePath(lang) : `${prefix(lang)}${base}`;
}

/** Ruta sin idioma ("/" o "/flupcode") → canonical + hreflang de las dos versiones. */
export function alternates(lang: Lang, path: string) {
  const at = (l: Lang) => (path === "/" ? homePath(l) : `${prefix(l)}${path}`);
  return {
    canonical: at(lang),
    languages: {
      [localeHtml.es]: at("es"),
      [localeHtml.en]: at("en"),
      "x-default": at(DEFAULT_LANG),
    },
  };
}

/** Lo mismo con URLs absolutas, para el sitemap. */
export function absoluteLanguages(path: string) {
  const { languages } = alternates(DEFAULT_LANG, path);
  return Object.fromEntries(Object.entries(languages).map(([k, v]) => [k, `${SITE.url}${v === "/" ? "" : v}`]));
}
