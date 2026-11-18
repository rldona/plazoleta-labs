import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUi } from "@/content/ui";

/** Igual que (es)/[...ruta]/page.tsx, para /en/... */
export const metadata: Metadata = { title: getUi("en").notFound.title, robots: { index: false, follow: false } };

export default function CatchAll(): never {
  notFound();
}
