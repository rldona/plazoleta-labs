import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Ago } from "@/components/ago";
import { Bars } from "@/components/bars";
import { PlayPoster } from "@/components/play-poster";
import { getCategories, getProjectBySlug, getStages } from "@/content/projects";
import { getUi } from "@/content/ui";
import { LANG_COLORS, formatDate, formatNumber } from "@/lib/format";
import { alternates, homeAnchor, homePath, localeOg, projectPath, type Lang } from "@/lib/i18n";
import { getProjectCards, getProjectDetail } from "@/lib/projects";

export function projectMetadata(slug: string, lang: Lang): Metadata {
  const p = getProjectBySlug(slug, lang);
  if (!p) return { title: getUi(lang).project.notFound };
  const description = p.tagline ?? p.description;
  return {
    title: p.name,
    description,
    alternates: alternates(lang, `/${p.slug}`),
    openGraph: { title: `${p.name} · Plazoleta Labs`, description, url: projectPath(lang, p.slug), locale: localeOg[lang] },
  };
}

export async function ProjectPage({ slug, lang }: { slug: string; lang: Lang }) {
  const p = await getProjectDetail(slug, lang);
  if (!p) notFound();
  const t = getUi(lang).project;
  const CATEGORIES = getCategories(lang);
  const STAGES = getStages(lang);

  const gh = `https://github.com/${p.repo}`;
  const branch = p.info?.defaultBranch ?? "main";
  const latest = p.releases?.latest[0];
  const isGame = Boolean(p.playable && p.site);
  const cover = p.readme?.cover;
  const related = (await getProjectCards(lang)).filter((x) => x.category === p.category && x.slug !== p.slug).slice(0, 3);

  const stats: [string | number | React.ReactNode, string][] = [];
  if (p.releases) stats.push([p.releases.total, t.releases], [formatNumber(p.releases.downloads, lang), t.downloads]);
  if (p.updatedAt) stats.push([<Ago key="ago" iso={p.updatedAt} lang={lang} />, t.lastActivity]);
  stats.push(p.info ? [p.info.openIssues, t.openIssues] : [p.stars, t.stars]);
  if (!p.releases && p.info) stats.push([p.stars, t.stars]);

  return (
    <>
      <nav className="crumbs" aria-label={t.crumbs}>
        <Link href={homePath(lang)}>Labs</Link>
        <span aria-hidden>/</span>
        <Link href={homeAnchor(lang, "proyectos")}>{CATEGORIES[p.category].title}</Link>
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
              {t.download} <small>{latest.tag}</small>
            </a>
          )}
          {isGame && (
            <a className="btn primary" href={p.site!}>
              {t.play}
            </a>
          )}
          {p.site && !isGame && (
            <a className="btn" href={p.site}>
              {t.web} ↗
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
          <PlayPoster url={p.site!} name={p.name} label={t.playHere} hint={t.playHint} />
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
            <img src={cover} alt={t.screenshot(p.name)} />
          </div>
        )
      )}

      <div className="body">
        <div>
          {p.features && (
            <section>
              <h2>{t.whatItDoes}</h2>
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
                {t.latestReleases} <a href={`${gh}/releases`}>{t.seeAll(p.releases.total)}</a>
              </h2>
              <ol className="releases">
                {p.releases.latest.map((r, i) => (
                  <li key={r.tag + r.date}>
                    <div className="r-head">
                      <code>
                        <a href={r.url}>{r.tag}</a>
                      </code>
                      {i === 0 && <span className="latest">{t.latest}</span>}
                      <span className="r-meta">
                        {formatDate(r.date, lang)} · {formatNumber(r.downloads, lang)} {t.downloads}
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
              {t.moreInfo} <a href={`${gh}#readme`}>{t.openGithub}</a>
            </h2>
            {p.readme?.html ? (
              <>
                <div className="readme-wrap">
                  <input type="checkbox" id="readme-toggle" hidden />
                  <div className="readme" dangerouslySetInnerHTML={{ __html: p.readme.html }} />
                </div>
                <label className="readme-more" htmlFor="readme-toggle">
                  {t.readFull}
                </label>
              </>
            ) : (
              <div className="readme-empty">{t.noReadme}</div>
            )}
          </section>
        </div>

        <aside className="side">
          <div className="box">
            <div className="stats">
              {stats.map(([n, label]) => (
                <div key={label}>
                  <b>{n}</b>
                  <span>{label}</span>
                </div>
              ))}
            </div>
            {p.activity && (
              <>
                <Bars values={p.activity} label={getUi(lang).home.commitsChart} min={4} />
                <div className="bars-cap">
                  <span>{t.commitsPerWeek}</span>
                  <span>{t.weeks}</span>
                </div>
              </>
            )}
          </div>
          <div className="box">
            <h3>{t.sheet}</h3>
            <dl>
              <dt>{t.repository}</dt>
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
              <dt>{t.license}</dt>
              <dd>{p.license ?? "—"}</dd>
              <dt>{t.language}</dt>
              <dd>{p.language}</dd>
              {p.info && (
                <>
                  <dt>{t.since}</dt>
                  <dd>{formatDate(p.info.createdAt, lang)}</dd>
                </>
              )}
              {p.updatedAt && (
                <>
                  <dt>{t.updated}</dt>
                  <dd>{formatDate(p.updatedAt, lang)}</dd>
                </>
              )}
            </dl>
          </div>
          <div className="box contrib">
            <h3>{t.contribute}</h3>
            <p>{t.contributeBody}</p>
            <div className="links">
              <a href={`${gh}/issues/new`}>{t.openIssue}</a>
              <a href={`${gh}/fork`}>{t.fork}</a>
              {p.license && <a href={`${gh}/blob/${branch}/LICENSE`}>{t.license}</a>}
            </div>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="related">
          <h2>{t.moreIn(CATEGORIES[p.category].title)}</h2>
          <div className="rel">
            {related.map((r) => (
              <Link href={projectPath(lang, r.slug)} key={r.slug}>
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
