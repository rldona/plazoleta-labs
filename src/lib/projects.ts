/**
 * Une el catálogo curado (`content/projects.ts`) con lo que dice GitHub.
 * Lo curado manda en textos y clasificación; GitHub, en cifras y fechas.
 */

import { getProjectBySlug, getProjects, type Project } from "@/content/projects";
import type { Lang } from "./i18n";
import { getActivity, getOwnerRepos, getReadme, getReleases, type ReadmeInfo, type ReleasesInfo, type RepoInfo } from "./github";

export type ProjectCard = Omit<Project, "site" | "language"> & {
  language: string;
  site: string | null;
  stars: number;
  updatedAt: string | null;
  license: string | null;
};

export type ProjectDetail = ProjectCard & {
  info: RepoInfo | null;
  releases: ReleasesInfo | null;
  activity: number[] | null;
  readme: ReadmeInfo | null;
};

const owners = () => [...new Set(getProjects("es").map((p) => p.repo.split("/")[0]))];

async function allRepoInfo() {
  const maps = await Promise.all(owners().map((o) => getOwnerRepos(o)));
  return Object.assign({}, ...maps) as Record<string, RepoInfo>;
}

function toCard(p: Project, info: RepoInfo | undefined): ProjectCard {
  return {
    ...p,
    language: p.language ?? info?.language ?? "—",
    site: p.site ?? info?.homepage ?? null,
    stars: info?.stars ?? 0,
    updatedAt: info?.pushedAt ?? null,
    license: info?.license ?? null,
  };
}

export async function getProjectCards(lang: Lang): Promise<ProjectCard[]> {
  const infos = await allRepoInfo();
  return getProjects(lang).map((p) => toCard(p, infos[p.repo.toLowerCase()]));
}

export async function getProjectDetail(slug: string, lang: Lang): Promise<ProjectDetail | null> {
  const p = getProjectBySlug(slug, lang);
  if (!p) return null;
  const infos = await allRepoInfo();
  const info = infos[p.repo.toLowerCase()] ?? null;
  const [releases, activity, readme] = await Promise.all([
    getReleases(p.repo),
    getActivity(p.repo),
    getReadme(p.repo, info?.defaultBranch ?? "main"),
  ]);
  return { ...toCard(p, info ?? undefined), info, releases, activity, readme };
}

/** Lo que alimenta el bloque destacado de la portada. */
export async function getFeatured(lang: Lang) {
  const p = getProjects(lang).find((x) => x.featured);
  return p ? getProjectDetail(p.slug, lang) : null;
}
