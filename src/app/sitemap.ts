import type { MetadataRoute } from "next";
import { LANGS, absoluteLanguages, homePath, projectPath } from "@/lib/i18n";
import { getProjectCards } from "@/lib/projects";
import { SITE } from "@/lib/site";

/**
 * Cada página va una vez por idioma y con `alternates.languages`, que es como se
 * le dice a un buscador que son la misma página y no dos que compiten.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cards = await getProjectCards("es");
  const dates = cards.map((p) => p.updatedAt).filter(Boolean) as string[];
  const newest = dates.sort().at(-1);
  const url = (path: string) => `${SITE.url}${path === "/" ? "" : path}`;
  return LANGS.flatMap((lang) => [
    {
      url: url(homePath(lang)),
      lastModified: newest,
      changeFrequency: "daily" as const,
      priority: lang === "es" ? 1 : 0.9,
      alternates: { languages: absoluteLanguages("/") },
    },
    ...cards.map((p) => ({
      url: url(projectPath(lang, p.slug)),
      lastModified: p.updatedAt ?? undefined,
      changeFrequency: "weekly" as const,
      priority: p.stage === "product" ? 0.8 : 0.6,
      alternates: { languages: absoluteLanguages(`/${p.slug}`) },
    })),
  ]);
}
