"use client";

import Link from "next/link";
import { RECENT_PROJECTS } from "@/data/projects";
import { LANDING_SECTIONS, sectionHref } from "@/data/siteNav";
import type { ProjectScrollState } from "@/lib/projectsScroll";
import { ProjectDetailLink } from "./ProjectDetailLink";
import { ProjectPanels } from "./ProjectPanels";
import { ProjectVisualSlider } from "./ProjectVisualSlider";

interface ProjectsSliderProps {
  storyProgress: number;
  inIntro: boolean;
  scrollState: ProjectScrollState;
}

export function ProjectsSlider({
  storyProgress,
  inIntro,
  scrollState,
}: ProjectsSliderProps) {
  return (
    <div className="relative z-10 h-full" aria-label="Projets récents">
      <ProjectPanels
        scrollState={scrollState}
        inIntro={inIntro}
        storyProgress={storyProgress}
      />

      <ProjectVisualSlider scrollState={scrollState} inIntro={inIntro} />

      {!inIntro && (
        <div className="absolute inset-x-0 bottom-10 z-10 px-8 lg:hidden">
          <p className="text-sm font-medium tracking-wide text-accent">
            <span className="text-2xl">
              {String(scrollState.activeIndex + 1).padStart(2, "0")}
            </span>
            <span className="mx-2.5 text-accent/40">/</span>
            <span>{String(RECENT_PROJECTS.length).padStart(2, "0")}</span>
          </p>
          <p className="mt-3 text-xs tracking-[0.2em] text-muted uppercase">
            {RECENT_PROJECTS[scrollState.activeIndex].client}
          </p>
          <h3 className="mt-3 text-xl tracking-tight text-foreground">
            {RECENT_PROJECTS[scrollState.activeIndex].title}
          </h3>
          <ProjectDetailLink
            slug={RECENT_PROJECTS[scrollState.activeIndex].slug}
            className="pointer-events-auto mt-5"
          />
        </div>
      )}

      {!inIntro && storyProgress > 0.92 && (
        <div className="pointer-events-auto absolute inset-x-0 bottom-8 z-20 hidden justify-center lg:flex">
          <Link
            href={sectionHref(LANDING_SECTIONS.visio)}
            className="inline-flex h-12 items-center justify-center rounded-full border border-border/70 bg-[var(--surface)] px-8 text-sm font-medium text-foreground backdrop-blur-md transition-colors hover:bg-[var(--surface-hover)]"
          >
            Discuter de votre projet
          </Link>
        </div>
      )}
    </div>
  );
}
