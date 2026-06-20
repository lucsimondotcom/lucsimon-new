"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  projectsGlassFragmentShader,
  projectsGlassVertexShader,
} from "./projectsGlassShaders";
import { GlassSphere } from "@/components/hero/GlassSphere";
import { useProjectTextures } from "./useProjectTextures";

const SEGMENTS = 48;
const FALLBACK_TEXTURE = new THREE.Texture();

interface ProjectsGlassSphereProps {
  radius: number;
  activeIndex: number;
  nextIndex: number;
  textureBlend: number;
  textureReveal: number;
}

export function ProjectsGlassSphere({
  radius,
  activeIndex,
  nextIndex,
  textureBlend,
  textureReveal,
}: ProjectsGlassSphereProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const textures = useProjectTextures();

  const uniforms = useMemo(
    () => ({
      uGlowMix: { value: 0 },
      uTextureMix: { value: 0 },
      uTextureBlend: { value: 0 },
      uMapA: { value: FALLBACK_TEXTURE },
      uMapB: { value: FALLBACK_TEXTURE },
    }),
    [],
  );

  useFrame(() => {
    const mat = matRef.current;
    if (!mat || !textures) return;

    mat.uniforms.uGlowMix.value = 0;
    mat.uniforms.uTextureMix.value = textureReveal;
    mat.uniforms.uTextureBlend.value = textureBlend;
    mat.uniforms.uMapA.value = textures[activeIndex];
    mat.uniforms.uMapB.value = textures[nextIndex];
  });

  if (!textures) {
    return <GlassSphere radius={radius} fadeMix={1} glowMix={0} />;
  }

  return (
    <>
      <mesh>
        <sphereGeometry args={[radius, SEGMENTS, SEGMENTS]} />
        <meshBasicMaterial
          colorWrite={false}
          depthWrite
          polygonOffset
          polygonOffsetFactor={1}
          polygonOffsetUnits={4}
        />
      </mesh>
      <mesh renderOrder={1}>
        <sphereGeometry args={[radius, SEGMENTS, SEGMENTS]} />
        <shaderMaterial
          ref={matRef}
          vertexShader={projectsGlassVertexShader}
          fragmentShader={projectsGlassFragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
        />
      </mesh>
    </>
  );
}
