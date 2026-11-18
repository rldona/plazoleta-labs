import { Inter, Space_Grotesk } from "next/font/google";
import Link from "next/link";
import { LangSwitch } from "@/components/lang-switch";
import { Logo } from "@/components/logo";
import { SiteFooter } from "@/components/site-footer";
import { ThemeToggle } from "@/components/theme-toggle";
import { getUi } from "@/content/ui";
import { homeAnchor, homePath, localeHtml, type Lang } from "@/lib/i18n";
import { SITE } from "@/lib/site";
import "@/app/globals.css";

/**
 * El documento HTML, compartido por los dos idiomas.
 *
 * Hay un layout raíz por idioma, como en plazoleta.dev, porque `<html lang>` solo
 * se puede fijar ahí: con un `lang="es"` en las páginas inglesas un lector de
 * pantalla las leería con fonética española. Esto evita tener dos copias del
 * mismo `<head>`, cabecera y pie. El precio es que cambiar de idioma recarga la
 * página entera, cosa esperable en un cambio de idioma.
 */

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"], display: "swap" });

/**
 * Igual que en plazoleta.dev: el claro es el modo por defecto de la marca y
 * solo se va a oscuro si la persona lo eligió. Se resuelve antes del primer
 * pintado para que no haya destello.
 */
const themeScript = `(function(){try{if(localStorage.getItem('theme')==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`;

export function RootDocument({ lang, children }: Readonly<{ lang: Lang; children: React.ReactNode }>) {
  const t = getUi(lang);
  const parent = SITE.parent[lang];

  return (
    <html lang={localeHtml[lang]} className={`${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      {/* Es el layout raíz (vive fuera de app/ para compartirlo entre idiomas): aquí <head> es lo correcto. */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a className="skip" href="#contenido">
          {t.skip}
        </a>
        <header className="topbar">
          <div className="wrap">
            <Link className="brand" href={homePath(lang)} aria-label={t.header.home}>
              <Logo />
              Plazoleta <span className="labs">/ Labs</span>
            </Link>
            <nav className="topnav" aria-label={t.header.nav}>
              <Link className="hide-sm" href={homeAnchor(lang, "proyectos")}>
                {t.header.projects}
              </Link>
              <a className="hide-sm" href={SITE.github}>
                GitHub
              </a>
              <a className="hide-xs" href={parent}>
                plazoleta.dev ↗
              </a>
              <div className="controls">
                <LangSwitch lang={lang} />
                <ThemeToggle label={t.header.darkMode} />
              </div>
            </nav>
          </div>
        </header>
        <main id="contenido" className="wrap">
          {children}
        </main>
        <SiteFooter lang={lang} />
      </body>
    </html>
  );
}
