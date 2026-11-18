import type { Metadata } from "next";
import { NotFoundPage } from "@/components/pages/not-found";
import { getUi } from "@/content/ui";

export const metadata: Metadata = { title: getUi("en").notFound.title, robots: { index: false, follow: false } };

export default function NotFound() {
  return <NotFoundPage lang="en" />;
}
