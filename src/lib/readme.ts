/**
 * README de GitHub → HTML para la ficha.
 *
 * Los README empiezan con una cabecera pensada para GitHub (logo, portada,
 * badges, índice) que en Labs ya está resuelta por la propia ficha, así que se
 * recorta. La primera imagen se rescata como portada. El resto se renderiza tal
 * cual, con las rutas relativas apuntando al repo y el HTML saneado: el README
 * es contenido de terceros a efectos de seguridad aunque los repos sean nuestros.
 */

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";
import type { Root, Element } from "hast";

const BADGE = /shields\.io|badge\.svg|badgen\.net|\/actions\/workflows\//i;

function absolutize(url: string, repo: string, branch: string, kind: "src" | "href") {
  if (/^(https?:|mailto:|#|data:)/i.test(url)) return url;
  const path = url.replace(/^\.?\//, "");
  return kind === "src"
    ? `https://raw.githubusercontent.com/${repo}/${branch}/${path}`
    : `https://github.com/${repo}/blob/${branch}/${path}`;
}

/** Primera imagen que no sea un badge, en Markdown o en HTML. */
function findCover(md: string, repo: string, branch: string) {
  const candidates = [
    ...md.matchAll(/<img[^>]*\ssrc=["']([^"']+)["']/gi),
    ...md.matchAll(/!\[[^\]]*\]\(([^)\s]+)[^)]*\)/g),
  ]
    .map((m) => ({ url: m[1], index: m.index ?? 0 }))
    .filter((c) => !BADGE.test(c.url) && !/\.svg($|\?)/i.test(c.url))
    .sort((a, b) => a.index - b.index);
  return candidates[0] ? absolutize(candidates[0].url, repo, branch, "src") : null;
}

/** Quita la cabecera de GitHub: bloques centrados, H1, badges, separador e índice. */
function stripHeader(md: string) {
  let out = md.replace(/\r\n/g, "\n");
  out = out.replace(/<p\s+align=["']center["'][^>]*>[\s\S]*?<\/p>/gi, "");
  out = out.replace(/<div\s+align=["']center["'][^>]*>[\s\S]*?<\/div>/gi, "");
  out = out.replace(/^#\s+.*\n/m, "");
  out = out
    .split("\n")
    .filter((line) => !/^\s*(\[!\[[^\]]*\]\([^)]*\)\]\([^)]*\)\s*|!\[[^\]]*\]\([^)]*(shields\.io|badge)[^)]*\)\s*)+$/.test(line))
    .join("\n");
  // Índice: un encabezado "Contents"/"Contenido"/"Table of contents" seguido de una lista.
  out = out.replace(/^#{2,4}\s+(table of )?contents?\s*\n+((\s*[-*]\s+.*\n?)+)/gim, "");
  out = out.replace(/^#{2,4}\s+(índice|contenido)\s*\n+((\s*[-*]\s+.*\n?)+)/gim, "");
  out = out.replace(/^\s*(---|\*\*\*)\s*$/gm, "");
  return out.trim();
}

function rewriteAndDemote(repo: string, branch: string) {
  return (tree: Root) => {
    visit(tree, "element", (node: Element, index, parent) => {
      // h1 → h2 … para no competir con el título de la ficha.
      const h = /^h([1-5])$/.exec(node.tagName);
      if (h) node.tagName = `h${Math.max(2, Number(h[1]) + 1)}`;

      if (node.tagName === "img") {
        const src = String(node.properties?.src ?? "");
        if (BADGE.test(src) && parent && typeof index === "number") {
          parent.children.splice(index, 1);
          return index;
        }
        node.properties = { ...node.properties, src: absolutize(src, repo, branch, "src"), loading: "lazy" };
      }
      if (node.tagName === "a" && node.properties?.href) {
        const href = String(node.properties.href);
        node.properties.href = absolutize(href, repo, branch, "href");
        if (/^https?:/.test(String(node.properties.href))) node.properties.rel = ["noopener"];
      }
    });
  };
}

export async function readmeToHtml(md: string, repo: string, branch: string) {
  const cover = findCover(md, repo, branch);
  const body = stripHeader(md);

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSanitize, {
      ...defaultSchema,
      attributes: { ...defaultSchema.attributes, img: [...(defaultSchema.attributes?.img ?? []), "loading", "width", "height"] },
    })
    .use(rewriteAndDemote, repo, branch)
    .use(rehypeStringify)
    .process(body);

  return { html: String(file), cover };
}
