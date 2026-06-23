import { SectionLabel } from "@/components/sections/SectionLabel";
import { ABOUT_CONTENT } from "@/data/about";
import { LANDING_SECTIONS } from "@/data/siteNav";

export function AboutSection() {
  return (
    <section
      id={LANDING_SECTIONS.aPropos}
      className="scroll-mt-12 border-t border-border/80 px-8 py-20 sm:px-12 sm:py-28 lg:scroll-mt-16 lg:px-20"
    >
      <div className="mx-auto max-w-3xl">
        <SectionLabel>À propos</SectionLabel>
        <h2 className="mt-6 text-3xl tracking-tight text-foreground sm:text-4xl">
          Luc Simon
        </h2>
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
      </div>
    </section>
  );
}
