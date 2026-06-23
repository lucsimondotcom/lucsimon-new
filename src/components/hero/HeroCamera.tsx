"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  getHeroOutroProgress,
  getStoryProgress,
  isInHeroIntro,
  isInStoryZones,
  STORY_CAMERA_RAMP,
} from "@/lib/scrollZones";
import {
  HERO_CAMERA,
  HERO_OUTRO_CAMERA,
  MOBILE_CAMERA,
  MOBILE_STORY_CAMERA,
  STORY_CAMERA,
  lerpHero,
} from "./heroMotion";

function isMobileViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 1024;
}

function applyMobileCamera(
  camY: number,
  camZ: number,
  lookY: number,
  fov: number,
  options: { storyWeight: number; outro?: boolean },
): { camY: number; camZ: number; lookY: number; fov: number } {
  if (!isMobileViewport()) {
    return { camY, camZ, lookY, fov };
  }

  const { storyWeight, outro = false } = options;

  if (storyWeight > 0) {
    const w = storyWeight;
    return {
      camY: camY + MOBILE_STORY_CAMERA.camYDelta * w,
      camZ: camZ + MOBILE_STORY_CAMERA.zOffset * w,
      lookY: lookY + MOBILE_STORY_CAMERA.lookYDelta * w,
      fov: fov + MOBILE_STORY_CAMERA.fovOffset * w,
    };
  }

  const touch = outro ? 0.55 : 1;
  return {
    camY: camY + MOBILE_CAMERA.yOffset * touch,
    camZ: camZ + MOBILE_CAMERA.zOffset * touch,
    lookY: lookY + MOBILE_CAMERA.lookYOffset * touch,
    fov: fov + MOBILE_CAMERA.fovOffset * touch,
  };
}

function smoothstep01(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

function getStoryMobileWeight(progress: number, storyT: number): number {
  if (isInStoryZones(progress)) return 1;
  return smoothstep01(storyT);
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

      const mobile = applyMobileCamera(camY, camZ, lookY, fov, {
        storyWeight: 0,
        outro: true,
      });
      camera.position.set(0, mobile.camY, mobile.camZ);
      lookTarget.current.set(0, mobile.lookY, 0);
      camera.lookAt(lookTarget.current);

      if (camera instanceof THREE.PerspectiveCamera) {
        camera.fov = mobile.fov;
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

    const storyWeight = getStoryMobileWeight(progress, storyT);
    const mobile = applyMobileCamera(camY, camZ, lookY, fov, { storyWeight });
    camera.position.set(0, mobile.camY, mobile.camZ);
    lookTarget.current.set(0, mobile.lookY, 0);
    camera.lookAt(lookTarget.current);

    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = mobile.fov;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
