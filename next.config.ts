import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  /*
   * Sin Partial Prefetching a propósito. El catálogo es cerrado (todas las
   * fichas se prerenderizan desde `generateStaticParams`), así que no ganamos
   * nada sirviendo una plantilla genérica a slugs desconocidos; en cambio, con
   * ella la primera visita a /no-existe respondía 200 en vez de 404.
   */
  partialPrefetching: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
