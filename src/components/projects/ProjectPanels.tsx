"use client";

import { PROJECT_COUNT, RECENT_PROJECTS } from "@/data/projects";
import type { ProjectScrollState } from "@/lib/projectsScroll";
import { ProjectDetailLink } from "./ProjectDetailLink";
import { ProjectScrollRail } from "./ProjectScrollRail";

const SCROLL_RAIL_INSET = "right-8 sm:right-12 lg:right-20";

function ProjectStepNumber({ index }: { index: number }) {
  return (
    <p className="text-sm font-medium tracking-wide text-accent">
      <span className="text-2xl">{String(index + 1).padStart(2, "0")}</span>
      <span className="mx-2.5 text-soft-accent/60">/</span>
      <span>{String(PROJECT_COUNT).padStart(2, "0")}</span>
    </p>
  );
}

interface ProjectPanelsProps {
  scrollState: ProjectScrollState;
  inIntro: boolean;
  storyProgress: number;
}

export function ProjectPanels({
  scrollState,
  inIntro,
  storyProgress,
}: ProjectPanelsProps) {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        {RECENT_PROJECTS.map((project, index) => {
          const opacity = inIntro ? 0 : scrollState.panelOpacity(index);
          const isActive = !inIntro && scrollState.activeIndex === index;

          return (
            <div
              key={project.slug}
              className={`absolute inset-0 flex flex-col justify-center pl-20 xl:pl-24 ${
                isActive ? "pointer-events-auto z-10" : "pointer-events-none z-0"
              }`}
              style={{ opacity }}
              aria-hidden={opacity < 0.05}
            >
              <div className="max-w-sm">
                <ProjectStepNumber index={index} />
                <p className="mt-8 text-xs tracking-[0.2em] text-muted uppercase">
                  {project.client}
                </p>
                <h2 className="mt-4 text-3xl tracking-tight text-foreground xl:text-6xl">
                  {project.title}
                </h2>
                <p className="mt-5 max-w-xs text-base text-muted">
                  {project.description}
                </p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-border/70 px-3 py-1 text-xs text-muted"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
                <span
                  className="mt-8 block h-1 w-12 rounded-full"
                  style={{ backgroundColor: project.accent }}
                  aria-hidden
                />
                {isActive && (
                  <ProjectDetailLink slug={project.slug} className="mt-8" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div
        className={`pointer-events-none absolute top-1/2 hidden -translate-y-1/2 flex-col items-end lg:flex ${SCROLL_RAIL_INSET} ${
          inIntro ? "opacity-0" : "opacity-100"
        } transition-opacity duration-500`}
      >
        <ProjectScrollRail
          activeIndex={scrollState.activeIndex}
          storyProgress={storyProgress}
        />
      </div>
    </>
  );
}
