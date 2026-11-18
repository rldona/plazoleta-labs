import type { Metadata } from "next";
import { RootDocument } from "@/components/root-document";
import { getUi } from "@/content/ui";
import { localeOg } from "@/lib/i18n";
import { SITE } from "@/lib/site";

/** Layout raíz del inglés (`/en/...`). Ver el comentario de (es)/layout.tsx. */
const t = getUi("en").meta;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: t.title, template: "%s · Plazoleta Labs" },
  description: t.description,
  openGraph: { siteName: "Plazoleta Labs", locale: localeOg.en, type: "website" },
};

export default function LayoutEn({ children }: Readonly<{ children: React.ReactNode }>) {
  return <RootDocument lang="en">{children}</RootDocument>;
}
