import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUi } from "@/content/ui";

/**
 * Cualquier URL que no case con ninguna ruta acaba aquí y se manda al 404 del
 * grupo. Con dos layouts raíz Next no sabe cuál usar para una URL inexistente y
 * serviría su 404 de fábrica, sin cabecera ni pie. Mismo truco que plazoleta.dev.
 *
 * La metadata va aquí porque para estas URLs Next no renderiza el not-found como
 * ruta: sin esto el 404 heredaría el título de la portada y sería indexable.
 */
export const metadata: Metadata = { title: getUi("es").notFound.title, robots: { index: false, follow: false } };

export default function CatchAll(): never {
  notFound();
}
