import type { Metadata } from "next";
import { HomePage } from "@/components/pages/home";
import { alternates } from "@/lib/i18n";

export const metadata: Metadata = { alternates: alternates("es", "/") };

export default function Home() {
  return <HomePage lang="es" />;
}
