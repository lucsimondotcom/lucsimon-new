import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { ProjectsPageClient } from "@/components/projects/ProjectsPageClient";

export const metadata: Metadata = {
  title: "Projets — Luc Simon",
  description:
    "Réalisations récentes : plateformes B2B, dashboards, sites à forte conversion et outils internes.",
};

export default function ProjetsPage() {
  return (
    <PageShell>
      <ProjectsPageClient />
    </PageShell>
  );
}
