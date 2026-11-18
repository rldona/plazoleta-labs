import Link from "next/link";
import { Logo } from "@/components/logo";
import { getUi } from "@/content/ui";
import { homeAnchor, homePath, type Lang } from "@/lib/i18n";
import { SITE } from "@/lib/site";

/**
 * Pie con la misma estructura y las mismas clases que el de plazoleta.dev
 * (components/site-footer.tsx): marca + tres columnas y una barra inferior con
 * las legales. Si cambia allí, cambia aquí.
 *
 * Las legales y las secciones del estudio enlazan a plazoleta.dev: Labs no tiene
 * entidad propia, es la misma empresa.
 */

const heading = "text-xs font-medium uppercase tracking-[0.2em] text-subtle";
const item = "tap-target text-sm text-muted transition-colors hover:text-accent-ink";
const legal = "tap-target underline underline-offset-4 transition-colors hover:text-accent-ink";

/** Rutas de plazoleta.dev por idioma. */
const PARENT_PATHS: Record<Lang, { studio: string; services: string; work: string; method: string; blog: string; legal: string; privacy: string }> = {
  es: { studio: "/estudio", services: "/#servicios", work: "/trabajo", method: "/metodo", blog: "/blog", legal: "/aviso-legal", privacy: "/privacidad" },
  en: {
    studio: "/en/studio",
    services: "/en#servicios",
    work: "/en/work",
    method: "/en/method",
    blog: "/en/blog",
    legal: "/en/legal-notice",
    privacy: "/en/privacy",
  },
};

export function SiteFooter({ lang }: { lang: Lang }) {
  const t = getUi(lang).footer;
  const p = PARENT_PATHS[lang];
  const parent = (path: string) => `${SITE.parent.es}${path}`;

  return (
    <footer className="mt-28 border-t border-line">
      <div className="wrap">
        <div className="grid grid-cols-2 gap-10 py-14 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href={homePath(lang)} className="flex items-center gap-2 font-display text-base font-medium tracking-tight">
              <Logo className="h-7 w-7 text-accent" />
              Plazoleta <span className="text-subtle">/ Labs</span>
            </Link>
          </div>

          <nav aria-label="Labs">
            <h2 className={heading}>Labs</h2>
            <ul className="mt-5 flex flex-col gap-2.5">
              <li>
                <Link href={homeAnchor(lang, "proyectos")} className={item}>
                  {t.featured}
                </Link>
              </li>
              <li>
                <Link href={homeAnchor(lang, "todos")} className={item}>
                  {t.all}
                </Link>
              </li>
              <li>
                <Link href={homeAnchor(lang, "participa")} className={item}>
                  {t.contribute}
                </Link>
              </li>
              <li>
                <a href={SITE.github} className={item}>
                  GitHub
                </a>
              </li>
            </ul>
          </nav>

          <nav aria-label="Plazoleta">
            <h2 className={heading}>Plazoleta</h2>
            <ul className="mt-5 flex flex-col gap-2.5">
              <li>
                <a href={parent(p.studio)} className={item}>
                  {t.studio}
                </a>
              </li>
              <li>
                <a href={parent(p.services)} className={item}>
                  {t.services}
                </a>
              </li>
              <li>
                <a href={parent(p.work)} className={item}>
                  {t.work}
                </a>
              </li>
              <li>
                <a href={parent(p.method)} className={item}>
                  {t.method}
                </a>
              </li>
              <li>
                <a href={parent(p.blog)} className={item}>
                  Blog
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className={heading}>{t.contact}</h2>
            <ul className="mt-5 flex flex-col gap-2.5 text-sm text-muted">
              <li>
                <a href="mailto:hello@plazoleta.dev" className="tap-target transition-colors hover:text-accent-ink">
                  hello@plazoleta.dev
                </a>
              </li>
              <li>{t.location}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* El `py-6` va fuera: `.wrap` fija su propio padding y se lo comería. */}
      <div className="border-t border-line py-6">
        <div className="wrap flex flex-col justify-between gap-3 text-xs text-subtle sm:flex-row">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>© 2026 Plazoleta. {t.rights}</span>
            <span aria-hidden>·</span>
            <a href={parent(p.legal)} className={legal}>
              {t.legal}
            </a>
            <span aria-hidden>·</span>
            <a href={parent(p.privacy)} className={legal}>
              {t.privacy}
            </a>
          </p>
          <p>{t.signature}</p>
        </div>
      </div>
    </footer>
  );
}

