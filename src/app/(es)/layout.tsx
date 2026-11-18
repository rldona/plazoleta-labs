import type { Metadata } from "next";
import { RootDocument } from "@/components/root-document";
import { getUi } from "@/content/ui";
import { localeOg } from "@/lib/i18n";
import { SITE } from "@/lib/site";

/**
 * Layout raíz del español, que vive en la raíz del sitio (`/flupcode`). El inglés
 * tiene el suyo en (en)/layout.tsx: ver el comentario de components/root-document.tsx.
 *
 * Sin `alternates` aquí: el merge de metadata es superficial y todas las páginas
 * heredarían el canonical de la portada. Cada página declara el suyo.
 */
const t = getUi("es").meta;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: t.title, template: "%s · Plazoleta Labs" },
  description: t.description,
  openGraph: { siteName: "Plazoleta Labs", locale: localeOg.es, type: "website" },
};

export default function LayoutEs({ children }: Readonly<{ children: React.ReactNode }>) {
  return <RootDocument lang="es">{children}</RootDocument>;
}
