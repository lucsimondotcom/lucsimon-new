"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { FloorContactShadow } from "@/components/hero/FloorContactShadow";
import { FLOOR_Y, SPHERE_RADIUS } from "@/components/hero/storyPointLayouts";
import { getProjectsTextureReveal } from "@/lib/projectsScroll";
import { ProjectsCamera } from "./ProjectsCamera";
import { ProjectsGlassSphere } from "./ProjectsGlassSphere";

interface ProjectsSceneProps {
  progress: number;
  activeIndex: number;
  nextIndex: number;
  textureBlend: number;
  reducedMotion: boolean;
}

export function ProjectsScene({
  progress,
  activeIndex,
  nextIndex,
  textureBlend,
  reducedMotion,
}: ProjectsSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const elapsedRef = useRef(0);
  const textureReveal = getProjectsTextureReveal(progress);

  useFrame((_, delta) => {
    if (!reducedMotion) elapsedRef.current += delta;
    const mesh = groupRef.current;
    if (!mesh || reducedMotion) return;
    mesh.rotation.y = Math.sin(elapsedRef.current * 0.45) * 0.04;
  });

  return (
    <>
      <ProjectsCamera progress={progress} />
      <group ref={groupRef}>
        <FloorContactShadow floorY={FLOOR_Y} strength={0.62} />
        <ProjectsGlassSphere
          radius={SPHERE_RADIUS}
          activeIndex={activeIndex}
          nextIndex={nextIndex}
          textureBlend={textureBlend}
          textureReveal={textureReveal}
        />
      </group>
    </>
  );
}
