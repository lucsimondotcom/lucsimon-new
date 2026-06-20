"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  getProjectsStoryProgress,
  STORY_CAMERA_RAMP,
} from "@/lib/projectsScroll";
import { HERO_CAMERA, STORY_CAMERA } from "@/components/hero/heroMotion";

function smoothstep01(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

export function ProjectsCamera({ progress }: { progress: number }) {
  const { camera } = useThree();
  const lookTarget = useRef(new THREE.Vector3());

  useFrame(() => {
    const storyProgress = getProjectsStoryProgress(progress);
    const storyT = smoothstep01(
      Math.min(1, storyProgress / STORY_CAMERA_RAMP),
    );

    const camZ = THREE.MathUtils.lerp(HERO_CAMERA.zEnd, STORY_CAMERA.z, storyT);
    const camY = THREE.MathUtils.lerp(HERO_CAMERA.yEnd, STORY_CAMERA.y, storyT);
    const lookY = THREE.MathUtils.lerp(
      HERO_CAMERA.lookYEnd,
      STORY_CAMERA.lookY,
      storyT,
    );
    const fov = THREE.MathUtils.lerp(HERO_CAMERA.fovEnd, STORY_CAMERA.fov, storyT);

    camera.position.set(0, camY, camZ);
    lookTarget.current.set(0, lookY, 0);
    camera.lookAt(lookTarget.current);

    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
