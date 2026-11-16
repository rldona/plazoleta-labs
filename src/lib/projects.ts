/**
 * Une el catálogo curado (`content/projects.ts`) con lo que dice GitHub.
 * Lo curado manda en textos y clasificación; GitHub, en cifras y fechas.
 */

import { PROJECTS, getProjectBySlug, type Project } from "@/content/projects";
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

const owners = () => [...new Set(PROJECTS.map((p) => p.repo.split("/")[0]))];

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

export async function getProjectCards(): Promise<ProjectCard[]> {
  const infos = await allRepoInfo();
  return PROJECTS.map((p) => toCard(p, infos[p.repo.toLowerCase()]));
}

export async function getProjectDetail(slug: string): Promise<ProjectDetail | null> {
  const p = getProjectBySlug(slug);
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
export async function getFeatured() {
  const p = PROJECTS.find((x) => x.featured);
  return p ? getProjectDetail(p.slug) : null;
}
