"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { StorySphereScene } from "./StorySphereScene";
import { theme } from "@/lib/designTokens";
import { HeroCamera } from "./HeroCamera";
import { HERO_CAMERA } from "./heroMotion";
import { ScrollPanels } from "./ScrollPanels";
import { HeroIntro } from "./HeroIntro";
import { HeroBridge } from "./HeroBridge";
import { HeroOutro } from "./HeroOutro";
import { useLandingScroll } from "@/hooks/useLandingScroll";
import { useSiteLoader } from "@/contexts/SiteLoaderContext";
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

function HeroCanvas({
  methodProgress,
  heroProgress,
  reducedMotion,
}: {
  methodProgress: number;
  heroProgress: number;
  reducedMotion: boolean;
}) {
  const { signalExperienceReady } = useSiteLoader();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const experienceSignaled = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.05 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handlePointerMove = useCallback(
    (event: React.PointerEvent) => {
      if (reducedMotion) return;
      const rect = event.currentTarget.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      setMouse({ x: x * 0.22, y: y * 0.15 });
    },
    [reducedMotion],
  );

  const shouldAnimate = !reducedMotion && visible;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      onPointerMove={handlePointerMove}
      aria-hidden="true"
    >
      <Canvas
        camera={{
          position: [0, HERO_CAMERA.yStart, HERO_CAMERA.zStart],
          fov: HERO_CAMERA.fovStart,
        }}
        dpr={[1, 1.25]}
        frameloop={shouldAnimate ? "always" : "demand"}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          if (!experienceSignaled.current) {
            experienceSignaled.current = true;
            requestAnimationFrame(() => {
              requestAnimationFrame(() => signalExperienceReady());
            });
          }
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.92,
        }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.42} color={theme.lights.ambient} />
        <directionalLight position={[3, 5, 4]} intensity={0.5} color={theme.lights.key} />
        <directionalLight position={[-2, 2, 3]} intensity={0.22} color={theme.lights.fill} />
        <HeroCamera heroProgress={heroProgress} progress={methodProgress} />
        <StorySphereScene
          progress={methodProgress}
          heroProgress={heroProgress}
          mouse={mouse}
          reducedMotion={reducedMotion}
        />
      </Canvas>
    </div>
  );
}

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
        ...(scrollHeight ? { height: `${scrollHeight}vh` } : {}),
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
