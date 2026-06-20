import * as THREE from "three";

export const SPHERE_RADIUS = 1;
export const FLOOR_Y = -SPHERE_RADIUS - 0.02;
export const BUILD_CUBE_HALF = 1.25;
export const STORY_POINT_COUNT = 14;

const CORNER_SIGNS: ReadonlyArray<readonly [number, number, number]> = [
  [-1, -1, -1],
  [1, -1, -1],
  [-1, 1, -1],
  [1, 1, -1],
  [-1, -1, 1],
  [1, -1, 1],
  [-1, 1, 1],
  [1, 1, 1],
];

const FACE_CENTER_SIGNS: ReadonlyArray<readonly [number, number, number]> = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
];

export const STORY_POINT_SIGNS = [...CORNER_SIGNS, ...FACE_CENTER_SIGNS];

export const STORY_POINT_RADII = [
  ...CORNER_SIGNS.map(() => 0.05),
  ...FACE_CENTER_SIGNS.map(() => 0.042),
];

function signPosition(sign: readonly [number, number, number]): THREE.Vector3 {
  return new THREE.Vector3(
    sign[0] * BUILD_CUBE_HALF,
    sign[1] * BUILD_CUBE_HALF,
    sign[2] * BUILD_CUBE_HALF,
  );
}

function directionFromSign(sign: readonly [number, number, number]): THREE.Vector3 {
  return signPosition(sign).normalize();
}

export const ORBIT_RINGS = [
  { radius: 1.55, rotation: [0.6, 0.4, 0.2] as const, count: 5, offset: 0 },
  { radius: 1.85, rotation: [1.1, -0.3, 0.6] as const, count: 5, offset: 0.55 },
  { radius: 2.15, rotation: [-0.4, 0.8, -0.2] as const, count: 4, offset: 1.35 },
];

/** Vitesses de rotation par couche — effet électrons libres */
export const ORBIT_RING_SPEEDS = [0.55, -0.42, 0.32] as const;

const _orbitFrame = new THREE.Object3D();

function orbitRingMatrix(
  ringIndex: number,
  time: number,
  reducedMotion: boolean,
): THREE.Matrix4 {
  const ring = ORBIT_RINGS[ringIndex];
  const speed = ORBIT_RING_SPEEDS[ringIndex];
  _orbitFrame.position.set(0, 0, 0);
  _orbitFrame.rotation.set(ring.rotation[0], ring.rotation[1], ring.rotation[2]);
  if (!reducedMotion) {
    _orbitFrame.rotation.z += speed * time;
    _orbitFrame.rotation.y += speed * 0.35 * time;
  }
  _orbitFrame.updateMatrix();
  return _orbitFrame.matrix;
}

export function localOrbitPoint(
  ringIndex: number,
  angle: number,
  target: THREE.Vector3,
): THREE.Vector3 {
  const ring = ORBIT_RINGS[ringIndex];
  return target.set(
    Math.cos(angle) * ring.radius,
    Math.sin(angle) * ring.radius * 0.35,
    Math.sin(angle * 0.5) * ring.radius * 0.55,
  );
}

/** Point sur une orbite inclinée, avec rotation temporelle (électron) */
export function orbitElectronPoint(
  ringIndex: number,
  angle: number,
  time: number,
  reducedMotion: boolean,
  target = new THREE.Vector3(),
): THREE.Vector3 {
  localOrbitPoint(ringIndex, angle, target);
  return target.applyMatrix4(orbitRingMatrix(ringIndex, time, reducedMotion));
}

export function getPointRingAssignment(index: number): {
  ringIndex: number;
  angle: number;
} {
  let cursor = 0;
  for (let ringIndex = 0; ringIndex < ORBIT_RINGS.length; ringIndex++) {
    const ring = ORBIT_RINGS[ringIndex];
    if (index < cursor + ring.count) {
      const local = index - cursor;
      const angle = (local / ring.count) * Math.PI * 2 + ring.offset;
      return { ringIndex, angle };
    }
    cursor += ring.count;
  }
  return { ringIndex: 0, angle: 0 };
}

export function getRingPointIndices(): number[][] {
  const groups: number[][] = [];
  let cursor = 0;
  for (const ring of ORBIT_RINGS) {
    groups.push(
      Array.from({ length: ring.count }, (_, i) => cursor + i),
    );
    cursor += ring.count;
  }
  return groups;
}

export const RING_POINT_INDICES = getRingPointIndices();

/** Étape 1 — anneau au sol */
export function layoutPhase0(index: number): THREE.Vector3 {
  const angle = (index / STORY_POINT_COUNT) * Math.PI * 2;
  const radius = 1.75;
  return new THREE.Vector3(
    Math.cos(angle) * radius,
    FLOOR_Y + 0.06,
    Math.sin(angle) * radius,
  );
}

/** Étape 2 — électrons sur orbites inclinées autour du noyau */
export function layoutPhase1(
  index: number,
  time: number,
  reducedMotion: boolean,
  target = new THREE.Vector3(),
): THREE.Vector3 {
  const { ringIndex, angle } = getPointRingAssignment(index);
  return orbitElectronPoint(ringIndex, angle, time, reducedMotion, target);
}

/** Étape 3 — cube (coins + centres de faces) */
export function layoutPhase2Build(index: number): THREE.Vector3 {
  return signPosition(STORY_POINT_SIGNS[index]);
}

/** Étape 4 — déployés autour de la sphère */
export function layoutPhase3Deployed(index: number): THREE.Vector3 {
  return directionFromSign(STORY_POINT_SIGNS[index]).multiplyScalar(
    SPHERE_RADIUS + 1.35,
  );
}

/** Surface sphère (retrait avant déploiement) */
export function layoutPhase3Surface(index: number): THREE.Vector3 {
  return directionFromSign(STORY_POINT_SIGNS[index]).multiplyScalar(
    SPHERE_RADIUS * 0.9,
  );
}

/** Étape 5 — réseau de mesure sur la sphère */
export function layoutPhase4(
  index: number,
  target = new THREE.Vector3(),
): THREE.Vector3 {
  return target
    .copy(directionFromSign(STORY_POINT_SIGNS[index]))
    .multiplyScalar(SPHERE_RADIUS * 0.94);
}

export function smoothstep01(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

/** Position build → surface → deploy selon le mix lancement */
export function layoutBuildDeploy(
  index: number,
  launchMix: number,
  target: THREE.Vector3,
): THREE.Vector3 {
  const build = layoutPhase2Build(index);
  const surface = layoutPhase3Surface(index);
  const deployed = layoutPhase3Deployed(index);
  const retractEnd = 0.38;

  if (launchMix < 0.001) return target.copy(build);
  if (launchMix < retractEnd) {
    return target.copy(build).lerp(surface, smoothstep01(launchMix / retractEnd));
  }
  return target
    .copy(surface)
    .lerp(deployed, smoothstep01((launchMix - retractEnd) / (1 - retractEnd)));
}

/** Pré-calcul des layouts statiques par phase */
export const PHASE_LAYOUTS = {
  phase0: Array.from({ length: STORY_POINT_COUNT }, (_, i) => layoutPhase0(i)),
  phase1: Array.from({ length: STORY_POINT_COUNT }, (_, i) =>
    layoutPhase1(i, 0, true),
  ),
  phase4: Array.from({ length: STORY_POINT_COUNT }, (_, i) =>
    layoutPhase4(i),
  ),
};
