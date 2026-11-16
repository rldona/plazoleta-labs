import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Ago } from "@/components/ago";
import { PlayPoster } from "@/components/play-poster";
import { CATEGORIES, PROJECTS, STAGES, getProjectBySlug } from "@/content/projects";
import { LANG_COLORS, formatDate, formatNumber } from "@/lib/format";
import { getProjectCards, getProjectDetail } from "@/lib/projects";

export async function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProjectBySlug(slug);
  if (!p) return { title: "Proyecto no encontrado" };
  return {
    title: p.name,
    description: p.tagline ?? p.description,
    alternates: { canonical: `/${p.slug}` },
    openGraph: { title: `${p.name} · Plazoleta Labs`, description: p.tagline ?? p.description, url: `/${p.slug}` },
  };
}

export default async function ProjectPage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const p = await getProjectDetail(slug);
  if (!p) notFound();

  const gh = `https://github.com/${p.repo}`;
  const branch = p.info?.defaultBranch ?? "main";
  const latest = p.releases?.latest[0];
  const isGame = Boolean(p.playable && p.site);
  const cover = p.readme?.cover;
  const related = (await getProjectCards()).filter((x) => x.category === p.category && x.slug !== p.slug).slice(0, 3);

  const stats: [string | number | React.ReactNode, string][] = [];
  if (p.releases) stats.push([p.releases.total, "releases"], [formatNumber(p.releases.downloads), "descargas"]);
  if (p.updatedAt) stats.push([<Ago key="ago" iso={p.updatedAt} />, "última actividad"]);
  stats.push(p.info ? [p.info.openIssues, "issues abiertas"] : [p.stars, "estrellas"]);
  if (!p.releases && p.info) stats.push([p.stars, "estrellas"]);

  return (
    <>
      <nav className="crumbs" aria-label="Migas">
        <Link href="/">Labs</Link>
        <span aria-hidden>/</span>
        <Link href="/#proyectos">{CATEGORIES[p.category].title}</Link>
        <span aria-hidden>/</span>
        <span aria-current="page">{p.name}</span>
      </nav>

      <header className="head">
        <div>
          <div className="title">
            <div className="mark" aria-hidden>
              {p.name[0].toUpperCase()}
            </div>
            <h1>{p.name}</h1>
            <span className={`badge ${p.stage}`}>{STAGES[p.stage].label}</span>
          </div>
          <p className="tagline">{p.tagline ?? p.description}</p>
          <div className="chips">
            <span>
              <i className="lang-dot" style={{ background: LANG_COLORS[p.language] ?? "var(--subtle)" }} />
              {p.language}
            </span>
            {p.stack && <span>{p.stack}</span>}
            {p.platforms?.map((x) => <span key={x}>{x}</span>)}
            {p.license && <span>{p.license}</span>}
          </div>
        </div>
        <div className="actions">
          {latest && p.releases && (
            <a className="btn primary" href={p.releases.latestUrl}>
              ↓ Descargar <small>{latest.tag}</small>
            </a>
          )}
          {isGame && (
            <a className="btn primary" href={p.site!}>
              ▶ Jugar
            </a>
          )}
          {p.site && !isGame && (
            <a className="btn" href={p.site}>
              Web ↗
            </a>
          )}
          {p.links?.map((l) => (
            <a className="btn" href={l.url} key={l.url}>
              {l.label} ↗
            </a>
          ))}
          <a className="btn" href={gh}>
            GitHub ↗
          </a>
        </div>
      </header>

      {isGame ? (
        <div className="cover">
          <div className="bar" aria-hidden>
            <i />
            <i />
            <i />
          </div>
          <PlayPoster url={p.site!} name={p.name} />
        </div>
      ) : (
        cover && (
          <div className="cover">
            <div className="bar" aria-hidden>
              <i />
              <i />
              <i />
            </div>
            {/* Imagen externa de raw.githubusercontent.com: no pasa por next/image a propósito. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cover} alt={`Captura de ${p.name}`} />
          </div>
        )
      )}

      <div className="body">
        <div>
          {p.features && (
            <section>
              <h2>Qué hace</h2>
              <div className="features">
                {p.features.map((f) => (
                  <div key={f.title}>
                    <b>{f.title}</b>
                    <p>{f.body}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {p.releases && (
            <section>
              <h2>
                Últimas versiones <a href={`${gh}/releases`}>Ver las {p.releases.total} →</a>
              </h2>
              <ol className="releases">
                {p.releases.latest.map((r, i) => (
                  <li key={r.tag + r.date}>
                    <div className="r-head">
                      <code>
                        <a href={r.url}>{r.tag}</a>
                      </code>
                      {i === 0 && <span className="latest">Última</span>}
                      <span className="r-meta">
                        {formatDate(r.date)} · {formatNumber(r.downloads)} descargas
                      </span>
                    </div>
                    {r.note && <p>{r.note}</p>}
                  </li>
                ))}
              </ol>
              {p.downloadNote && <div className="notice">{p.downloadNote}</div>}
            </section>
          )}

          <section>
            <h2>
              Más información <a href={`${gh}#readme`}>Abrir en GitHub →</a>
            </h2>
            {p.readme?.html ? (
              <>
                <div className="readme-wrap">
                  <input type="checkbox" id="readme-toggle" hidden />
                  <div className="readme" dangerouslySetInnerHTML={{ __html: p.readme.html }} />
                </div>
                <label className="readme-more" htmlFor="readme-toggle">
                  Leer el README completo
                </label>
              </>
            ) : (
              <div className="readme-empty">Este repositorio todavía no tiene README. Puedes ver el código directamente en GitHub.</div>
            )}
          </section>
        </div>

        <aside className="side">
          <div className="box">
            <div className="stats">
              {stats.map(([n, t]) => (
                <div key={t}>
                  <b>{n}</b>
                  <span>{t}</span>
                </div>
              ))}
            </div>
            {p.activity && (
              <>
                <Bars values={p.activity} />
                <div className="bars-cap">
                  <span>commits / semana</span>
                  <span>20 sem.</span>
                </div>
              </>
            )}
          </div>
          <div className="box">
            <h3>Ficha</h3>
            <dl>
              <dt>Repositorio</dt>
              <dd>
                <a href={gh}>{p.repo}</a>
              </dd>
              {p.site && (
                <>
                  <dt>Web</dt>
                  <dd>
                    <a href={p.site}>{p.site.replace(/^https?:\/\//, "").replace(/\/$/, "")}</a>
                  </dd>
                </>
              )}
              <dt>Licencia</dt>
              <dd>{p.license ?? "—"}</dd>
              <dt>Lenguaje</dt>
              <dd>{p.language}</dd>
              {p.info && (
                <>
                  <dt>Desde</dt>
                  <dd>{formatDate(p.info.createdAt)}</dd>
                </>
              )}
              {p.updatedAt && (
                <>
                  <dt>Actualizado</dt>
                  <dd>{formatDate(p.updatedAt)}</dd>
                </>
              )}
            </dl>
          </div>
          <div className="box contrib">
            <h3>Participa</h3>
            <p>¿Algo no funciona o echas algo en falta? Es open source: abre un issue o manda un PR.</p>
            <div className="links">
              <a href={`${gh}/issues/new`}>Abrir issue</a>
              <a href={`${gh}/fork`}>Hacer fork</a>
              {p.license && <a href={`${gh}/blob/${branch}/LICENSE`}>Licencia</a>}
            </div>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="related">
          <h2>Más en {CATEGORIES[p.category].title}</h2>
          <div className="rel">
            {related.map((r) => (
              <Link href={`/${r.slug}`} key={r.slug}>
                <b>{r.name}</b>
                <p>{r.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function Bars({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);
  return (
    <div className="bars" role="img" aria-label="Commits por semana en las últimas 20 semanas">
      {values.map((v, i) => (
        <i key={i} style={{ height: `${Math.max(4, (v / max) * 100)}%` }} />
      ))}
    </div>
  );
}
