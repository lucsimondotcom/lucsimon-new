"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sphereVertexShader, sphereFragmentShader } from "./sphereShaders";

interface GlassSphereProps {
  radius: number;
  fadeMix: number;
  glowMix: number;
}

const SEGMENTS = 48;

export function GlassSphere({
  radius,
  fadeMix,
  glowMix,
}: GlassSphereProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uGlowMix: { value: 0 },
      uFadeMix: { value: 0 },
    }),
    [],
  );

  useFrame(() => {
    const mat = matRef.current;
    if (!mat) return;
    mat.uniforms.uGlowMix.value = glowMix;
    mat.uniforms.uFadeMix.value = fadeMix;
  });

  return (
    <>
      {/* Masque de profondeur — légèrement reculé (polygonOffset) pour éviter le z-fighting */}
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
          vertexShader={sphereVertexShader}
          fragmentShader={sphereFragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
        />
      </mesh>
    </>
  );
}
