import {
  isInHeroBridge,
  isInStoryZones,
} from "@/lib/scrollZones";
import { splitLandingProgress } from "@/lib/landingScroll";

export type HeaderTone = "on-light" | "on-dark";

export const HEADER_TONE_STYLES = {
  "on-light": {
    text: "text-foreground",
    textMuted: "text-foreground/80",
    hover: "hover:text-muted",
    profileBorder: "border-border/70",
    menuInactive: "text-foreground/70 hover:text-foreground",
    menuActive: "text-foreground",
  },
  "on-dark": {
    text: "text-[#F5F5F5]",
    textMuted: "text-[#F5F5F5]/80",
    hover: "hover:text-[#F5F5F5]/65",
    profileBorder: "border-white/35",
    menuInactive: "text-[#F5F5F5]/70 hover:text-[#F5F5F5]",
    menuActive: "text-[#F5F5F5]",
  },
} as const;

function getHeaderToneFromMethodProgress(methodProgress: number): HeaderTone {
  if (isInHeroBridge(methodProgress) || isInStoryZones(methodProgress)) {
    return "on-dark";
  }
  return "on-light";
}

export function getHeaderToneFromLandingProgress(
  landingProgress: number,
): HeaderTone {
  const { phase, methodProgress } = splitLandingProgress(landingProgress);
  if (phase === "projects") return "on-light";
  return getHeaderToneFromMethodProgress(methodProgress);
}

export function getLandingSectionScrollProgress(): number | null {
  const section = document.getElementById("methode");
  if (!section) return null;

  const scrollable = section.offsetHeight - window.innerHeight;
  if (scrollable <= 0) return 0;

  const rect = section.getBoundingClientRect();
  if (rect.top > 0) return 0;
  if (rect.bottom <= window.innerHeight) return 1;

  return Math.min(1, Math.max(0, -rect.top / scrollable));
}

export function resolveHeaderTone(pathname: string): HeaderTone {
  if (pathname !== "/") return "on-light";

  const progress = getLandingSectionScrollProgress();
  if (progress === null) return "on-light";

  const section = document.getElementById("methode");
  if (section && section.getBoundingClientRect().bottom <= window.innerHeight) {
    return "on-light";
  }

  return getHeaderToneFromLandingProgress(progress);
}
