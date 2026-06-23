/** Réglages motion héros — sphère + caméra synchronisés */
export const HERO_SPHERE_Y_START = -3.7;
export const HERO_SPHERE_Y_END = 0;
/** Miroir de l’intro — la sphère repart vers le haut */
export const HERO_SPHERE_Y_EXIT_END = 3.7;

export const HERO_CAMERA = {
  zStart: 2.45,
  zEnd: 5.6,
  yStart: -0.12,
  yEnd: 0.15,
  fovStart: 26,
  fovEnd: 38,
  lookYStart: -1.95,
  lookYEnd: 0,
} as const;

/** Caméra outro — inverse de l’intro, regard vers le haut */
export const HERO_OUTRO_CAMERA = {
  zEnd: HERO_CAMERA.zStart,
  yEnd: -HERO_CAMERA.yStart,
  fovEnd: HERO_CAMERA.fovStart,
  lookYEnd: -HERO_CAMERA.lookYStart,
} as const;

/** Cadrage plus large à partir de l’étape 1 (après le héros) */
export const STORY_CAMERA = {
  z: 7.8,
  y: 0.12,
  fov: 43,
  lookY: 0,
} as const;

/** Cadrage mobile — sphère plus haute, caméra reculée */
export const MOBILE_CAMERA = {
  yOffset: 0.38,
  zOffset: 1.05,
  fovOffset: 6,
  lookYOffset: -0.12,
} as const;

export function lerpHero(
  start: number,
  end: number,
  heroProgress: number,
): number {
  return start + (end - start) * heroProgress;
}
