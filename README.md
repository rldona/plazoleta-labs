# Plazoleta Labs

Herramientas, apps y experimentos open source de [Plazoleta](https://plazoleta.dev), en **https://labs.plazoleta.dev**.

Next.js 16 (App Router, Cache Components) con la identidad de plazoleta.dev: mismos tokens de color, Space Grotesk + Inter, modo claro por defecto y oscuro bajo demanda.

## Cómo funciona

- **`src/content/projects.ts`** es lo único que se edita a mano: qué repos salen, su etapa (producto o experimento), categoría, textos en español e inglés (`{ es, en }`: si falta uno, no compila) y, si quieres, funcionalidades destacadas.
- **Bilingüe, como plazoleta.dev**: el español vive en la raíz (`/flupcode`) y el inglés en `/en` (`/en/flupcode`), cada uno con su layout raíz en `src/app/(es)` y `src/app/(en)`. Los textos de interfaz están en `src/content/ui.ts`.
- **`src/lib/github.ts`** lee de la API de GitHub el resto: estrellas, licencia, fechas, releases, descargas, actividad de commits, README y portada (la primera imagen del README). Va bajo `use cache` con `cacheLife("hours")`: todo se prerenderiza al construir y se regenera en segundo plano como mucho una vez por hora.
- Si GitHub falla o se agota el límite de peticiones, la web se pinta con los datos curados. Nada de GitHub puede romper el build.

Rutas:

| Ruta | Qué es |
| --- | --- |
| `/` | Portada: proyecto destacado, actividad reciente, categorías, juegos y todos los proyectos por etapa |
| `/<slug>` | Ficha de cada proyecto (se generan todas al construir) |
| `/sitemap.xml`, `/robots.txt` | SEO |

## Añadir o cambiar un proyecto

1. Añade una entrada en `ENTRIES` (`src/content/projects.ts`), con sus textos en español e inglés. El `slug` es la URL: no lo cambies una vez publicado.
2. Para que la ficha luzca, el repo necesita una **imagen al principio del README** (sirve de portada) y **releases** publicadas (activan el botón de descarga, las cifras y el historial de versiones).
3. `featured: true` en un solo proyecto lo pone como destacado en la portada. `playable` saca el juego en el bloque "Juega en el navegador".

## Desarrollo

```bash
npm install
GITHUB_TOKEN=$(gh auth token) npm run dev
```

Sin `GITHUB_TOKEN` funciona igual, pero con el límite anónimo de GitHub (60 peticiones por hora) se quedarán fichas sin datos.

```bash
npm run lint
npx tsc --noEmit
GITHUB_TOKEN=$(gh auth token) npm run build
```

Los prototipos de diseño que llevaron hasta aquí están en `prototypes/` (HTML estático, se sirven con `python3 -m http.server -d prototypes`).

## Despliegue en Vercel

1. Sube este repo a GitHub e impórtalo como proyecto nuevo en Vercel (framework Next.js, sin más ajustes).
2. **Variable de entorno `GITHUB_TOKEN`**: un token *fine-grained* de solo lectura, con acceso a repositorios públicos y sin ningún permiso adicional. Configúralo para Production y Preview.
3. **Dominio**: en *Settings → Domains*, añade `labs.plazoleta.dev`.
   - Si el DNS de `plazoleta.dev` ya está en Vercel, se configura solo.
   - Si no, crea en tu proveedor de DNS un registro `CNAME` de `labs` a `cname.vercel-dns.com`.

## Migración a la organización de GitHub

Cuando exista `github.com/plazoleta`:

1. Transfiere los repos (GitHub redirige las URLs antiguas).
2. Cambia `repo: "rldona/X"` por `repo: "plazoleta/X"` en `src/content/projects.ts`.
3. Cambia `SITE.github` en `src/lib/site.ts`.
