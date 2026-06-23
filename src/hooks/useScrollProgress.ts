"use client";

import { useEffect, useState, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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

gsap.registerPlugin(ScrollTrigger);

function getPrefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export interface ScrollProgressState {
  progress: number;
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
  reducedMotion: boolean;
}

export function useScrollProgress(
  containerRef: RefObject<HTMLElement | null>,
): ScrollProgressState {
  const [progress, setProgress] = useState(0);
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
          const zone = getZoneState(p);
          setProgress(p);
          setHeroProgress(getHeroIntroProgress(p));
          setOutroProgress(getHeroOutroProgress(p));
          setOutroTextProgress(getHeroOutroTextOpacity(p));
          setStoryProgress(getStoryProgress(p));
          setInHeroIntro(isInHeroIntro(p));
          setInHeroBridge(isInHeroBridge(p));
          setInStoryZones(isInStoryZones(p));
          setBridgeTextOpacity(getHeroBridgeTextOpacity(p));
          setInHeroOutro(isInHeroOutro(p));
          setActiveZone(zone.zoneIndex);
          setZoneLocalProgress(zone.zoneLocalProgress);
        },
      });
    }, container);

    return () => ctx.revert();
  }, [containerRef, reducedMotion]);

  return {
    progress,
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
    reducedMotion,
  };
}
