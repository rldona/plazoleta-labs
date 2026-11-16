import type { MetadataRoute } from "next";
import { getProjectCards } from "@/lib/projects";
import { SITE } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cards = await getProjectCards();
  const dates = cards.map((p) => p.updatedAt).filter(Boolean) as string[];
  const newest = dates.sort().at(-1);
  return [
    { url: SITE.url, lastModified: newest, changeFrequency: "daily", priority: 1 },
    ...cards.map((p) => ({
      url: `${SITE.url}/${p.slug}`,
      lastModified: p.updatedAt ?? undefined,
      changeFrequency: (p.stage === "archive" ? "yearly" : "weekly") as "yearly" | "weekly",
      priority: p.stage === "product" ? 0.8 : p.stage === "experiment" ? 0.6 : 0.3,
    })),
  ];
}
