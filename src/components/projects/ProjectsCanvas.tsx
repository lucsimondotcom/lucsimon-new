"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { HERO_CAMERA } from "@/components/hero/heroMotion";
import { ProjectsScene } from "./ProjectsScene";

interface ProjectsCanvasProps {
  progress: number;
  activeIndex: number;
  nextIndex: number;
  textureBlend: number;
  reducedMotion: boolean;
}

export function ProjectsCanvas({
  progress,
  activeIndex,
  nextIndex,
  textureBlend,
  reducedMotion,
}: ProjectsCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

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
      setMouse({ x: x * 0.18, y: y * 0.12 });
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
          position: [0, HERO_CAMERA.yEnd, HERO_CAMERA.zEnd],
          fov: HERO_CAMERA.fovEnd,
        }}
        dpr={[1, 1.25]}
        frameloop={shouldAnimate ? "always" : "demand"}
        onCreated={({ gl, camera }) => {
          gl.setClearColor(0x000000, 0);
          camera.lookAt(0, HERO_CAMERA.lookYEnd, 0);
        }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
      >
        <Suspense fallback={null}>
          <group rotation={[mouse.y * 0.06, mouse.x * 0.1, 0]}>
            <ProjectsScene
              progress={progress}
              activeIndex={activeIndex}
              nextIndex={nextIndex}
              textureBlend={textureBlend}
              reducedMotion={reducedMotion}
            />
          </group>
        </Suspense>
      </Canvas>
    </div>
  );
}
