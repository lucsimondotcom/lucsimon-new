import { PROJECTS_TOTAL_SCROLL_VH } from "@/lib/projectsScroll";
import { TOTAL_SCROLL_HEIGHT_VH as METHOD_SCROLL_VH } from "@/lib/scrollZones";
import { getHeroSceneBackground } from "@/lib/scrollZones";
import { palette } from "@/lib/designTokens";

export const LANDING_IMMERSIVE_SCROLL_VH =
  METHOD_SCROLL_VH + PROJECTS_TOTAL_SCROLL_VH;

export const METHOD_PORTION_RATIO = METHOD_SCROLL_VH / LANDING_IMMERSIVE_SCROLL_VH;
export const PROJECTS_PORTION_RATIO =
  PROJECTS_TOTAL_SCROLL_VH / LANDING_IMMERSIVE_SCROLL_VH;

export type LandingPhase = "method" | "projects";

export function splitLandingProgress(overallProgress: number): {
  phase: LandingPhase;
  methodProgress: number;
  projectsProgress: number;
} {
  const p = Math.min(1, Math.max(0, overallProgress));

  if (p <= METHOD_PORTION_RATIO) {
    return {
      phase: "method",
      methodProgress: METHOD_PORTION_RATIO > 0 ? p / METHOD_PORTION_RATIO : 0,
      projectsProgress: 0,
    };
  }

  const projectsSpan = 1 - METHOD_PORTION_RATIO;
  return {
    phase: "projects",
    methodProgress: 1,
    projectsProgress: projectsSpan > 0 ? (p - METHOD_PORTION_RATIO) / projectsSpan : 1,
  };
}

export { METHOD_SCROLL_VH };

export function getLandingSceneBackground(landingProgress: number): string {
  const { phase, methodProgress } = splitLandingProgress(landingProgress);
  if (phase === "projects") return palette.white;
  return getHeroSceneBackground(methodProgress);
}
