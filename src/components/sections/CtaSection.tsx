import { SectionLabel } from "@/components/sections/SectionLabel";

export function CtaSection() {
  return (
    <section
      id="contact"
      className="border-t border-border/80 bg-[var(--surface-subtle)] px-8 py-32 sm:px-12 lg:px-20"
    >
      <div className="mx-auto max-w-3xl text-center">
        <SectionLabel>Contact</SectionLabel>
        <h2 className="mt-6 text-2xl tracking-tight text-foreground sm:text-3xl">
          Prêt à structurer votre système web ?
        </h2>
        <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">
          Discutons de votre contexte et de la prochaine étape concrète.
        </p>
        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="mailto:contact@lucsimon.fr"
            className="inline-flex h-12 items-center justify-center rounded-full bg-accent/90 px-8 text-sm font-medium text-on-accent transition-colors hover:bg-accent"
          >
            Structurer mon système web
          </a>
          <a
            href="/planifier-une-visio"
            className="inline-flex h-12 items-center justify-center rounded-full border border-border/70 bg-[var(--surface)] px-8 text-sm font-medium text-foreground backdrop-blur-md transition-colors hover:bg-[var(--surface-hover)]"
          >
            Planifier une visio
          </a>
        </div>
      </div>
    </section>
  );
}
