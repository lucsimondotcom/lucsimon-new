"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { ScrollPanels } from "./ScrollPanels";
import { HeroIntro } from "./HeroIntro";
import { HeroBridge } from "./HeroBridge";
import { HeroOutro } from "./HeroOutro";
import { useLandingScroll } from "@/hooks/useLandingScroll";
import {
  getLandingSceneBackground,
  LANDING_IMMERSIVE_SCROLL_VH,
  METHOD_SCROLL_VH,
} from "@/lib/landingScroll";
import {
  getHeroOutroTextInverted,
} from "@/lib/scrollZones";
import { ProjectsSlider } from "@/components/projects/ProjectsSlider";
import { ProjectsStaticList } from "@/components/projects/ProjectsStaticList";

const HeroCanvas = dynamic(
  () => import("./HeroCanvas").then((mod) => mod.HeroCanvas),
  { ssr: false },
);

export function HolographicSystemHero() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const {
    landingProgress,
    phase,
    methodProgress,
    reducedMotion,
    heroProgress,
    outroTextProgress,
    storyProgress,
    inHeroIntro,
    inHeroBridge,
    inStoryZones,
    bridgeTextOpacity,
    activeZone,
    zoneLocalProgress,
    projectsStoryProgress,
    inProjectsIntro,
    projectScrollState,
  } = useLandingScroll(scrollRef);

  const scrollHeight = reducedMotion ? undefined : LANDING_IMMERSIVE_SCROLL_VH;
  const showMethodUi = phase === "method";
  const showProjectsUi = phase === "projects";

  if (reducedMotion) {
    return (
      <section id="methode" className="scroll-mt-12 bg-background lg:scroll-mt-16">
        <div className="relative min-h-screen">
          <ScrollPanels
            progress={0}
            activeZone={0}
            zoneLocalProgress={0}
            storyProgress={0}
            inHeroIntro={false}
            inHeroBridge={false}
            inStoryZones={false}
            reducedMotion
          />
        </div>
        <ProjectsStaticList />
      </section>
    );
  }

  return (
    <section
      id="methode"
      ref={scrollRef}
      className="relative scroll-mt-12 lg:scroll-mt-16"
      style={{
        ...(scrollHeight
          ? { height: `${scrollHeight}vh`, minHeight: `${scrollHeight}vh` }
          : { minHeight: "100vh" }),
      }}
      aria-label="Parcours"
    >
      <div
        id="projets"
        className="pointer-events-none absolute left-0 h-px w-px scroll-mt-12 lg:scroll-mt-16"
        style={{ top: `${METHOD_SCROLL_VH}vh` }}
        aria-hidden
      />

      <div
        className="sticky top-0 h-screen overflow-hidden"
        style={{ backgroundColor: getLandingSceneBackground(landingProgress) }}
      >
      
        <HeroCanvas
          methodProgress={methodProgress}
          heroProgress={heroProgress}
          reducedMotion={reducedMotion}
        />
  

        {showMethodUi && (
          <>
            <HeroIntro heroProgress={heroProgress} visible={inHeroIntro} />
            <HeroBridge textOpacity={bridgeTextOpacity} />
            <HeroOutro
              textOpacity={outroTextProgress}
              inverted={getHeroOutroTextInverted(methodProgress)}
            />
            <ScrollPanels
              progress={methodProgress}
              activeZone={activeZone}
              zoneLocalProgress={zoneLocalProgress}
              storyProgress={storyProgress}
              inHeroIntro={inHeroIntro}
              inHeroBridge={inHeroBridge}
              inStoryZones={inStoryZones}
              reducedMotion={false}
            />
          </>
        )}

        {showProjectsUi && (
          <ProjectsSlider
            storyProgress={projectsStoryProgress}
            inIntro={inProjectsIntro}
            scrollState={projectScrollState}
          />
        )}
      </div>
    </section>
  );
}
