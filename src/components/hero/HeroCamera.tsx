"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  getHeroOutroProgress,
  getStoryProgress,
  isInHeroIntro,
  STORY_CAMERA_RAMP,
} from "@/lib/scrollZones";
import { HERO_CAMERA, HERO_OUTRO_CAMERA, STORY_CAMERA, lerpHero } from "./heroMotion";

function smoothstep01(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

export function HeroCamera({
  heroProgress,
  progress,
}: {
  heroProgress: number;
  progress: number;
}) {
  const { camera } = useThree();
  const lookTarget = useRef(new THREE.Vector3());

  useFrame(() => {
    const outroT = getHeroOutroProgress(progress);

    if (outroT > 0) {
      const camZ = THREE.MathUtils.lerp(STORY_CAMERA.z, HERO_OUTRO_CAMERA.zEnd, outroT);
      const camY = THREE.MathUtils.lerp(STORY_CAMERA.y, HERO_OUTRO_CAMERA.yEnd, outroT);
      const lookY = THREE.MathUtils.lerp(
        STORY_CAMERA.lookY,
        HERO_OUTRO_CAMERA.lookYEnd,
        outroT,
      );
      const fov = THREE.MathUtils.lerp(STORY_CAMERA.fov, HERO_OUTRO_CAMERA.fovEnd, outroT);

      camera.position.set(0, camY, camZ);
      lookTarget.current.set(0, lookY, 0);
      camera.lookAt(lookTarget.current);

      if (camera instanceof THREE.PerspectiveCamera) {
        camera.fov = fov;
        camera.updateProjectionMatrix();
      }
      return;
    }

    const heroCamZ = lerpHero(HERO_CAMERA.zStart, HERO_CAMERA.zEnd, heroProgress);
    const heroCamY = lerpHero(HERO_CAMERA.yStart, HERO_CAMERA.yEnd, heroProgress);
    const heroLookY = lerpHero(HERO_CAMERA.lookYStart, HERO_CAMERA.lookYEnd, heroProgress);
    const heroFov = lerpHero(HERO_CAMERA.fovStart, HERO_CAMERA.fovEnd, heroProgress);

    const storyT = isInHeroIntro(progress)
      ? 0
      : smoothstep01(Math.min(1, getStoryProgress(progress) / STORY_CAMERA_RAMP));

    const camZ = THREE.MathUtils.lerp(heroCamZ, STORY_CAMERA.z, storyT);
    const camY = THREE.MathUtils.lerp(heroCamY, STORY_CAMERA.y, storyT);
    const lookY = THREE.MathUtils.lerp(heroLookY, STORY_CAMERA.lookY, storyT);
    const fov = THREE.MathUtils.lerp(heroFov, STORY_CAMERA.fov, storyT);

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
