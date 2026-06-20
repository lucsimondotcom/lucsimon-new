export const HERO_INTRO_VH = 110;
export const HERO_OUTRO_VH = 110;

export const SCROLL_ZONES = [
  { id: "understanding", label: "Comprendre", heightVh: 180, type: "static" as const },
  { id: "strategizing", label: "Structurer", heightVh: 180, type: "static" as const },
  { id: "building", label: "Construire", heightVh: 180, type: "static" as const },
  { id: "launching", label: "Lancer", heightVh: 180, type: "static" as const },
  { id: "measuring", label: "Mesurer", heightVh: 180, type: "static" as const },
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

/** Portion de zone pour le fondu du texte (entrée / sortie) */
export const READ_FADE = 0.22;
/** Portion de zone pour le crossfade 3D entre étapes */
export const PHASE_FADE = 0.44;
/** Début du parcours : fondu hero → étape 01 (part du story progress 0→1) */
export const HERO_STORY_BLEND = 0.08;
/** Dézoom caméra après le hero (part du story progress 0→1) */
export const STORY_CAMERA_RAMP = 0.14;

export const TOTAL_SCROLL_HEIGHT_VH =
  HERO_INTRO_VH + STORY_SCROLL_HEIGHT_VH + HERO_OUTRO_VH;

export const HERO_INTRO_RATIO = HERO_INTRO_VH / TOTAL_SCROLL_HEIGHT_VH;
export const HERO_OUTRO_RATIO = HERO_OUTRO_VH / TOTAL_SCROLL_HEIGHT_VH;
export const STORY_START_RATIO = HERO_INTRO_RATIO;
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

/** Progression 0→1 pendant la zone héros (sphère qui monte depuis le bas) */
export function getHeroIntroProgress(overallProgress: number): number {
  const p = clamp01(overallProgress);
  if (p >= HERO_INTRO_RATIO) return 1;
  return easeOutCubic(p / HERO_INTRO_RATIO);
}

/** Outro 3D — démarre avant la fin du parcours (sphère monte / caméra se rapproche) */
const OUTRO_VISUAL_LEAD_RATIO = HERO_OUTRO_RATIO * 0.22;
/** Mesurer disparaît avant la zone outro texte */
const MEASURING_TEXT_FADE_END_IN_ZONE = 0.38;
/** Pause sphère seule entre Mesurer et le texte outro */
const OUTRO_TEXT_START_IN_ZONE = 0.54;

/** Opacité du texte « Mesurer » — doit être à 0 avant le texte outro */
export function getMeasuringTextOpacity(overallProgress: number): number {
  const p = clamp01(overallProgress);
  const fadeStart = STORY_END_RATIO - OUTRO_VISUAL_LEAD_RATIO;
  const fadeEnd = STORY_END_RATIO + HERO_OUTRO_RATIO * MEASURING_TEXT_FADE_END_IN_ZONE;
  if (p <= fadeStart) return 1;
  if (p >= fadeEnd) return 0;
  return 1 - smoothstep((p - fadeStart) / (fadeEnd - fadeStart));
}

export function getHeroOutroTextProgress(overallProgress: number): number {
  const p = clamp01(overallProgress);
  const outroEnd = STORY_END_RATIO + HERO_OUTRO_RATIO;
  const textStart = STORY_END_RATIO + HERO_OUTRO_RATIO * OUTRO_TEXT_START_IN_ZONE;
  if (p <= textStart) return 0;
  if (p >= outroEnd) return 1;
  return (p - textStart) / (outroEnd - textStart);
}

export function isHeroOutroTextVisible(overallProgress: number): boolean {
  return getHeroOutroTextProgress(overallProgress) > 0;
}

/** Progression 0→1 pour l’outro 3D (sphère + caméra), avec avance sur le parcours */
export function getHeroOutroProgress(overallProgress: number): number {
  const p = clamp01(overallProgress);
  const start = STORY_END_RATIO - OUTRO_VISUAL_LEAD_RATIO;
  const end = STORY_END_RATIO + HERO_OUTRO_RATIO;
  if (p <= start) return 0;
  if (p >= end) return 1;
  const linear = (p - start) / (end - start);
  return easeOutCubic(linear);
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

const READ_FADE_LOCAL = READ_FADE;
const PHASE_FADE_LOCAL = PHASE_FADE;

function smoothstep(t: number): number {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
}

function phaseCrossfade(localP: number, fadePortion: number): number {
  return smoothstep(localP / fadePortion);
}

export function getStaticZoneOpacity(
  targetZone: number,
  overallProgress: number,
): number {
  if (isInHeroIntro(overallProgress)) {
    return 0;
  }

  const { zoneIndex, zoneLocalProgress } = getZoneState(overallProgress);
  if (zoneIndex !== targetZone) return 0;

  const lastZone = SCROLL_ZONES.length - 1;
  const p = zoneLocalProgress;

  if (targetZone === 0) {
    if (p > 1 - READ_FADE_LOCAL) return (1 - p) / READ_FADE_LOCAL;
    return 1;
  }

  if (targetZone === lastZone) {
    let opacity = p < READ_FADE_LOCAL ? p / READ_FADE_LOCAL : 1;
    opacity *= getMeasuringTextOpacity(overallProgress);
    return opacity;
  }

  if (p < READ_FADE_LOCAL) return p / READ_FADE_LOCAL;
  if (p > 1 - READ_FADE_LOCAL) return (1 - p) / READ_FADE_LOCAL;
  return 1;
}

/**
 * Opacité verre hero (étape 0) — fondu progressif vers le parcours
 */
export function getHeroGlassFade(overallProgress: number): number {
  if (isInHeroIntro(overallProgress)) return 1;
  const storyP = getStoryProgress(overallProgress);
  return Math.max(0, 1 - smoothstep(storyP / HERO_STORY_BLEND));
}

/**
 * Poids de mélange pour chaque phase 3D (0–4).
 * Fondu uniquement en sortie de zone pour éviter un double crossfade.
 */
export function getPhaseWeights(overallProgress: number): number[] {
  if (isInHeroIntro(overallProgress)) {
    return new Array(SCROLL_ZONES.length).fill(0);
  }

  if (isInHeroOutro(overallProgress)) {
    const weights = new Array(SCROLL_ZONES.length).fill(0);
    const outroT = getHeroOutroProgress(overallProgress);
    const lastZone = SCROLL_ZONES.length - 1;
    weights[lastZone] = 1 - smoothstep(outroT / PHASE_FADE_LOCAL);
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
  const lastZone = SCROLL_ZONES.length - 1;
  const p = zoneLocalProgress;
  const fade = PHASE_FADE_LOCAL;

  if (zoneIndex === lastZone) {
    weights[lastZone] = 1;
    return weights;
  }

  if (p > 1 - fade) {
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
