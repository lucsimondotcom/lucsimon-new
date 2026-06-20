"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { SectionLabel } from "@/components/sections/SectionLabel";
import { RECENT_PROJECTS } from "@/data/projects";
import { VISIO_PAGE } from "@/data/siteNav";
import { PROJECTS_TOTAL_SCROLL_VH } from "@/lib/projectsScroll";
import { useProjectsScroll } from "@/hooks/useProjectsScroll";
import { ProjectDetailLink } from "./ProjectDetailLink";
import { ProjectsCanvas } from "./ProjectsCanvas";
import { ProjectPanels } from "./ProjectPanels";

function ProjectsStaticList() {
  return (
    <section className="px-8 py-20 sm:px-12 sm:py-28 lg:px-20">
      <div className="mx-auto max-w-5xl">
        <SectionLabel>Projets</SectionLabel>
        <h1 className="mt-6 max-w-2xl text-3xl tracking-tight text-foreground sm:text-4xl">
          Des livrables concrets, alignés sur les enjeux métier
        </h1>
        <ul className="mt-16 space-y-10">
          {RECENT_PROJECTS.map((project) => (
            <li
              key={project.slug}
              className="grid gap-8 rounded-2xl border border-border/70 bg-[var(--surface)] p-8 backdrop-blur-md sm:grid-cols-[140px_1fr] sm:p-10"
            >
              <div
                className="relative aspect-square overflow-hidden rounded-xl"
                style={
                  project.image
                    ? undefined
                    : { backgroundColor: project.accent }
                }
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
                <h2 className="mt-2 text-xl font-medium text-foreground">
                  {project.title}
                </h2>
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
            href={VISIO_PAGE.href}
            className="inline-flex h-12 items-center justify-center rounded-full border border-border/70 bg-[var(--surface)] px-8 text-sm font-medium text-foreground backdrop-blur-md transition-colors hover:bg-[var(--surface-hover)]"
          >
            Discuter de votre projet
          </Link>
        </div>
      </div>
    </section>
  );
}

export function ProjectsExperience() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { introProgress, storyProgress, inIntro, scrollState, progress, reducedMotion } =
    useProjectsScroll(scrollRef);

  const introOpacity =
    introProgress < 0.65 ? 1 : 1 - (introProgress - 0.65) / 0.35;
  const introRise = Math.min(1, introProgress * 1.2) * 20;

  if (reducedMotion) {
    return <ProjectsStaticList />;
  }

  return (
    <>
      <section
        id="projects-experience"
        ref={scrollRef}
        className="relative"
        style={{ height: `${PROJECTS_TOTAL_SCROLL_VH}vh` }}
        aria-label="Projets récents"
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          <ProjectsCanvas
            progress={progress}
            activeIndex={scrollState.activeIndex}
            nextIndex={scrollState.nextIndex}
            textureBlend={scrollState.textureBlend}
            reducedMotion={reducedMotion}
          />

          <div
            className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-center px-8 sm:px-12 lg:px-20"
            style={{
              opacity: introOpacity,
              transform: `translate3d(0, ${-introRise}px, 0)`,
            }}
            aria-hidden={!inIntro}
          >
            <SectionLabel>Projets</SectionLabel>
            <h1 className="mt-6 max-w-2xl text-3xl tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Des livrables concrets, alignés sur les enjeux métier
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              Quelques missions récentes — faites défiler pour parcourir les
              réalisations.
            </p>
          </div>

          <ProjectPanels
            scrollState={scrollState}
            inIntro={inIntro}
            storyProgress={storyProgress}
          />

          {!inIntro && (
            <div className="absolute inset-x-0 bottom-10 z-10 px-8 lg:hidden">
              <p className="text-sm font-medium tracking-wide text-accent">
                <span className="text-2xl">
                  {String(scrollState.activeIndex + 1).padStart(2, "0")}
                </span>
                <span className="mx-2.5 text-soft-accent/60">/</span>
                <span>{String(RECENT_PROJECTS.length).padStart(2, "0")}</span>
              </p>
              <p className="mt-3 text-xs tracking-[0.2em] text-muted uppercase">
                {RECENT_PROJECTS[scrollState.activeIndex].client}
              </p>
              <h2 className="mt-3 text-xl tracking-tight text-foreground">
                {RECENT_PROJECTS[scrollState.activeIndex].title}
              </h2>
              <ProjectDetailLink
                slug={RECENT_PROJECTS[scrollState.activeIndex].slug}
                className="pointer-events-auto mt-5"
              />
            </div>
          )}
        </div>
      </section>

      <section className="px-8 py-20 sm:px-12 sm:py-28 lg:px-20">
        <div className="mx-auto max-w-5xl text-center">
          <Link
            href={VISIO_PAGE.href}
            className="inline-flex h-12 items-center justify-center rounded-full border border-border/70 bg-[var(--surface)] px-8 text-sm font-medium text-foreground backdrop-blur-md transition-colors hover:bg-[var(--surface-hover)]"
          >
            Discuter de votre projet
          </Link>
        </div>
      </section>
    </>
  );
}
