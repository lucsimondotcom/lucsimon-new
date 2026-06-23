import Link from "next/link";
import Image from "next/image";
import { SectionLabel } from "@/components/sections/SectionLabel";
import { RECENT_PROJECTS } from "@/data/projects";
import { LANDING_SECTIONS, sectionHref } from "@/data/siteNav";
import { ProjectDetailLink } from "./ProjectDetailLink";

export function ProjectsStaticList() {
  return (
    <section
      id={LANDING_SECTIONS.projets}
      className="scroll-mt-12 border-t border-border/80 px-8 py-20 sm:px-12 sm:py-28 lg:scroll-mt-16 lg:px-20"
    >
      <div className="mx-auto max-w-5xl">
        <SectionLabel>Projets</SectionLabel>
        <h2 className="mt-6 max-w-2xl text-3xl tracking-tight text-foreground sm:text-4xl">
          Des livrables concrets, alignés sur les enjeux métier
        </h2>
        <ul className="mt-16 space-y-10">
          {RECENT_PROJECTS.map((project) => (
            <li
              key={project.slug}
              className="grid gap-8 rounded-2xl border border-border/70 bg-[var(--surface)] p-8 backdrop-blur-md sm:grid-cols-[140px_1fr] sm:p-10"
            >
              <div
                className={`relative aspect-square overflow-hidden rounded-xl${
                  project.image ? "" : " bg-accent"
                }`}
              >
                {project.image ? (
                  <Image
                    src={project.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="140px"
                  />
                ) : null}
              </div>
              <div>
                <p className="text-xs tracking-[0.2em] text-muted uppercase">
                  {project.client}
                </p>
                <h3 className="mt-2 text-xl font-medium text-foreground">
                  {project.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  {project.description}
                </p>
                <ProjectDetailLink slug={project.slug} className="mt-6" />
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-16 text-center">
          <Link
            href={sectionHref(LANDING_SECTIONS.visio)}
            className="inline-flex h-12 items-center justify-center rounded-full border border-border/70 bg-[var(--surface)] px-8 text-sm font-medium text-foreground backdrop-blur-md transition-colors hover:bg-[var(--surface-hover)]"
          >
            Discuter de votre projet
          </Link>
        </div>
      </div>
    </section>
  );
}
