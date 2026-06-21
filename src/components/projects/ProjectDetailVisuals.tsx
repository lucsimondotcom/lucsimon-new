"use client";

import { useCallback, useEffect } from "react";
import Image from "next/image";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ProjectVisual } from "@/data/projects";
import { useSmoothScroll } from "@/contexts/SmoothScrollContext";

interface ProjectDetailVisualsProps {
  visuals: ProjectVisual[];
}

export function ProjectDetailVisuals({ visuals }: ProjectDetailVisualsProps) {
  const { lenis } = useSmoothScroll();

  const refreshScroll = useCallback(() => {
    lenis?.resize();
    ScrollTrigger.refresh();
  }, [lenis]);

  useEffect(() => {
    refreshScroll();
  }, [refreshScroll, visuals]);

  return (
    <section
      className="flex flex-col gap-8 lg:col-span-2 lg:py-8 lg:px-5"
      aria-label="Visuels du projet"
    >
      {visuals.map((visual) => (
        <figure key={`${visual.src}-${visual.alt}`} className="w-full rounded-lg overflow-hidden">
          <Image
            src={visual.src}
            alt={visual.alt}
            width={1600}
            height={1200}
            className="h-auto w-full"
            sizes="(max-width: 1024px) 100vw, 50vw"
            style={{ height: "auto" }}
            onLoad={refreshScroll}
          />
        </figure>
      ))}
    </section>
  );
}
