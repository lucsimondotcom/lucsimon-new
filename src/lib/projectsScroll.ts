import { PROJECT_COUNT } from "@/data/projects";
import { STORY_CAMERA_RAMP } from "@/lib/scrollZones";

export const PROJECTS_INTRO_VH = 90;
export const PROJECT_ZONE_VH = 120;

export const PROJECTS_TOTAL_SCROLL_VH =
  PROJECTS_INTRO_VH + PROJECT_ZONE_VH * PROJECT_COUNT;

export const PROJECTS_INTRO_RATIO =
  PROJECTS_INTRO_VH / PROJECTS_TOTAL_SCROLL_VH;

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function smoothstep(t: number): number {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
}

export function getProjectsIntroProgress(overallProgress: number): number {
  const p = clamp01(overallProgress);
  if (p >= PROJECTS_INTRO_RATIO) return 1;
  return smoothstep(p / PROJECTS_INTRO_RATIO);
}

export function isInProjectsIntro(overallProgress: number): boolean {
  return clamp01(overallProgress) < PROJECTS_INTRO_RATIO;
}

/** Progression 0→1 sur les projets (après l’intro), pour caméra + rail */
export function getProjectsStoryProgress(overallProgress: number): number {
  const p = clamp01(overallProgress);
  if (p <= PROJECTS_INTRO_RATIO) return 0;
  return clamp01((p - PROJECTS_INTRO_RATIO) / (1 - PROJECTS_INTRO_RATIO));
}

export interface ProjectScrollState {
  activeIndex: number;
  nextIndex: number;
  textureBlend: number;
  panelOpacity: (index: number) => number;
}

export function getProjectScrollState(
  overallProgress: number,
): ProjectScrollState {
  const p = clamp01(overallProgress);
  const count = PROJECT_COUNT;

  if (p <= PROJECTS_INTRO_RATIO) {
    return {
      activeIndex: 0,
      nextIndex: 0,
      textureBlend: 0,
      panelOpacity: () => 0,
    };
  }

  const storyP = getProjectsStoryProgress(p);
  const segment = 1 / count;
  const raw = storyP / segment;
  const activeIndex = Math.min(count - 1, Math.floor(raw));
  const local = raw - activeIndex;
  const nextIndex = Math.min(count - 1, activeIndex + 1);

  const crossfadeStart = 0.72;
  const blend =
    activeIndex === nextIndex
      ? 0
      : smoothstep(clamp01((local - crossfadeStart) / (1 - crossfadeStart)));

  const panelOpacity = (index: number) => {
    if (index !== activeIndex && index !== nextIndex) return 0;

    const readFade = 0.18;

    if (index === activeIndex) {
      if (local < readFade) return local / readFade;
      if (activeIndex !== nextIndex && local > crossfadeStart) {
        return 1 - blend;
      }
      return 1;
    }

    return blend;
  };

  return { activeIndex, nextIndex, textureBlend: blend, panelOpacity };
}

/** Révélation des textures projet (sync avec le dézoom caméra) */
export function getProjectsTextureReveal(overallProgress: number): number {
  const storyP = getProjectsStoryProgress(overallProgress);
  return smoothstep(Math.min(1, storyP / STORY_CAMERA_RAMP));
}

export { STORY_CAMERA_RAMP };
