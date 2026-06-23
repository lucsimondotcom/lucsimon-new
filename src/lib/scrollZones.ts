import { palette } from "./designTokens";

/** Hauteur unique pour chaque segment du parcours méthode */
export const ZONE_VH = 180;

export const SCROLL_ZONES = [
  { id: "understanding", label: "Comprendre", heightVh: ZONE_VH, type: "static" as const },
  { id: "strategizing", label: "Structurer", heightVh: ZONE_VH, type: "static" as const },
  { id: "building", label: "Construire", heightVh: ZONE_VH, type: "static" as const },
  { id: "launching", label: "Lancer", heightVh: ZONE_VH, type: "static" as const },
  { id: "measuring", label: "Mesurer", heightVh: ZONE_VH, type: "static" as const },
];

export type ZoneType = "static";

export interface ScrollZone {
  id: string;
  label: string;
  heightVh: number;
  type: ZoneType;
}

const STORY_SCROLL_HEIGHT_VH = SCROLL_ZONES.reduce(
  (sum, zone) => sum + zone.heightVh,
  0,
);

export const HERO_INTRO_VH = ZONE_VH;
export const HERO_BRIDGE_VH = ZONE_VH;
export const HERO_OUTRO_VH = ZONE_VH;

/** Portion de zone pour le fondu texte (entrée / sortie) — identique partout */
export const READ_FADE = 0.18;
/** Portion de zone pour le crossfade 3D entre étapes story */
export const PHASE_FADE = 0.4;
/** Centre du plateau de lecture — identique pour chaque snap */
export const ZONE_SNAP_HOLD = 0.5;
/** Début du parcours : fondu hero → étape 01 (part du story progress 0→1) */
export const HERO_STORY_BLEND = 0.08;
/** Dézoom caméra après le hero (part du story progress 0→1) */
export const STORY_CAMERA_RAMP = 0.14;

export const TOTAL_SCROLL_HEIGHT_VH =
  HERO_INTRO_VH + HERO_BRIDGE_VH + STORY_SCROLL_HEIGHT_VH + HERO_OUTRO_VH;

export const HERO_INTRO_RATIO = HERO_INTRO_VH / TOTAL_SCROLL_HEIGHT_VH;
export const HERO_BRIDGE_RATIO = HERO_BRIDGE_VH / TOTAL_SCROLL_HEIGHT_VH;
export const HERO_BRIDGE_START_RATIO = HERO_INTRO_RATIO;
export const HERO_BRIDGE_END_RATIO = HERO_INTRO_RATIO + HERO_BRIDGE_RATIO;
export const HERO_OUTRO_RATIO = HERO_OUTRO_VH / TOTAL_SCROLL_HEIGHT_VH;
export const STORY_START_RATIO = HERO_BRIDGE_END_RATIO;
export const STORY_END_RATIO = 1 - HERO_OUTRO_RATIO;

export interface ZoneState {
  zoneIndex: number;
  zoneLocalProgress: number;
  zoneStart: number;
  zoneEnd: number;
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

function smoothstep(t: number): number {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
}

/** Opacité de lecture — même courbe pour bridge, story et outro */
export function zoneReadOpacity(localProgress: number): number {
  const p = clamp01(localProgress);
  if (p < READ_FADE) return p / READ_FADE;
  if (p > 1 - READ_FADE) return (1 - p) / READ_FADE;
  return 1;
}

function getSegmentLocalProgress(
  overallProgress: number,
  startRatio: number,
  spanRatio: number,
): number {
  if (spanRatio <= 0) return 0;
  return clamp01((clamp01(overallProgress) - startRatio) / spanRatio);
}

/** Progression 0→1 pendant la zone héros (sphère qui monte depuis le bas) */
export function getHeroIntroProgress(overallProgress: number): number {
  const p = clamp01(overallProgress);
  if (p >= HERO_INTRO_RATIO) return 1;
  return easeOutCubic(p / HERO_INTRO_RATIO);
}

export function getHeroBridgeProgress(overallProgress: number): number {
  return getSegmentLocalProgress(
    overallProgress,
    HERO_BRIDGE_START_RATIO,
    HERO_BRIDGE_RATIO,
  );
}

export function getHeroOutroLocalProgress(overallProgress: number): number {
  return getSegmentLocalProgress(
    overallProgress,
    STORY_END_RATIO,
    HERO_OUTRO_RATIO,
  );
}

export function getHeroBridgeTextOpacity(overallProgress: number): number {
  if (!isInHeroBridge(overallProgress)) return 0;
  return zoneReadOpacity(getHeroBridgeProgress(overallProgress));
}

export function getHeroOutroTextOpacity(overallProgress: number): number {
  if (!isInHeroOutro(overallProgress)) return 0;
  return zoneReadOpacity(getHeroOutroLocalProgress(overallProgress));
}

/** @deprecated Alias — préférer getHeroOutroTextOpacity */
export function getHeroOutroTextProgress(overallProgress: number): number {
  return getHeroOutroTextOpacity(overallProgress);
}

export function isHeroOutroTextVisible(overallProgress: number): boolean {
  return getHeroOutroTextOpacity(overallProgress) > 0;
}

/** Progression 0→1 pour l’outro 3D — linéaire sur la zone outro */
export function getHeroOutroProgress(overallProgress: number): number {
  if (!isInHeroOutro(overallProgress)) return 0;
  return easeOutCubic(getHeroOutroLocalProgress(overallProgress));
}

/** Progression 0→1 pour les 5 étapes du parcours (entre intro et outro) */
export function getStoryProgress(overallProgress: number): number {
  const p = clamp01(overallProgress);
  if (p <= STORY_START_RATIO) return 0;
  if (p >= STORY_END_RATIO) return 1;
  return (p - STORY_START_RATIO) / (STORY_END_RATIO - STORY_START_RATIO);
}

export function isInHeroIntro(overallProgress: number): boolean {
  return clamp01(overallProgress) < HERO_INTRO_RATIO;
}

export function isInHeroBridge(overallProgress: number): boolean {
  const p = clamp01(overallProgress);
  return p >= HERO_BRIDGE_START_RATIO && p < HERO_BRIDGE_END_RATIO;
}

export function isInStoryZones(overallProgress: number): boolean {
  const p = clamp01(overallProgress);
  return p >= STORY_START_RATIO && p < STORY_END_RATIO;
}

export function isInHeroOutro(overallProgress: number): boolean {
  return clamp01(overallProgress) >= STORY_END_RATIO;
}

export function getZoneState(overallProgress: number): ZoneState {
  const storyProgress = getStoryProgress(overallProgress);
  let accumulatedVh = 0;

  for (let i = 0; i < SCROLL_ZONES.length; i++) {
    const zone = SCROLL_ZONES[i];
    const start = accumulatedVh / STORY_SCROLL_HEIGHT_VH;
    accumulatedVh += zone.heightVh;
    const end = accumulatedVh / STORY_SCROLL_HEIGHT_VH;

    if (storyProgress <= end || i === SCROLL_ZONES.length - 1) {
      const local = end > start ? (storyProgress - start) / (end - start) : 0;
      return {
        zoneIndex: i,
        zoneLocalProgress: clamp01(local),
        zoneStart: start,
        zoneEnd: end,
      };
    }
  }

  const last = SCROLL_ZONES.length - 1;
  return {
    zoneIndex: last,
    zoneLocalProgress: 1,
    zoneStart: 1,
    zoneEnd: 1,
  };
}

function phaseCrossfade(localP: number, fadePortion: number): number {
  return smoothstep(localP / fadePortion);
}

export function getStaticZoneOpacity(
  targetZone: number,
  overallProgress: number,
): number {
  if (!isInStoryZones(overallProgress)) return 0;

  const { zoneIndex, zoneLocalProgress } = getZoneState(overallProgress);
  if (zoneIndex !== targetZone) return 0;

  return zoneReadOpacity(zoneLocalProgress);
}

/**
 * Opacité verre hero (étape 0) — fondu progressif vers le parcours
 */
export function getHeroGlassFade(overallProgress: number): number {
  if (isInHeroIntro(overallProgress)) return 1;
  if (isInHeroBridge(overallProgress)) {
    const bridgeP = getHeroBridgeProgress(overallProgress);
    return Math.max(0, 1 - smoothstep(bridgeP / READ_FADE));
  }
  const storyP = getStoryProgress(overallProgress);
  return Math.max(0, 1 - smoothstep(storyP / HERO_STORY_BLEND));
}

const SPHERE_FADE_STORY = 0.3;
const SPHERE_FADE_MEASURING = 0.14;

export function getSphereFadeMix(overallProgress: number): number {
  const heroGlassFade = getHeroGlassFade(overallProgress);

  if (isInHeroOutro(overallProgress)) {
    const outroT = getHeroOutroProgress(overallProgress);
    return Math.max(heroGlassFade, outroT * 0.92);
  }

  if (!isInStoryZones(overallProgress)) {
    return heroGlassFade;
  }

  const { zoneIndex } = getZoneState(overallProgress);
  const lastZone = SCROLL_ZONES.length - 1;

  if (heroGlassFade > 0.02) {
    return heroGlassFade;
  }

  if (zoneIndex === lastZone) {
    return SPHERE_FADE_MEASURING;
  }

  return SPHERE_FADE_STORY;
}

/**
 * Poids de mélange pour chaque phase 3D (0–4).
 * Crossfade en fin de zone — même logique pour toutes les transitions story.
 */
export function getPhaseWeights(overallProgress: number): number[] {
  if (isInHeroIntro(overallProgress) || isInHeroBridge(overallProgress)) {
    return new Array(SCROLL_ZONES.length).fill(0);
  }

  if (isInHeroOutro(overallProgress)) {
    const weights = new Array(SCROLL_ZONES.length).fill(0);
    const outroT = getHeroOutroProgress(overallProgress);
    const lastZone = SCROLL_ZONES.length - 1;
    weights[lastZone] = 1 - smoothstep(outroT / PHASE_FADE);
    return weights;
  }

  const storyProgress = getStoryProgress(overallProgress);

  if (storyProgress < HERO_STORY_BLEND) {
    const weights = new Array(SCROLL_ZONES.length).fill(0);
    weights[0] = smoothstep(storyProgress / HERO_STORY_BLEND);
    return weights;
  }

  const { zoneIndex, zoneLocalProgress } = getZoneState(overallProgress);
  const weights = new Array(SCROLL_ZONES.length).fill(0);
  const p = zoneLocalProgress;
  const fade = PHASE_FADE;

  if (p > 1 - fade && zoneIndex < SCROLL_ZONES.length - 1) {
    weights[zoneIndex] = phaseCrossfade(1 - p, fade);
    weights[zoneIndex + 1] = 1 - weights[zoneIndex];
  } else {
    weights[zoneIndex] = 1;
  }

  return weights;
}

/** Progression 0→1 du check pour une tâche (apparition séquentielle au scroll) */
export function getTaskCheckProgress(
  taskIndex: number,
  taskCount: number,
  zoneLocalProgress: number,
): number {
  if (taskCount <= 0) return 0;

  const start = READ_FADE * 0.6;
  const usable = 1 - READ_FADE * 1.1;
  const band = usable / taskCount;
  const threshold = start + band * taskIndex;

  return smoothstep((zoneLocalProgress - threshold) / (band * 0.55));
}

const BG_BLEND_RATIO = 0.022;

function lerpChannel(a: number, b: number, t: number): number {
  return Math.round(a + (b - a) * t);
}

function lerpHex(hexA: string, hexB: string, t: number): string {
  const blend = clamp01(t);
  const parse = (hex: string) => {
    const h = hex.replace("#", "");
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16),
    ] as const;
  };
  const [r1, g1, b1] = parse(hexA);
  const [r2, g2, b2] = parse(hexB);
  const r = lerpChannel(r1, r2, blend);
  const g = lerpChannel(g1, g2, blend);
  const b = lerpChannel(b1, b2, blend);
  return `rgb(${r}, ${g}, ${b})`;
}

function blendAt(
  p: number,
  edge: number,
  from: string,
  to: string,
): string {
  const half = BG_BLEND_RATIO;
  if (p < edge - half) return from;
  if (p > edge + half) return to;
  const t = smoothstep((p - (edge - half)) / (half * 2));
  return lerpHex(from, to, t);
}

/** Fond de scène : transitions uniquement aux frontières de zone */
export function getHeroSceneBackground(overallProgress: number): string {
  const p = clamp01(overallProgress);
  const { white, black, blue } = palette;

  if (p < HERO_INTRO_RATIO) {
    return blendAt(p, HERO_INTRO_RATIO, white, black);
  }
  if (p < HERO_BRIDGE_END_RATIO) {
    return blendAt(p, HERO_BRIDGE_END_RATIO, black, blue);
  }
  if (p < STORY_END_RATIO) {
    return blue;
  }
  return blendAt(p, STORY_END_RATIO + HERO_OUTRO_RATIO, blue, white);
}

/** Texte outro blanc sur bleu — le fond ne passe au blanc qu’en fin de zone */
export function getHeroOutroTextInverted(overallProgress: number): boolean {
  return getHeroOutroLocalProgress(overallProgress) < 1 - READ_FADE;
}

/** Progression méthode au centre d’une zone (pour snap) */
export function getMethodSnapProgress(
  segmentStartRatio: number,
  segmentSpanRatio: number,
  localHold = ZONE_SNAP_HOLD,
): number {
  return segmentStartRatio + segmentSpanRatio * localHold;
}
