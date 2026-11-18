import type { Metadata } from "next";
import { ProjectPage, projectMetadata } from "@/components/pages/project";
import { SLUGS } from "@/content/projects";

export async function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  return projectMetadata((await params).slug, "es");
}

export default async function Page({ params }: PageProps<"/[slug]">) {
  return <ProjectPage slug={(await params).slug} lang="es" />;
}
