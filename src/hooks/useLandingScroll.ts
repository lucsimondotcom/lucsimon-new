"use client";

import { useEffect, useState, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  splitLandingProgress,
  type LandingPhase,
} from "@/lib/landingScroll";
import {
  getHeroBridgeTextOpacity,
  getHeroIntroProgress,
  getHeroOutroProgress,
  getHeroOutroTextOpacity,
  getStoryProgress,
  getZoneState,
  isInHeroBridge,
  isInHeroIntro,
  isInHeroOutro,
  isInStoryZones,
} from "@/lib/scrollZones";
import { snapLandingProgress } from "@/lib/landingSnapPoints";
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

export interface LandingScrollState {
  landingProgress: number;
  phase: LandingPhase;
  methodProgress: number;
  projectsProgress: number;
  reducedMotion: boolean;
  heroProgress: number;
  outroProgress: number;
  outroTextProgress: number;
  storyProgress: number;
  inHeroIntro: boolean;
  inHeroBridge: boolean;
  inStoryZones: boolean;
  bridgeTextOpacity: number;
  inHeroOutro: boolean;
  activeZone: number;
  zoneLocalProgress: number;
  projectsIntroProgress: number;
  projectsStoryProgress: number;
  inProjectsIntro: boolean;
  projectScrollState: ProjectScrollState;
}

export function useLandingScroll(
  containerRef: RefObject<HTMLElement | null>,
): LandingScrollState {
  const [landingProgress, setLandingProgress] = useState(0);
  const [phase, setPhase] = useState<LandingPhase>("method");
  const [methodProgress, setMethodProgress] = useState(0);
  const [projectsProgress, setProjectsProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  const [heroProgress, setHeroProgress] = useState(0);
  const [outroProgress, setOutroProgress] = useState(0);
  const [outroTextProgress, setOutroTextProgress] = useState(0);
  const [storyProgress, setStoryProgress] = useState(0);
  const [inHeroIntro, setInHeroIntro] = useState(true);
  const [inHeroBridge, setInHeroBridge] = useState(false);
  const [inStoryZones, setInStoryZones] = useState(false);
  const [bridgeTextOpacity, setBridgeTextOpacity] = useState(0);
  const [inHeroOutro, setInHeroOutro] = useState(false);
  const [activeZone, setActiveZone] = useState(0);
  const [zoneLocalProgress, setZoneLocalProgress] = useState(0);

  const [projectsIntroProgress, setProjectsIntroProgress] = useState(0);
  const [projectsStoryProgress, setProjectsStoryProgress] = useState(0);
  const [inProjectsIntro, setInProjectsIntro] = useState(true);
  const [projectScrollState, setProjectScrollState] = useState<ProjectScrollState>(
    () => getProjectScrollState(0),
  );

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
      setLandingProgress(0);
      setPhase("method");
      setMethodProgress(0);
      setProjectsProgress(0);
      setHeroProgress(1);
      setOutroProgress(0);
      setOutroTextProgress(0);
      setStoryProgress(0);
      setInHeroIntro(false);
      setInHeroBridge(false);
      setInStoryZones(false);
      setBridgeTextOpacity(0);
      setInHeroOutro(false);
      setActiveZone(0);
      setZoneLocalProgress(0);
      setProjectsIntroProgress(1);
      setProjectsStoryProgress(0);
      setInProjectsIntro(false);
      setProjectScrollState(getProjectScrollState(0));
      return;
    }

    const touchDevice =
      window.matchMedia("(pointer: coarse)").matches ||
      window.innerWidth < 1024;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        snap: touchDevice
          ? {
              snapTo: (progress) =>
                snapLandingProgress(progress, { touch: true }),
              duration: { min: 0.28, max: 0.55 },
              delay: 0.14,
              ease: "power2.out",
              directional: true,
            }
          : {
              snapTo: (progress) => snapLandingProgress(progress),
              duration: { min: 0.4, max: 0.72 },
              delay: 0.06,
              ease: "power2.inOut",
              directional: false,
            },
        onUpdate: (self) => {
          const landing = self.progress;
          const split = splitLandingProgress(landing);
          const methodP =
            split.phase === "projects" ? 1 : split.methodProgress;
          const zone = getZoneState(methodP);

          setLandingProgress(landing);
          setPhase(split.phase);
          setMethodProgress(split.methodProgress);
          setProjectsProgress(split.projectsProgress);

          setHeroProgress(getHeroIntroProgress(methodP));
          setOutroProgress(getHeroOutroProgress(methodP));
          setOutroTextProgress(getHeroOutroTextOpacity(methodP));
          setStoryProgress(getStoryProgress(methodP));
          setInHeroIntro(isInHeroIntro(methodP));
          setInHeroBridge(isInHeroBridge(methodP));
          setInStoryZones(isInStoryZones(methodP));
          setBridgeTextOpacity(getHeroBridgeTextOpacity(methodP));
          setInHeroOutro(isInHeroOutro(methodP));
          setActiveZone(zone.zoneIndex);
          setZoneLocalProgress(zone.zoneLocalProgress);

          setProjectsIntroProgress(getProjectsIntroProgress(split.projectsProgress));
          setProjectsStoryProgress(getProjectsStoryProgress(split.projectsProgress));
          setInProjectsIntro(isInProjectsIntro(split.projectsProgress));
          setProjectScrollState(getProjectScrollState(split.projectsProgress));
        },
      });
    }, container);

    return () => ctx.revert();
  }, [containerRef, reducedMotion]);

  return {
    landingProgress,
    phase,
    methodProgress,
    projectsProgress,
    reducedMotion,
    heroProgress,
    outroProgress,
    outroTextProgress,
    storyProgress,
    inHeroIntro,
    inHeroBridge,
    inStoryZones,
    bridgeTextOpacity,
    inHeroOutro,
    activeZone,
    zoneLocalProgress,
    projectsIntroProgress,
    projectsStoryProgress,
    inProjectsIntro,
    projectScrollState,
  };
}
