import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { SITE } from "@/lib/site";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "Plazoleta Labs: proyectos open source de Plazoleta", template: "%s · Plazoleta Labs" },
  description: SITE.description,
  openGraph: { siteName: "Plazoleta Labs", locale: "es_ES", type: "website" },
  alternates: { canonical: "/" },
};

/**
 * Igual que en plazoleta.dev: el claro es el modo por defecto de la marca y
 * solo se va a oscuro si la persona lo eligió. Se resuelve antes del primer
 * pintado para que no haya destello.
 */
const themeScript = `(function(){try{if(localStorage.getItem('theme')==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a className="skip" href="#contenido">
          Saltar al contenido
        </a>
        <header className="topbar">
          <div className="wrap">
            <Link className="brand" href="/" aria-label="Plazoleta Labs, inicio">
              <Logo />
              Plazoleta <span className="labs">/ Labs</span>
            </Link>
            <nav className="topnav" aria-label="Principal">
              <Link className="hide-sm" href="/#proyectos">
                Proyectos
              </Link>
              <a className="hide-sm" href={SITE.github}>
                GitHub
              </a>
              <a href={SITE.parent}>plazoleta.dev ↗</a>
              <ThemeToggle />
            </nav>
          </div>
        </header>
        <main id="contenido" className="wrap">
          {children}
        </main>
        <footer className="footer">
          <div className="wrap">
            <span>© 2026 Plazoleta · Experimentamos en abierto.</span>
            <span>
              Un proyecto de <a href={SITE.parent}>Plazoleta</a> · Código en <a href={SITE.github}>GitHub</a>
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
