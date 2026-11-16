"use cache";

/**
 * Lectura de GitHub, cacheada.
 *
 * Todo el módulo va bajo `use cache`: cada función se ejecuta al construir la
 * web y su resultado entra en el HTML estático; después se regenera en segundo
 * plano como mucho una vez por hora (`cacheLife("hours")`).
 *
 * Nada de aquí puede tumbar la web. Si GitHub falla, contesta 202 (estadísticas
 * aún calculándose) o se agota el límite de peticiones, la función devuelve
 * `null` y la página se pinta con los datos curados de `content/projects.ts`.
 *
 * Sin `GITHUB_TOKEN` el límite es de 60 peticiones por hora, que no llega para
 * construir todas las fichas. En Vercel, configúralo como variable de entorno
 * (un token fine-grained de solo lectura sobre repos públicos basta).
 */

import { cacheLife } from "next/cache";
import { readmeToHtml } from "./readme";

const API = "https://api.github.com";

export type RepoInfo = {
  repo: string;
  description: string | null;
  homepage: string | null;
  language: string | null;
  license: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  pushedAt: string;
  createdAt: string;
  defaultBranch: string;
  archived: boolean;
};

export type ReleaseSummary = {
  tag: string;
  date: string;
  downloads: number;
  note: string | null;
  url: string;
  prerelease: boolean;
};

export type ReleasesInfo = {
  total: number;
  downloads: number;
  latest: ReleaseSummary[];
  latestUrl: string;
};

export type ReadmeInfo = { html: string; cover: string | null };

async function gh<T>(path: string, accept = "application/vnd.github+json"): Promise<{ status: number; data: T | null; link: string | null }> {
  const headers: Record<string, string> = { Accept: accept, "X-GitHub-Api-Version": "2022-11-28", "User-Agent": "plazoleta-labs" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  try {
    const res = await fetch(`${API}${path}`, { headers });
    if (res.status !== 200) {
      if (res.status !== 202) console.warn(`[github] ${res.status} ${path}`);
      return { status: res.status, data: null, link: null };
    }
    const data = accept.includes("raw") ? ((await res.text()) as T) : ((await res.json()) as T);
    return { status: 200, data, link: res.headers.get("link") };
  } catch (error) {
    console.warn(`[github] ${path}`, error);
    return { status: 0, data: null, link: null };
  }
}

type ApiRepo = {
  full_name: string;
  description: string | null;
  homepage: string | null;
  language: string | null;
  license: { spdx_id: string } | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  pushed_at: string;
  created_at: string;
  default_branch: string;
  archived: boolean;
};

const toRepoInfo = (r: ApiRepo): RepoInfo => ({
  repo: r.full_name,
  description: r.description,
  homepage: r.homepage || null,
  language: r.language,
  license: r.license && r.license.spdx_id !== "NOASSERTION" ? r.license.spdx_id : null,
  stars: r.stargazers_count,
  forks: r.forks_count,
  openIssues: r.open_issues_count,
  pushedAt: r.pushed_at,
  createdAt: r.created_at,
  defaultBranch: r.default_branch,
  archived: r.archived,
});

/**
 * Todos los repos públicos de un propietario (usuario u organización) en una
 * sola petición. Es lo que alimenta la portada.
 */
export async function getOwnerRepos(owner: string): Promise<Record<string, RepoInfo>> {
  cacheLife("hours");
  const out: Record<string, RepoInfo> = {};
  for (let page = 1; page <= 3; page++) {
    const { data } = await gh<ApiRepo[]>(`/users/${owner}/repos?per_page=100&type=owner&page=${page}`);
    if (!data) break;
    for (const r of data) out[r.full_name.toLowerCase()] = toRepoInfo(r);
    if (data.length < 100) break;
  }
  return out;
}

type ApiRelease = {
  tag_name: string;
  published_at: string | null;
  created_at: string;
  html_url: string;
  body: string | null;
  draft: boolean;
  prerelease: boolean;
  assets: { download_count: number }[];
};

/**
 * Releases: total, descargas acumuladas (suma de todos los assets) y las cuatro
 * últimas con una línea de resumen sacada de sus notas.
 */
export async function getReleases(repo: string): Promise<ReleasesInfo | null> {
  cacheLife("hours");
  const all: ApiRelease[] = [];
  for (let page = 1; page <= 5; page++) {
    const { data } = await gh<ApiRelease[]>(`/repos/${repo}/releases?per_page=100&page=${page}`);
    if (!data) {
      if (page === 1) return null;
      break;
    }
    all.push(...data.filter((r) => !r.draft));
    if (data.length < 100) break;
  }
  if (all.length === 0) return null;

  const dateOf = (r: ApiRelease) => r.published_at ?? r.created_at;
  all.sort((a, b) => dateOf(b).localeCompare(dateOf(a)));
  const dl = (r: ApiRelease) => r.assets.reduce((n, a) => n + a.download_count, 0);

  return {
    total: all.length,
    downloads: all.reduce((n, r) => n + dl(r), 0),
    latestUrl: `https://github.com/${repo}/releases/latest`,
    latest: all.slice(0, 4).map((r) => ({
      tag: r.tag_name.replace(/^[a-z-]+-(?=v\d)/i, ""),
      date: dateOf(r),
      downloads: dl(r),
      note: summarizeRelease(r.body),
      url: r.html_url,
      prerelease: r.prerelease,
    })),
  };
}

/**
 * Primera frase con contenido de unas notas de versión. Salta títulos, enlaces
 * de "Full Changelog" y entradas de mantenimiento (chore, docs, bump).
 *
 * Las notas suelen venir con saltos de línea a mitad de frase, así que primero
 * se reconstruyen los bloques: un párrafo son líneas seguidas hasta una línea
 * en blanco; cada elemento de lista es un bloque propio.
 */
function summarizeRelease(body: string | null): string | null {
  if (!body) return null;
  const blocks: string[] = [];
  let para: string[] = [];
  const flush = () => {
    if (para.length) blocks.push(para.join(" "));
    para = [];
  };
  for (const raw of body.replace(/\r\n/g, "\n").split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#") || line.startsWith("<!--")) {
      flush();
    } else if (/^[-*]\s+/.test(line)) {
      flush();
      blocks.push(line.replace(/^[-*]\s+/, ""));
    } else {
      para.push(line);
    }
  }
  flush();

  for (let text of blocks) {
    if (text.startsWith("**Full Changelog") || /^(chore|docs|ci|build|test)(\(|:)/i.test(text) || /bump version/i.test(text)) continue;
    text = text
      .replace(/\s+by @\S+ in https?:\/\/\S+$/, "")
      .replace(/^(feat|fix|perf|refactor)(\([^)]*\))?:\s*/i, "")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .trim();
    if (!text) continue;
    const sentence = text.match(/^.{20,}?[.!?](?=\s|$)/)?.[0] ?? text;
    const capped = sentence.charAt(0).toUpperCase() + sentence.slice(1);
    return capped.length > 200 ? `${capped.slice(0, 197)}…` : capped;
  }
  return null;
}

/**
 * Commits por semana en la rama principal, últimas 20 semanas.
 *
 * Se usa `/stats/participation` y no `/stats/commit_activity` porque esta
 * última devuelve ceros en repos de 10.000 commits o más (FlupCode lo es).
 * GitHub calcula las estadísticas bajo demanda y la primera vez contesta 202
 * sin datos: entonces devolvemos `null` y la gráfica aparece en la siguiente
 * regeneración.
 */
export async function getActivity(repo: string): Promise<number[] | null> {
  cacheLife("hours");
  const { data } = await gh<{ all: number[] }>(`/repos/${repo}/stats/participation`);
  if (!data || !Array.isArray(data.all) || data.all.length === 0) return null;
  const weeks = data.all.slice(-20);
  return weeks.some((n) => n > 0) ? weeks : null;
}

export async function getReadme(repo: string, branch: string): Promise<ReadmeInfo | null> {
  cacheLife("hours");
  const { data } = await gh<string>(`/repos/${repo}/readme`, "application/vnd.github.raw+json");
  if (!data) return null;
  return readmeToHtml(data, repo, branch);
}
