"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import {
  getPhaseWeights,
  getHeroGlassFade,
  getHeroOutroProgress,
} from "@/lib/scrollZones";
import { theme } from "@/lib/designTokens";
import {
  HERO_SPHERE_Y_END,
  HERO_SPHERE_Y_EXIT_END,
  HERO_SPHERE_Y_START,
} from "./heroMotion";
import { GlassSphere } from "./GlassSphere";
import { FloorContactShadow } from "./FloorContactShadow";
import { StoryPoints } from "./StoryPoints";
import { FLOOR_Y, SPHERE_RADIUS } from "./storyPointLayouts";

export { SCENE_BG } from "@/lib/designTokens";

const ORBIT_LINE = theme.scene.orbitLine;
const FLOOR_RING = theme.scene.floorRing;
const FLOOR_RING_OUTER = theme.scene.floorRingOuter;
const FLOOR_DOT = theme.scene.floorDot;
const BUILD_CUBE_SCALE = 2.5;

/** Croix sur chaque face (arêtes au milieu des faces), géométrie unitaire 1×1×1 */
function createCubeFaceCrossPositions(): Float32Array {
  const h = 0.5;
  const pairs: [THREE.Vector3, THREE.Vector3][] = [
    [new THREE.Vector3(h, -h, 0), new THREE.Vector3(h, h, 0)],
    [new THREE.Vector3(h, 0, -h), new THREE.Vector3(h, 0, h)],
    [new THREE.Vector3(-h, -h, 0), new THREE.Vector3(-h, h, 0)],
    [new THREE.Vector3(-h, 0, -h), new THREE.Vector3(-h, 0, h)],
    [new THREE.Vector3(-h, h, 0), new THREE.Vector3(h, h, 0)],
    [new THREE.Vector3(0, h, -h), new THREE.Vector3(0, h, h)],
    [new THREE.Vector3(-h, -h, 0), new THREE.Vector3(h, -h, 0)],
    [new THREE.Vector3(0, -h, -h), new THREE.Vector3(0, -h, h)],
    [new THREE.Vector3(-h, 0, h), new THREE.Vector3(h, 0, h)],
    [new THREE.Vector3(0, -h, h), new THREE.Vector3(0, h, h)],
    [new THREE.Vector3(-h, 0, -h), new THREE.Vector3(h, 0, -h)],
    [new THREE.Vector3(0, -h, -h), new THREE.Vector3(0, h, -h)],
  ];

  const positions = new Float32Array(pairs.length * 2 * 3);
  pairs.forEach(([a, b], i) => {
    positions.set([a.x, a.y, a.z, b.x, b.y, b.z], i * 6);
  });
  return positions;
}

const CUBE_FACE_CROSS_POSITIONS = createCubeFaceCrossPositions();

function lineOpacity(weight: number) {
  return Math.min(0.48, Math.max(0, 0.2 + weight * 0.28));
}

function FloorDotGrid({ opacity }: { opacity: number }) {
  const positions = useMemo(() => {
    const pts: number[] = [];
    const rings = 8;
    const step = 0.42;
    for (let x = -rings; x <= rings; x++) {
      for (let z = -rings; z <= rings; z++) {
        const dist = Math.hypot(x, z);
        if (dist > rings || dist < 1.8) continue;
        pts.push(x * step, -SPHERE_RADIUS - 0.04, z * step);
      }
    }
    return new Float32Array(pts);
  }, []);

  if (opacity < 0.01) return null;

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={FLOOR_DOT}
        size={0.022}
        transparent
        opacity={opacity * 0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

interface StorySphereSceneProps {
  progress: number;
  heroProgress: number;
  mouse: { x: number; y: number };
  reducedMotion: boolean;
}

function GroundRipples({
  opacity,
  reducedMotion,
}: {
  opacity: number;
  reducedMotion: boolean;
}) {
  const RIPPLE_COUNT = 4;
  const CYCLE = 3.4;
  const MAX_SCALE = 3.4;
  const rippleRefs = useRef<(THREE.Group | null)[]>([]);
  const materialRefs = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const elapsedRef = useRef(0);

  useFrame((_, delta) => {
    if (opacity < 0.01 || reducedMotion) return;

    elapsedRef.current += delta;
    const time = elapsedRef.current;

    for (let i = 0; i < RIPPLE_COUNT; i++) {
      const group = rippleRefs.current[i];
      const mat = materialRefs.current[i];
      if (!group || !mat) continue;

      const phase = (time / CYCLE + i / RIPPLE_COUNT) % 1;
      const scale = 0.35 + phase * MAX_SCALE;
      const alpha = (1 - phase) ** 1.6 * lineOpacity(opacity);

      group.scale.set(scale, scale, 1);
      mat.opacity = alpha;
    }
  });

  if (opacity < 0.01) return null;

  return (
    <>
      {Array.from({ length: RIPPLE_COUNT }, (_, i) => (
        <group
          key={i}
          ref={(el) => {
            rippleRefs.current[i] = el;
          }}
        >
          <mesh>
            <ringGeometry args={[0.992, 1, 96]} />
            <meshBasicMaterial
              ref={(el) => {
                materialRefs.current[i] = el;
              }}
              color={ORBIT_LINE}
              transparent
              opacity={0}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}
    </>
  );
}

export function StorySphereScene({
  progress,
  heroProgress,
  mouse,
  reducedMotion,
}: StorySphereSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const elapsedRef = useRef(0);
  const weights = getPhaseWeights(progress);

  const [w0, w1, w2, w3, w4] = weights;

  const floorY = FLOOR_Y;
  const outroProgress = getHeroOutroProgress(progress);
  const inOutro = outroProgress > 0;
  const outroFloorFade = inOutro ? 1 - outroProgress : 1;
  const shadowStrength =
    0.62 * Math.max(0.15, 1 - w4 * 0.55) * outroFloorFade;
  const heroGlassFade = getHeroGlassFade(progress);

  useFrame((_, delta) => {
    if (!reducedMotion) elapsedRef.current += delta;
    const t = reducedMotion ? 0 : elapsedRef.current;

    if (groupRef.current) {
      const introY = THREE.MathUtils.lerp(
        HERO_SPHERE_Y_START,
        HERO_SPHERE_Y_END,
        heroProgress,
      );
      const exitY = inOutro
        ? THREE.MathUtils.lerp(0, HERO_SPHERE_Y_EXIT_END, outroProgress)
        : 0;
      const floatY =
        heroProgress >= 1 && !inOutro && !reducedMotion
          ? Math.sin(t * 0.45) * 0.025
          : 0;

      groupRef.current.position.y = introY + exitY + floatY;
      const outroScale = 1 + outroProgress * 0.28;
      groupRef.current.scale.setScalar(outroScale);
      groupRef.current.rotation.y = mouse.x * 0.08;
      groupRef.current.rotation.x = mouse.y * 0.04;
    }
  });

  return (
    <group ref={groupRef}>
      {heroProgress >= 1 && (
        <FloorContactShadow floorY={floorY} strength={shadowStrength} />
      )}

      {heroProgress >= 1 && outroFloorFade > 0.01 && (
        <>
          <FloorDotGrid opacity={outroFloorFade} />
          <mesh position={[0, floorY + 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.82, 1.08, 64]} />
            <meshBasicMaterial
              color={FLOOR_RING}
              transparent
              opacity={0.38 * outroFloorFade}
              depthWrite={false}
            />
          </mesh>
          <mesh position={[0, floorY + 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.05, 1.35, 64]} />
            <meshBasicMaterial
              color={FLOOR_RING_OUTER}
              transparent
              opacity={0.16 * outroFloorFade}
              depthWrite={false}
            />
          </mesh>
          <mesh position={[0, floorY + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.3, 1.65, 64]} />
            <meshBasicMaterial
              color={FLOOR_RING_OUTER}
              transparent
              opacity={0.07 * outroFloorFade}
              depthWrite={false}
            />
          </mesh>
        </>
      )}

      <group position={[0, floorY, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <GroundRipples opacity={w0} reducedMotion={reducedMotion} />
      </group>

      <Line
        points={[
          new THREE.Vector3(0, floorY, 0),
          new THREE.Vector3(0, 0, 0),
        ]}
        color={ORBIT_LINE}
        lineWidth={1}
        transparent
        opacity={lineOpacity(w0)}
      />

      <GlassSphere
        radius={SPHERE_RADIUS}
        fadeMix={Math.max(heroGlassFade, w4)}
        glowMix={w3}
      />

      {w2 > 0.01 && (
        <mesh>
          <sphereGeometry args={[SPHERE_RADIUS * 1.003, 32, 32]} />
          <meshBasicMaterial
            color={ORBIT_LINE}
            wireframe
            transparent
            opacity={w2 * 0.55}
          />
        </mesh>
      )}

      {w2 > 0.01 && (
        <>
          <lineSegments scale={BUILD_CUBE_SCALE}>
            <edgesGeometry args={[new THREE.BoxGeometry(1, 1, 1)]} />
            <lineBasicMaterial
              color={ORBIT_LINE}
              transparent
              opacity={w2 * 0.65}
            />
          </lineSegments>
          <lineSegments scale={BUILD_CUBE_SCALE}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[CUBE_FACE_CROSS_POSITIONS, 3]}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color={ORBIT_LINE}
              transparent
              opacity={w2 * 0.42}
              depthWrite={false}
            />
          </lineSegments>
        </>
      )}

      <StoryPoints weights={weights} reducedMotion={reducedMotion} />

      {w3 > 0.08 && (
        <mesh>
          <sphereGeometry args={[SPHERE_RADIUS * (1.02 + w3 * 0.06), 32, 32]} />
          <meshBasicMaterial
            color={ORBIT_LINE}
            transparent
            opacity={w3 * 0.07}
            depthWrite={false}
          />
        </mesh>
      )}

    </group>
  );
}
