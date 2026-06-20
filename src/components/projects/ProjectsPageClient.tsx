"use client";

import dynamic from "next/dynamic";

const ProjectsExperience = dynamic(
  () =>
    import("@/components/projects/ProjectsExperience").then(
      (mod) => mod.ProjectsExperience,
    ),
  {
    ssr: false,
    loading: () => (
      <section className="flex h-screen items-center justify-center px-8">
        <p className="text-sm text-muted">Chargement des projets…</p>
      </section>
    ),
  },
);

export function ProjectsPageClient() {
  return <ProjectsExperience />;
}
