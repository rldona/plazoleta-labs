"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getUi } from "@/content/ui";
import { equivalentPath, type Lang } from "@/lib/i18n";

/**
 * Selector de idioma, como el de plazoleta.dev: un enlace (rastreable, se puede
 * abrir en otra pestaña) que lleva a la misma página en el otro idioma, no a la
 * portada. Los slugs son iguales en los dos idiomas, así que basta con poner o
 * quitar el prefijo `/en`.
 */
export function LangSwitch({ lang }: { lang: Lang }) {
  const pathname = usePathname();
  const other: Lang = lang === "es" ? "en" : "es";
  const t = getUi(lang).header;
  return (
    <Link href={equivalentPath(pathname, other)} hrefLang={other} lang={other} aria-label={t.switchTo} className="lang-switch">
      {other}
    </Link>
  );
}
