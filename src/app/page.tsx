import Link from "next/link";
import { Ago } from "@/components/ago";
import { StageTabs } from "@/components/stage-tabs";
import { CATEGORIES, type Category } from "@/content/projects";
import { formatNumber } from "@/lib/format";
import { getFeatured, getProjectCards } from "@/lib/projects";
import { SITE } from "@/lib/site";

export default async function Home() {
  const [cards, featured] = await Promise.all([getProjectCards(), getFeatured()]);

  const recent = [...cards]
    .filter((p) => p.updatedAt)
    .sort((a, b) => b.updatedAt!.localeCompare(a.updatedAt!))
    .slice(0, 7);
  const playable = cards.filter((p) => p.playable && p.site);
  const count = (stage: string) => cards.filter((p) => p.stage === stage).length;

  return (
    <>
      <section className="hero">
        <div className="prompt" aria-hidden>
          <b>~/plazoleta</b> $ ls labs/
          <span className="cursor" />
        </div>
        <h1>Un taller abierto donde probamos ideas antes de que sean productos.</h1>
        <p>
          Herramientas, apps y experimentos open source que salen del estudio. Algunos acaban siendo cosas que usamos cada día. Otros se quedan en
          el camino. Todos están en GitHub.
        </p>
        <div className="hero-meta">
          <div>
            <b>{count("product")}</b>
            <span>productos mantenidos</span>
          </div>
          <div>
            <b>{count("experiment")}</b>
            <span>experimentos en marcha</span>
          </div>
          <div>
            <b>{cards.length}</b>
            <span>repos open source</span>
          </div>
        </div>
      </section>

      <section className="bento" id="proyectos" aria-label="Destacados">
        {featured && (
          <Link className="tile feat" href={`/${featured.slug}`}>
            <div className="label">Proyecto destacado</div>
            <h2>{featured.name}</h2>
            <p>{featured.tagline ?? featured.description}</p>
            {featured.releases && (
              <div className="stats">
                <div>
                  <b>{featured.releases.total}</b>
                  <span>releases</span>
                </div>
                <div>
                  <b>{formatNumber(featured.releases.downloads)}</b>
                  <span>descargas</span>
                </div>
                <div>
                  <b>{featured.releases.latest[0]?.tag}</b>
                  <span>última versión</span>
                </div>
              </div>
            )}
            <div className="links">
              <span className="pill solid">Ver proyecto</span>
              <span className="pill">{featured.repo}</span>
            </div>
            {featured.activity && <Bars values={featured.activity} label="Commits por semana en las últimas 20 semanas" />}
          </Link>
        )}

        <div className="tile feed">
          <div className="label hot">● Ahora en el laboratorio</div>
          <ul>
            {recent.map((p) => (
              <li key={p.slug}>
                <Link href={`/${p.slug}`}>{p.name}</Link>
                <span>
                  <Ago iso={p.updatedAt!} />
                </span>
              </li>
            ))}
          </ul>
        </div>

        {(Object.keys(CATEGORIES) as Category[]).map((c) => {
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
                    <Link href={`/${p.slug}`}>{p.name}</Link>
                  </span>
                ))}
                {items.length > 4 && " …"}
              </div>
            </div>
          );
        })}

        {playable.map((p) => (
          <a className="tile play" href={p.site!} key={p.slug}>
            <div className="label">Juega en el navegador</div>
            <h3>{p.name}</h3>
            <p>{p.playable!.pitch}</p>
            <div className="screen">▶ JUGAR</div>
          </a>
        ))}
      </section>

      <section className="all">
        <StageTabs items={cards.map(({ slug, name, language, stage, updatedAt }) => ({ slug, name, language, stage, updatedAt }))} />
      </section>

      <section className="contribute">
        <div>
          <h2>¿Usas alguno? ¿Quieres contribuir?</h2>
          <p>Abre un issue, manda un PR o cuéntanos qué echas en falta. Y si necesitas algo así para tu empresa, eso es lo que hacemos en Plazoleta.</p>
        </div>
        <a className="btn" href={SITE.github}>
          Ver en GitHub ↗
        </a>
      </section>
    </>
  );
}

function Bars({ values, label }: { values: number[]; label: string }) {
  const max = Math.max(...values, 1);
  return (
    <div className="bars" role="img" aria-label={label}>
      {values.map((v, i) => (
        <i key={i} style={{ height: `${Math.max(3, (v / max) * 100)}%` }} />
      ))}
    </div>
  );
}
