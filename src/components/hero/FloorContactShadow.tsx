"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { theme } from "@/lib/designTokens";
import {
  floorShadowFragmentShader,
  floorShadowVertexShader,
} from "./floorShadowShaders";

function parseColor(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
}

interface FloorContactShadowProps {
  floorY: number;
  strength?: number;
}

export function FloorContactShadow({
  floorY,
  strength = 1,
}: FloorContactShadowProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uShadowCore: {
        value: new THREE.Vector3(...parseColor(theme.scene.shadowCore)),
      },
      uShadowMid: {
        value: new THREE.Vector3(...parseColor(theme.scene.floorShadow)),
      },
      uReflectionColor: {
        value: new THREE.Vector3(...parseColor(theme.scene.shadowReflection)),
      },
      uStrength: { value: strength },
    }),
    [strength],
  );

  useFrame(() => {
    if (matRef.current) {
      matRef.current.uniforms.uStrength.value = strength;
    }
  });

  return (
    <mesh
      position={[0, floorY + 0.002, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      renderOrder={-1}
    >
      <planeGeometry args={[3.2, 2.0, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={floorShadowVertexShader}
        fragmentShader={floorShadowFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        depthTest={false}
        blending={THREE.NormalBlending}
      />
    </mesh>
  );
}
