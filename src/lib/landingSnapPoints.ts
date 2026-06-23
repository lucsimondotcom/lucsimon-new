import { PROJECT_COUNT } from "@/data/projects";
import {
  METHOD_PORTION_RATIO,
  PROJECTS_PORTION_RATIO,
} from "@/lib/landingScroll";
import { PROJECT_SNAP_HOLD } from "@/lib/projectsScroll";
import {
  HERO_BRIDGE_RATIO,
  HERO_BRIDGE_START_RATIO,
  HERO_OUTRO_RATIO,
  OUTRO_SNAP_HOLD,
  SCROLL_ZONES,
  STORY_END_RATIO,
  STORY_START_RATIO,
  ZONE_SNAP_HOLD,
} from "@/lib/scrollZones";

const STORY_SCROLL_HEIGHT_VH = SCROLL_ZONES.reduce(
  (sum, zone) => sum + zone.heightVh,
  0,
);

/** Rubriques nav : Expertise, Projets */
export type SnapTier = "rubrique" | "sub";

export interface LandingSnapPoint {
  progress: number;
  tier: SnapTier;
}

/** Plus le pull est élevé, plus le snap accroche facilement */
const RUBRIC_SNAP_PULL = 2.85;
const SUB_SNAP_PULL = 1;

const BRIDGE_METHOD_SNAP =
  HERO_BRIDGE_START_RATIO + HERO_BRIDGE_RATIO * 0.48;

function methodProgressFromStoryZone(
  zoneIndex: number,
  localHold: number,
): number {
  let accumulatedVh = 0;
  for (let i = 0; i < zoneIndex; i++) {
    accumulatedVh += SCROLL_ZONES[i].heightVh;
  }

  const zoneStart = accumulatedVh / STORY_SCROLL_HEIGHT_VH;
  const zoneEnd =
    (accumulatedVh + SCROLL_ZONES[zoneIndex].heightVh) /
    STORY_SCROLL_HEIGHT_VH;
  const storyLocal = zoneStart + (zoneEnd - zoneStart) * localHold;

  return (
    STORY_START_RATIO + storyLocal * (STORY_END_RATIO - STORY_START_RATIO)
  );
}

function methodToLanding(methodProgress: number): number {
  return methodProgress * METHOD_PORTION_RATIO;
}

function projectToLanding(projectStoryProgress: number): number {
  return METHOD_PORTION_RATIO + projectStoryProgress * PROJECTS_PORTION_RATIO;
}

export function getExpertiseSubSnapPoints(): LandingSnapPoint[] {
  const bridge = {
    progress: methodToLanding(BRIDGE_METHOD_SNAP),
    tier: "sub" as const,
  };

  const steps = SCROLL_ZONES.map((_, index) => ({
    progress: methodToLanding(
      methodProgressFromStoryZone(index, ZONE_SNAP_HOLD),
    ),
    tier: "sub" as const,
  }));

  const outro = {
    progress: methodToLanding(
      STORY_END_RATIO + HERO_OUTRO_RATIO * OUTRO_SNAP_HOLD,
    ),
    tier: "sub" as const,
  };

  return [bridge, ...steps, outro];
}

export function getProjectsSubSnapPoints(): LandingSnapPoint[] {
  return Array.from({ length: PROJECT_COUNT }, (_, index) => ({
    progress: projectToLanding((index + PROJECT_SNAP_HOLD) / PROJECT_COUNT),
    tier: "sub" as const,
  }));
}

export function getLandingSnapPoints(): LandingSnapPoint[] {
  const projectSubs = getProjectsSubSnapPoints();
  const firstProject = projectSubs[0]?.progress ?? METHOD_PORTION_RATIO;

  return [
    { progress: 0, tier: "rubrique" },
    ...getExpertiseSubSnapPoints(),
    { progress: firstProject, tier: "rubrique" },
    ...projectSubs.slice(1),
  ];
}

export function snapLandingProgress(progress: number): number {
  const clamped = Math.min(1, Math.max(0, progress));
  const points = getLandingSnapPoints();

  let closest = points[0].progress;
  let bestScore = Infinity;

  for (const point of points) {
    const pull = point.tier === "rubrique" ? RUBRIC_SNAP_PULL : SUB_SNAP_PULL;
    const score = Math.abs(clamped - point.progress) / pull;
    if (score < bestScore) {
      bestScore = score;
      closest = point.progress;
    }
  }

  return closest;
}
