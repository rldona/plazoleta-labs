import { localeIntl, type Lang } from "./i18n";

export const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#e8c400",
  Rust: "#dea584",
  Kotlin: "#a97bff",
  Python: "#3572a5",
  Swift: "#f05138",
  "C#": "#178600",
  Dart: "#00b4ab",
  GDScript: "#355570",
};

const dateFmts = {} as Record<Lang, Intl.DateTimeFormat>;

/** Fecha absoluta, determinista en servidor y cliente. */
export function formatDate(iso: string, lang: Lang) {
  dateFmts[lang] ??= new Intl.DateTimeFormat(localeIntl[lang], { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
  return dateFmts[lang].format(new Date(iso));
}

export const formatNumber = (n: number, lang: Lang) => n.toLocaleString(localeIntl[lang]);

/** "hace 5 días" / "5 days ago". Solo en cliente: depende de la hora actual (ver components/ago.tsx). */
export function relativeTime(iso: string, now: number, lang: Lang) {
  const days = Math.floor((now - new Date(iso).getTime()) / 864e5);
  const months = Math.round(days / 30);
  const years = Math.round(days / 365);
  if (lang === "en") {
    if (days <= 0) return "today";
    if (days === 1) return "yesterday";
    if (days < 30) return `${days} days ago`;
    if (days < 365) return months === 1 ? "a month ago" : `${months} months ago`;
    return years === 1 ? "a year ago" : `${years} years ago`;
  }
  if (days <= 0) return "hoy";
  if (days === 1) return "ayer";
  if (days < 30) return `hace ${days} días`;
  if (days < 365) return months === 1 ? "hace un mes" : `hace ${months} meses`;
  return years === 1 ? "hace un año" : `hace ${years} años`;
}
