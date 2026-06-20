"use client";

import { useEffect, useState, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  getProjectScrollState,
  getProjectsIntroProgress,
  getProjectsStoryProgress,
  isInProjectsIntro,
  type ProjectScrollState,
} from "@/lib/projectsScroll";

gsap.registerPlugin(ScrollTrigger);

function getPrefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export interface ProjectsScrollResult {
  progress: number;
  introProgress: number;
  storyProgress: number;
  inIntro: boolean;
  scrollState: ProjectScrollState;
  reducedMotion: boolean;
}

export function useProjectsScroll(
  containerRef: RefObject<HTMLElement | null>,
): ProjectsScrollResult {
  const [progress, setProgress] = useState(0);
  const [introProgress, setIntroProgress] = useState(0);
  const [storyProgress, setStoryProgress] = useState(0);
  const [inIntro, setInIntro] = useState(true);
  const [scrollState, setScrollState] = useState<ProjectScrollState>(() =>
    getProjectScrollState(0),
  );
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(motionQuery.matches);
    updateMotion();
    motionQuery.addEventListener("change", updateMotion);
    return () => motionQuery.removeEventListener("change", updateMotion);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (getPrefersReducedMotion()) {
      setProgress(0);
      setIntroProgress(1);
      setStoryProgress(0.2);
      setInIntro(false);
      setScrollState(getProjectScrollState(0.2));
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          setProgress(p);
          setIntroProgress(getProjectsIntroProgress(p));
          setStoryProgress(getProjectsStoryProgress(p));
          setInIntro(isInProjectsIntro(p));
          setScrollState(getProjectScrollState(p));
        },
      });
    }, container);

    return () => ctx.revert();
  }, [containerRef, reducedMotion]);

  return {
    progress,
    introProgress,
    storyProgress,
    inIntro,
    scrollState,
    reducedMotion,
  };
}
