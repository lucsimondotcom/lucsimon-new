import { SectionLabel } from "@/components/sections/SectionLabel";
import { VideoCallIcon } from "@/components/icons/VideoCallIcon";
import {
  CONTACT_EMAIL,
  LANDING_SECTIONS,
  VISIO_MAILTO,
} from "@/data/siteNav";
import { VISIO_INTRO, VISIO_POINTS } from "@/data/visio";

export function VisioSection() {
  return (
    <section
      id={LANDING_SECTIONS.visio}
      className="scroll-mt-12 border-t border-border/80 bg-[var(--surface-subtle)] px-8 py-20 sm:px-12 sm:py-28 lg:scroll-mt-16 lg:px-20"
    >
      <div className="mx-auto max-w-2xl text-center">
        <SectionLabel>Visio</SectionLabel>
        <h2 className="mt-6 text-3xl tracking-tight text-foreground sm:text-4xl">
          Planifier une visio
        </h2>
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

        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href={VISIO_MAILTO}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent/90 px-8 text-sm font-medium text-on-accent transition-colors hover:bg-accent"
          >
            <VideoCallIcon className="text-on-accent/80" />
            Proposer un créneau par e-mail
          </a>
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=Structurer%20mon%20syst%C3%A8me%20web`}
            className="inline-flex h-12 items-center justify-center rounded-full border border-border/70 bg-[var(--surface)] px-8 text-sm font-medium text-foreground backdrop-blur-md transition-colors hover:bg-[var(--surface-hover)]"
          >
            Structurer mon système web
          </a>
        </div>

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
  );
}
