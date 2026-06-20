import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { SectionLabel } from "@/components/sections/SectionLabel";
import { ABOUT_CONTENT } from "@/data/about";
import { VISIO_PAGE } from "@/data/siteNav";

export const metadata: Metadata = {
  title: "À propos — Luc Simon",
  description:
    "Product Engineer — de la stratégie à la production, pour des systèmes web clairs et performants.",
};

export default function AProposPage() {
  return (
    <PageShell>
      <section className="px-8 py-20 sm:px-12 sm:py-28 lg:px-20">
        <div className="mx-auto max-w-3xl">
          <SectionLabel>À propos</SectionLabel>
          <h1 className="mt-6 text-3xl tracking-tight text-foreground sm:text-4xl">
            Luc Simon
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-foreground">
            {ABOUT_CONTENT.intro}
          </p>

          <div className="mt-12 space-y-6 text-base leading-relaxed text-muted">
            {ABOUT_CONTENT.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>

          <dl className="mt-14 grid gap-6 border-t border-border/70 pt-10 sm:grid-cols-3">
            {ABOUT_CONTENT.highlights.map((item) => (
              <div key={item.label}>
                <dt className="text-xs tracking-[0.2em] text-muted uppercase">
                  {item.label}
                </dt>
                <dd className="mt-2 text-sm font-medium text-foreground">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-14 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center rounded-full border border-border/70 bg-[var(--surface)] px-8 text-sm font-medium text-foreground backdrop-blur-md transition-colors hover:bg-[var(--surface-hover)]"
            >
              Découvrir la méthode
            </Link>
            <Link
              href={VISIO_PAGE.href}
              className="inline-flex h-12 items-center justify-center rounded-full bg-accent/90 px-8 text-sm font-medium text-on-accent transition-colors hover:bg-accent"
            >
              Planifier une visio
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
