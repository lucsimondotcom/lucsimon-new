import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { AboutSection } from "@/components/sections/AboutSection";
import {
  LANDING_SECTIONS,
  sectionHref,
  VISIO_PAGE,
} from "@/data/siteNav";

export const metadata: Metadata = {
  title: "À propos — Luc Simon",
  description:
    "Product Engineer — de la stratégie à la production, pour des systèmes web clairs et performants.",
};

export default function AProposPage() {
  return (
    <PageShell>
      <AboutSection />
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-8 pb-20 sm:flex-row sm:px-12 lg:px-20">
        <Link
          href={sectionHref(LANDING_SECTIONS.methode)}
          className="inline-flex h-12 items-center justify-center rounded-full border border-border/70 bg-[var(--surface)] px-8 text-sm font-medium text-foreground backdrop-blur-md transition-colors hover:bg-[var(--surface-hover)]"
        >
          Découvrir l&apos;expertise
        </Link>
        <Link
          href={VISIO_PAGE.href}
          className="inline-flex h-12 items-center justify-center rounded-full bg-accent/90 px-8 text-sm font-medium text-on-accent transition-colors hover:bg-accent"
        >
          {VISIO_PAGE.label}
        </Link>
      </div>
    </PageShell>
  );
}
