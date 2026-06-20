"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { theme } from "@/lib/designTokens";
import { STORY_POINT_RADII } from "./storyPointLayouts";
import {
  ELECTRON_ORBITS,
  electronOrbitLocalPoint,
  electronOrbitPath,
} from "./electronOrbits";

const ORBIT_LINE = theme.scene.orbitLine;
const ORBIT_NODE = theme.scene.orbitNode;

interface ElectronShellsProps {
  opacity: number;
  emergeT: number;
  reducedMotion: boolean;
  worldPositionsRef: React.MutableRefObject<(THREE.Vector3 | null)[]>;
}

function ElectronOrbit({
  index,
  opacity,
  emergeT,
  reducedMotion,
  worldPositionsRef,
}: {
  index: number;
  opacity: number;
  emergeT: number;
  reducedMotion: boolean;
  worldPositionsRef: React.MutableRefObject<(THREE.Vector3 | null)[]>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const config = ELECTRON_ORBITS[index];
  const linePoints = useMemo(() => electronOrbitPath(config), [config]);
  const localScratch = useMemo(() => new THREE.Vector3(), []);
  const worldScratch = useMemo(() => new THREE.Vector3(), []);
  const startPos = useMemo(
    () => electronOrbitLocalPoint(config, config.startAngle, new THREE.Vector3()),
    [config],
  );

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group || opacity < 0.01) return;

    if (!reducedMotion) {
      group.rotation.z += config.speed * delta;
      group.rotation.y += config.speed * 0.35 * delta;
    }

    group.scale.setScalar(emergeT);
    group.updateMatrixWorld(true);

    localScratch.copy(startPos).applyMatrix4(group.matrixWorld);
    worldScratch.copy(localScratch);

    if (!worldPositionsRef.current[index]) {
      worldPositionsRef.current[index] = new THREE.Vector3();
    }
    worldPositionsRef.current[index]!.copy(worldScratch);
  });

  if (opacity < 0.01) return null;

  const lineAlpha = opacity * emergeT * config.lineOpacity;
  const pointAlpha = opacity * emergeT * config.nodeOpacity;

  return (
    <group ref={groupRef} rotation={config.rotation}>
      <Line
        points={linePoints}
        color={ORBIT_LINE}
        lineWidth={1.1}
        transparent
        opacity={lineAlpha}
        depthWrite={false}
      />
      <mesh position={startPos}>
        <sphereGeometry args={[STORY_POINT_RADII[index], 12, 12]} />
        <meshBasicMaterial
          color={ORBIT_NODE}
          transparent
          opacity={pointAlpha}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export function ElectronShells({
  opacity,
  emergeT,
  reducedMotion,
  worldPositionsRef,
}: ElectronShellsProps) {
  if (opacity < 0.01) return null;

  return (
    <>
      {ELECTRON_ORBITS.map((_, index) => (
        <ElectronOrbit
          key={index}
          index={index}
          opacity={opacity}
          emergeT={emergeT}
          reducedMotion={reducedMotion}
          worldPositionsRef={worldPositionsRef}
        />
      ))}
    </>
  );
}
