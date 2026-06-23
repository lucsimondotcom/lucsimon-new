"use client";

import Image from "next/image";
import { RECENT_PROJECTS } from "@/data/projects";
import type { ProjectScrollState } from "@/lib/projectsScroll";

const SLIDER_INSET = "right-24 sm:right-32 lg:right-40 xl:right-48";

interface ProjectVisualSliderProps {
  scrollState: ProjectScrollState;
  inIntro: boolean;
}

export function ProjectVisualSlider({
  scrollState,
  inIntro,
}: ProjectVisualSliderProps) {
  if (inIntro) return null;

  return (
    <div
      className={`pointer-events-none absolute inset-y-0 hidden w-[min(38vw,480px)] items-center lg:flex ${SLIDER_INSET}`}
      aria-hidden
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border/50 bg-accent/10 shadow-[0_24px_80px_rgba(10,10,10,0.12)]">
        {RECENT_PROJECTS.map((project, index) => {
          const opacity = scrollState.panelOpacity(index);
          const imageSrc = project.image ?? project.detail.visuals[0]?.src;

          return (
            <div
              key={project.slug}
              className="absolute inset-0"
              style={{ opacity }}
            >
              {imageSrc ? (
                <Image
                  src={imageSrc}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 38vw, 0px"
                  priority={index === 0}
                />
              ) : (
                <div className="h-full w-full bg-accent" aria-hidden />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
