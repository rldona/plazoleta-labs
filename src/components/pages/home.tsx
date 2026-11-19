import Link from "next/link";
import { Ago } from "@/components/ago";
import { Bars } from "@/components/bars";
import { HeroBloques } from "@/components/hero-bloques";
import { Scope } from "@/components/scope";
import { StageTabs } from "@/components/stage-tabs";
import { CATEGORY_KEYS, getCategories } from "@/content/projects";
import { getUi } from "@/content/ui";
import { formatNumber } from "@/lib/format";
import { projectPath, type Lang } from "@/lib/i18n";
import { getFeatured, getProjectCards } from "@/lib/projects";
import { SITE } from "@/lib/site";

export async function HomePage({ lang }: { lang: Lang }) {
  const [cards, featured] = await Promise.all([getProjectCards(lang), getFeatured(lang)]);
  const t = getUi(lang).home;
  const CATEGORIES = getCategories(lang);

  const recent = [...cards]
    .filter((p) => p.updatedAt)
    .sort((a, b) => b.updatedAt!.localeCompare(a.updatedAt!))
    .slice(0, 7);
  const playable = cards.filter((p) => p.playable && p.site);
  const count = (stage: string) => cards.filter((p) => p.stage === stage).length;

  return (
    <>
      <section className="hero">
        <HeroBloques />
        {/* Desde 1000px va a la derecha del texto; por debajo, encima del prompt. */}
        <div className="hero-scope">
          <Scope nodos={cards.map((p) => ({ name: p.name, stage: p.stage }))} textos={getUi(lang).scope} />
        </div>
        <div className="hero-texto">
          <div className="prompt" aria-hidden>
            <b>~/plazoleta</b> $ ls labs/
            <span className="cursor" />
          </div>
          <h1>
            {t.h1.before}
            <span className="mark-accent mark-accent-draw">{t.h1.mark}</span>
            {t.h1.after}
          </h1>
          <p>{t.intro}</p>
          <div className="hero-meta">
            <div>
              <b>{count("product")}</b>
              <span>{t.products}</span>
            </div>
            <div>
              <b>{count("experiment")}</b>
              <span>{t.experiments}</span>
            </div>
            <div>
              <b>{cards.length}</b>
              <span>{t.repos}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bento" id="proyectos" aria-label={t.featuredAria}>
        {featured && (
          <Link className="tile feat" href={projectPath(lang, featured.slug)}>
            <div className="label">{t.featured}</div>
            <h2>{featured.name}</h2>
            <p>{featured.tagline ?? featured.description}</p>
            {featured.releases && (
              <div className="stats">
                <div>
                  <b>{featured.releases.total}</b>
                  <span>{t.releases}</span>
                </div>
                <div>
                  <b>{formatNumber(featured.releases.downloads, lang)}</b>
                  <span>{t.downloads}</span>
                </div>
                <div>
                  <b>{featured.releases.latest[0]?.tag}</b>
                  <span>{t.latestVersion}</span>
                </div>
              </div>
            )}
            <div className="links">
              <span className="pill solid">{t.viewProject}</span>
              <span className="pill">{featured.repo}</span>
            </div>
            {featured.activity && <Bars values={featured.activity} label={t.commitsChart} />}
          </Link>
        )}

        <div className="tile feed">
          <div className="label hot">{t.now}</div>
          <ul>
            {recent.map((p) => (
              <li key={p.slug}>
                <Link href={projectPath(lang, p.slug)}>{p.name}</Link>
                <span>
                  <Ago iso={p.updatedAt!} lang={lang} />
                </span>
              </li>
            ))}
          </ul>
        </div>

        {CATEGORY_KEYS.map((c) => {
          const items = cards.filter((p) => p.category === c);
          return (
            <div className="tile cat" key={c}>
              <div className="label">{CATEGORIES[c].title}</div>
              <p>{CATEGORIES[c].note}</p>
              <div className="count">{items.length}</div>
              <div className="names">
                {items.slice(0, 4).map((p, i) => (
                  <span key={p.slug}>
                    {i > 0 && " · "}
                    <Link href={projectPath(lang, p.slug)}>{p.name}</Link>
                  </span>
                ))}
                {items.length > 4 && " …"}
              </div>
            </div>
          );
        })}

        {playable.map((p) => (
          <a className="tile play" href={p.site!} key={p.slug}>
            <div className="label">{t.play}</div>
            <h3>{p.name}</h3>
            <p>{p.playable!.pitch}</p>
            <div className="screen">{t.playCta}</div>
          </a>
        ))}
      </section>

      <section className="all" id="todos">
        <StageTabs lang={lang} items={cards.map(({ slug, name, language, stage, updatedAt }) => ({ slug, name, language, stage, updatedAt }))} />
      </section>

      <section className="contribute" id="participa">
        <div>
          <h2>{t.contributeTitle}</h2>
          <p>{t.contributeBody}</p>
        </div>
        <a className="btn" href={SITE.github}>
          {t.viewGithub}
        </a>
      </section>
    </>
  );
}
