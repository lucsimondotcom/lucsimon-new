"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { theme } from "@/lib/designTokens";
import { floorShadowVertexShader } from "./floorShadowShaders";

const floorShadowFragmentShader = /* glsl */ `
uniform vec3 uShadowColor;
uniform vec3 uReflectionColor;
uniform float uStrength;

varying vec2 vUv;

void main() {
  vec2 c = vUv - 0.5;
  vec2 e = c * vec2(1.0, 0.46);
  float r = length(e) * 2.05;

  float core = smoothstep(0.72, 0.0, r);
  core = pow(core, 1.35);
  float halo = smoothstep(1.0, 0.18, r);
  halo = pow(halo, 2.2) * 0.55;
  float shadow = max(core, halo);

  float refl = smoothstep(0.42, 0.0, abs(c.y + 0.06));
  refl *= smoothstep(0.55, 0.02, abs(c.x));
  refl *= smoothstep(0.65, 0.08, r);
  refl = pow(refl, 1.6) * 0.45;

  vec3 color = uShadowColor * shadow + uReflectionColor * refl;
  float alpha = (shadow * 0.85 + refl * 0.5) * uStrength;
  gl_FragColor = vec4(color, alpha);
}
`;

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
      uShadowColor: { value: new THREE.Vector3(...parseColor(theme.scene.shadowCore)) },
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
      <planeGeometry args={[3.6, 2.2, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={floorShadowVertexShader}
        fragmentShader={floorShadowFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
