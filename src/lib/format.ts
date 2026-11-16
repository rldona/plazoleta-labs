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

const dateFmt = new Intl.DateTimeFormat("es", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

/** Fecha absoluta, determinista en servidor y cliente. */
export const formatDate = (iso: string) => dateFmt.format(new Date(iso));

export const formatNumber = (n: number) => n.toLocaleString("es");

/** "hace 5 días". Solo en cliente: depende de la hora actual (ver components/ago.tsx). */
export function relativeTime(iso: string, now: number) {
  const days = Math.floor((now - new Date(iso).getTime()) / 864e5);
  if (days <= 0) return "hoy";
  if (days === 1) return "ayer";
  if (days < 30) return `hace ${days} días`;
  const months = Math.round(days / 30);
  if (days < 365) return months === 1 ? "hace un mes" : `hace ${months} meses`;
  const years = Math.round(days / 365);
  return years === 1 ? "hace un año" : `hace ${years} años`;
}
