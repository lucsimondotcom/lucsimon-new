import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { ProjectDetailLayout } from "@/components/projects/ProjectDetailLayout";
import { getProjectSlugs, resolveProjectPage } from "@/data/projects";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = resolveProjectPage(slug);

  if (!page) {
    return { title: "Projet — Luc Simon" };
  }

  return {
    title: `${page.project.title} — Luc Simon`,
    description: page.project.detail.subtitle,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const page = resolveProjectPage(slug);

  if (!page) {
    notFound();
  }

  return (
    <PageShell>
      <ProjectDetailLayout
        project={page.project}
        projectIndex={page.index}
        projectTotal={page.total}
      />
    </PageShell>
  );
}
