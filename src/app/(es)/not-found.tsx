import type { Metadata } from "next";
import { NotFoundPage } from "@/components/pages/not-found";
import { getUi } from "@/content/ui";

export const metadata: Metadata = { title: getUi("es").notFound.title, robots: { index: false, follow: false } };

export default function NotFound() {
  return <NotFoundPage lang="es" />;
}
