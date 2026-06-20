"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { theme } from "@/lib/designTokens";
import {
  STORY_POINT_COUNT,
  STORY_POINT_RADII,
  layoutBuildDeploy,
  layoutPhase4,
  smoothstep01,
} from "./storyPointLayouts";
import { ElectronShells } from "./ElectronShells";

const ORBIT_LINE = theme.scene.orbitLine;
const ORBIT_NODE = theme.scene.orbitNode;

const PLEXUS_EDGES: [number, number][] = [
  [0, 1], [0, 2], [0, 4], [1, 3], [1, 5], [2, 3], [2, 6], [3, 7],
  [4, 5], [4, 6], [5, 7], [6, 7],
  [0, 8], [1, 8], [2, 10], [3, 10], [4, 9], [5, 9], [6, 11], [7, 11],
  [8, 10], [8, 12], [9, 11], [9, 12], [10, 13], [11, 13], [12, 13],
];

function phaseDominance(weight: number, others: number[]): number {
  const competition = others.reduce((sum, w) => sum + w, 0);
  if (weight < 0.02) return 0;
  return weight / (weight + competition + 0.001);
}

const DATA_CARD_ANCHORS = [
  {
    position: [2.05, 0.55, 0.25] as const,
    title: "Trafic",
    value: "24,8K",
  },
  {
    position: [-1.85, 0.45, 0.45] as const,
    title: "Conversion",
    value: "3,62 %",
  },
  {
    position: [1.65, -0.55, -0.35] as const,
    title: "Revenus",
    value: "18,7K €",
  },
  {
    position: [-1.45, -0.35, 0.15] as const,
    title: "Engagement",
    value: "72 %",
    opacityScale: 0.9,
  },
] as const;

interface StoryPointsProps {
  weights: number[];
  reducedMotion: boolean;
}

export function StoryPoints({ weights, reducedMotion }: StoryPointsProps) {
  const [w0, w1, w2, w3, w4] = weights;
  const visible = w1 + w2 + w3 + w4;
  const laterPhases = w2 + w3 + w4;

  const electronWorldRef = useRef<(THREE.Vector3 | null)[]>(
    Array.from({ length: STORY_POINT_COUNT }, () => null),
  );
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const tetherRef = useRef<THREE.LineSegments>(null);
  const plexusRef = useRef<THREE.LineSegments>(null);
  const elapsedRef = useRef(0);

  const blended = useMemo(() => new THREE.Vector3(), []);
  const buildDeployScratch = useMemo(() => new THREE.Vector3(), []);
  const wobble = useMemo(() => new THREE.Vector3(), []);
  const phase4Scratch = useMemo(() => new THREE.Vector3(), []);

  const tetherBuffer = useMemo(
    () => new Float32Array(STORY_POINT_COUNT * 2 * 3),
    [],
  );

  const plexusBuffer = useMemo(
    () => new Float32Array(PLEXUS_EDGES.length * 2 * 3),
    [],
  );

  const emergeT =
    w0 + w1 > 0.001 ? smoothstep01(w1 / (w0 + w1)) : 1;
  const showBlendMeshes = laterPhases > 0.02;

  useFrame((_, delta) => {
    if (!showBlendMeshes) return;

    if (!reducedMotion) elapsedRef.current += delta;
    const time = elapsedRef.current;
    const inv = visible > 0.001 ? 1 / visible : 0;
    const nw4 = w4 * inv;
    const buildDeployWeight = w2 + w3;
    const nwBuildDeploy = buildDeployWeight * inv;
    const launchMix =
      buildDeployWeight > 0.001 ? w3 / buildDeployWeight : 0;
    const positions: THREE.Vector3[] = [];
    const measurePositions: THREE.Vector3[] = [];

    for (let i = 0; i < STORY_POINT_COUNT; i++) {
      const mesh = meshRefs.current[i];
      if (!mesh) continue;

      if (buildDeployWeight > 0.001) {
        layoutBuildDeploy(i, launchMix, buildDeployScratch);
      } else {
        buildDeployScratch.set(0, 0, 0);
      }

      blended.set(0, 0, 0);

      const electronPos = electronWorldRef.current[i];
      if (electronPos) {
        blended.addScaledVector(electronPos, w1 * inv);
      }

      blended.addScaledVector(buildDeployScratch, nwBuildDeploy);
      layoutPhase4(i, phase4Scratch);
      blended.addScaledVector(phase4Scratch, nw4);
      measurePositions.push(phase4Scratch.clone());

      if (
        !reducedMotion &&
        w3 > 0.55 &&
        w4 < 0.25 &&
        buildDeployWeight > 0.001 &&
        launchMix > 0.82
      ) {
        wobble.set(
          Math.sin(time * 1.1 + i * 0.9) * 0.035,
          Math.cos(time * 0.95 + i * 1.1) * 0.035,
          Math.sin(time * 1.05 + i * 0.7) * 0.035,
        );
        blended.add(wobble);
      }

      mesh.position.copy(blended);
      positions.push(blended.clone());

      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.min(0.95, laterPhases * 0.92);
    }

    const tetherDom = phaseDominance(w3, [w1, w2, w4]);
    const tether = tetherRef.current;
    if (tether && positions.length === STORY_POINT_COUNT) {
      const attr = tether.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < positions.length; i++) {
        attr.setXYZ(i * 2, 0, 0, 0);
        attr.setXYZ(i * 2 + 1, positions[i].x, positions[i].y, positions[i].z);
      }
      attr.needsUpdate = true;
      const tetherMat = tether.material as THREE.LineBasicMaterial;
      tetherMat.opacity =
        w3 > 0.04 ? w3 * 0.32 * smoothstep01(w3) * tetherDom : 0;
    }

    const plexusDom = phaseDominance(w4, [w1, w2, w3]);
    const plexus = plexusRef.current;
    if (plexus && measurePositions.length === STORY_POINT_COUNT) {
      const attr = plexus.geometry.attributes.position as THREE.BufferAttribute;

      PLEXUS_EDGES.forEach(([i, j], seg) => {
        const a = measurePositions[i];
        const b = measurePositions[j];
        attr.setXYZ(seg * 2, a.x, a.y, a.z);
        attr.setXYZ(seg * 2 + 1, b.x, b.y, b.z);
      });

      attr.needsUpdate = true;
      const plexusMat = plexus.material as THREE.LineBasicMaterial;
      plexusMat.opacity = w4 > 0.05 ? w4 * 0.38 * plexusDom : 0;
    }
  });

  if (visible < 0.01 && w1 < 0.01) return null;

  return (
    <group>
      <ElectronShells
        opacity={w1 * Math.max(0, 1 - laterPhases)}
        emergeT={emergeT}
        reducedMotion={reducedMotion}
        worldPositionsRef={electronWorldRef}
      />

      {showBlendMeshes &&
        Array.from({ length: STORY_POINT_COUNT }, (_, i) => (
          <mesh
            key={i}
            ref={(el) => {
              meshRefs.current[i] = el;
            }}
          >
            <sphereGeometry args={[STORY_POINT_RADII[i], 12, 12]} />
            <meshBasicMaterial
              color={ORBIT_NODE}
              transparent
              opacity={0}
              depthWrite={false}
            />
          </mesh>
        ))}

      {w4 > 0.08 &&
        DATA_CARD_ANCHORS.map((card) => (
          <Html
            key={card.title}
            position={[...card.position]}
            center
            style={{ pointerEvents: "none" }}
            distanceFactor={6}
          >
            <div
              className="w-28 rounded-xl border border-border bg-[var(--surface-card)] px-3.5 py-2.5 backdrop-blur-md"
              style={{
                opacity:
                  w4 *
                  0.9 *
                  ("opacityScale" in card ? card.opacityScale : 1),
              }}
            >
              <p className="text-[9px] tracking-wide text-muted uppercase">
                {card.title}
              </p>
              <p className="mt-1.5 text-sm font-medium text-foreground">
                {card.value}
              </p>
              <div className="mt-2.5 flex h-6 items-end gap-0.5">
                {[40, 65, 45, 80, 55, 90].map((h, j) => (
                  <span
                    key={j}
                    className="w-1 rounded-sm bg-soft-accent/55"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </Html>
        ))}

      {showBlendMeshes && (
        <>
          <lineSegments ref={tetherRef}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[tetherBuffer, 3]}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color={ORBIT_LINE}
              transparent
              opacity={0}
              depthWrite={false}
            />
          </lineSegments>

          <lineSegments ref={plexusRef}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[plexusBuffer, 3]}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color={ORBIT_LINE}
              transparent
              opacity={0}
              depthWrite={false}
            />
          </lineSegments>
        </>
      )}
    </group>
  );
}
