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
import { HeroOutro } from "./HeroOutro";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useSiteLoader } from "@/contexts/SiteLoaderContext";
import { TOTAL_SCROLL_HEIGHT_VH } from "@/lib/scrollZones";

function HeroCanvas({
  progress,
  heroProgress,
  reducedMotion,
}: {
  progress: number;
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
        <HeroCamera heroProgress={heroProgress} progress={progress} />
        <StorySphereScene
          progress={progress}
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
    progress,
    heroProgress,
    outroTextProgress,
    storyProgress,
    inHeroIntro,
    activeZone,
    zoneLocalProgress,
    reducedMotion,
  } = useScrollProgress(scrollRef);

  const scrollHeight = reducedMotion ? undefined : TOTAL_SCROLL_HEIGHT_VH;

  return (
    <section
      id="experience"
      ref={scrollRef}
      className="relative"
      style={{
        background: "var(--background-gradient)",
        ...(scrollHeight ? { height: `${scrollHeight}vh` } : {}),
      }}
      aria-label="Parcours"
    >
      <div
        className={
          reducedMotion
            ? "relative min-h-screen"
            : "sticky top-0 h-screen overflow-hidden"
        }
      >
        {!reducedMotion && (
          <HeroCanvas
            progress={progress}
            heroProgress={heroProgress}
            reducedMotion={reducedMotion}
          />
        )}
        <HeroIntro heroProgress={heroProgress} visible={!reducedMotion && inHeroIntro} />
        <HeroOutro textProgress={reducedMotion ? 0 : outroTextProgress} />
        <ScrollPanels
          progress={progress}
          activeZone={activeZone}
          zoneLocalProgress={zoneLocalProgress}
          storyProgress={storyProgress}
          inHeroIntro={inHeroIntro}
          outroTextProgress={outroTextProgress}
          reducedMotion={reducedMotion}
        />
      </div>
    </section>
  );
}
