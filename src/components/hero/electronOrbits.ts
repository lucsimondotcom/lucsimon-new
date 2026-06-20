import * as THREE from "three";
import { STORY_POINT_COUNT } from "./storyPointLayouts";

export interface ElectronOrbitConfig {
  /** Demi-grand axe de l’ellipse (plan local XY) */
  radius: number;
  /** Rapport d’aspect — ellipse dans son plan, pas une courbe 3D tordue */
  aspect: number;
  rotation: [number, number, number];
  speed: number;
  startAngle: number;
  /** Opacité de la trajectoire (0–1, avant fade global) */
  lineOpacity: number;
  /** Opacité du point électron (0–1, avant fade global) */
  nodeOpacity: number;
}

function orbitVisualWeight(i: number, shell: number) {
  const lineRoll = (i * 11 + shell * 5) % 10;
  const lineOpacity =
    lineRoll < 4
      ? 0.16 + (i % 3) * 0.05
      : lineRoll < 7
        ? 0.38 + (i % 4) * 0.05
        : 0.62 + (i % 3) * 0.09;

  const nodeRoll = (i * 7 + shell * 3) % 10;
  const nodeOpacity =
    nodeRoll < 3
      ? 0.28 + (i % 2) * 0.08
      : nodeRoll < 7
        ? 0.52 + (i % 3) * 0.07
        : 0.76 + (i % 2) * 0.11;

  return { lineOpacity, nodeOpacity };
}

/** Une trajectoire unique par point — plans inclinés, rayons et vitesses variés */
export const ELECTRON_ORBITS: ElectronOrbitConfig[] = Array.from(
  { length: STORY_POINT_COUNT },
  (_, i) => {
    const golden = i * 2.399963;
    const shell = Math.floor(i / 5);
    const { lineOpacity, nodeOpacity } = orbitVisualWeight(i, shell);

    return {
      radius: 1.32 + (i % 5) * 0.14 + shell * 0.22,
      aspect: 0.55 + (i % 4) * 0.12,
      rotation: [
        0.25 + ((i * 0.53) % 1.35),
        golden % (Math.PI * 2) - Math.PI,
        ((i * 0.67) % 1.5) - 0.75,
      ],
      speed: (0.28 + (i % 6) * 0.09) * (i % 2 === 0 ? 1 : -1),
      startAngle: (i / STORY_POINT_COUNT) * Math.PI * 2 + (i % 3) * 0.85,
      lineOpacity,
      nodeOpacity,
    };
  },
);

/** Ellipse plane en XY — l’inclinaison vient de `rotation` sur le groupe */
export function electronOrbitLocalPoint(
  config: ElectronOrbitConfig,
  angle: number,
  target = new THREE.Vector3(),
): THREE.Vector3 {
  const ry = config.radius * config.aspect;
  return target.set(
    Math.cos(angle) * config.radius,
    Math.sin(angle) * ry,
    0,
  );
}

export function electronOrbitPath(
  config: ElectronOrbitConfig,
  segments = 128,
): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  const scratch = new THREE.Vector3();
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    pts.push(electronOrbitLocalPoint(config, angle, scratch.clone()));
  }
  return pts;
}
