"use client";

import Image from "next/image";
import { RECENT_PROJECTS } from "@/data/projects";
import type { ProjectScrollState } from "@/lib/projectsScroll";

const DESKTOP_INSET = "right-24 sm:right-32 lg:right-40 xl:right-48";

function ProjectVisualFrame({
  scrollState,
  className = "",
  imageSizes,
}: {
  scrollState: ProjectScrollState;
  className?: string;
  imageSizes: string;
}) {
  return (
    <div
      className={`relative aspect-[4/5] overflow-hidden rounded-2xl border border-border/50 bg-accent/10 shadow-[0_24px_80px_rgba(10,10,10,0.12)] ${className}`}
    >
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
                sizes={imageSizes}
                priority={index === 0}
              />
            ) : (
              <div className="h-full w-full bg-accent" aria-hidden />
            )}
          </div>
        );
      })}
    </div>
  );
}

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
    <>
      <div
        className="pointer-events-none absolute inset-x-0 top-14 bottom-[44%] z-[1] flex items-end justify-center px-10 lg:hidden"
        aria-hidden
      >
        <ProjectVisualFrame
          scrollState={scrollState}
          className="w-full max-w-[200px] sm:max-w-[220px]"
          imageSizes="(max-width: 640px) 200px, 220px"
        />
      </div>

      <div
        className={`pointer-events-none absolute inset-y-0 hidden w-[min(38vw,480px)] items-center lg:flex ${DESKTOP_INSET}`}
        aria-hidden
      >
        <ProjectVisualFrame
          scrollState={scrollState}
          className="w-full"
          imageSizes="(min-width: 1024px) 38vw, 0px"
        />
      </div>
    </>
  );
}
