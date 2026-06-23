import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { SectionLabel } from "@/components/sections/SectionLabel";
import { VideoCallIcon } from "@/components/icons/VideoCallIcon";
import { CONTACT_EMAIL, VISIO_MAILTO } from "@/data/siteNav";
import { VISIO_INTRO, VISIO_POINTS } from "@/data/visio";

export const metadata: Metadata = {
  title: "Planifier une visio — Luc Simon",
  description:
    "Échange de 30 minutes pour cadrer votre contexte et identifier la prochaine étape concrète.",
};

export default function PlanifierVisioPage() {
  return (
    <PageShell>
      <section className="px-8 py-20 sm:px-12 sm:py-28 lg:px-20">
        <div className="mx-auto max-w-2xl text-center">
          <SectionLabel>Visio</SectionLabel>
          <h1 className="mt-6 text-3xl tracking-tight text-foreground sm:text-4xl">
            Planifier une visio
          </h1>
          <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">
            {VISIO_INTRO}
          </p>

          <ul className="mt-12 space-y-4 text-left">
            {VISIO_POINTS.map((point) => (
              <li
                key={point}
                className="flex items-start gap-3 rounded-xl border border-border/70 bg-[var(--surface)] px-5 py-4 text-sm text-muted"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {point}
              </li>
            ))}
          </ul>

          <a
            href={VISIO_MAILTO}
            className="mt-12 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent/90 px-8 text-sm font-medium text-on-accent transition-colors hover:bg-accent"
          >
            <VideoCallIcon className="text-on-accent/80" />
            Proposer un créneau par e-mail
          </a>

          <p className="mt-6 text-sm text-muted">
            Ou écrivez directement à{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-foreground underline-offset-4 hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>
      </section>
    </PageShell>
  );
}
