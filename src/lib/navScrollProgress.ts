import { LANDING_SECTIONS } from "@/data/siteNav";
import { METHOD_PORTION_RATIO } from "@/lib/landingScroll";

export type NavSectionId =
  (typeof LANDING_SECTIONS)[keyof typeof LANDING_SECTIONS];

export interface NavSectionScrollState {
  activeSectionId: NavSectionId | null;
  /** 0–100, uniquement pour la section active */
  progress: number;
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function getBlockSectionProgress(element: HTMLElement): number {
  const scrollable = element.offsetHeight - window.innerHeight;

  if (scrollable <= 0) {
    const rect = element.getBoundingClientRect();
    if (rect.top >= window.innerHeight) return 0;
    if (rect.bottom <= 0) return 1;
    const traveled = window.innerHeight - rect.top;
    return clamp01(traveled / (element.offsetHeight + window.innerHeight));
  }

  const rect = element.getBoundingClientRect();
  return clamp01(-rect.top / scrollable);
}

function getImmersiveScrollProgress(): number | null {
  const section = document.getElementById(LANDING_SECTIONS.methode);
  if (!section) return null;

  const scrollable = section.offsetHeight - window.innerHeight;
  if (scrollable <= 0) return 0;

  const rect = section.getBoundingClientRect();
  if (rect.top > 0) return 0;
  if (rect.bottom <= window.innerHeight) return 1;

  return clamp01(-rect.top / scrollable);
}

function navState(
  sectionId: NavSectionId,
  progress: number,
): NavSectionScrollState {
  if (progress <= 0) {
    return { activeSectionId: null, progress: 0 };
  }
  return { activeSectionId: sectionId, progress };
}

export function resolveNavSectionScroll(pathname: string): NavSectionScrollState {
  if (pathname !== "/") {
    return { activeSectionId: null, progress: 0 };
  }

  const methode = document.getElementById(LANDING_SECTIONS.methode);
  if (!methode) {
    return { activeSectionId: null, progress: 0 };
  }

  const immersiveProgress = getImmersiveScrollProgress();
  const pastImmersive = methode.getBoundingClientRect().bottom <= window.innerHeight;

  if (!pastImmersive && immersiveProgress !== null) {
    if (immersiveProgress <= 0) {
      return { activeSectionId: null, progress: 0 };
    }

    if (immersiveProgress < METHOD_PORTION_RATIO) {
      const local =
        METHOD_PORTION_RATIO > 0
          ? immersiveProgress / METHOD_PORTION_RATIO
          : 0;
      return navState(LANDING_SECTIONS.methode, local * 100);
    }

    const span = 1 - METHOD_PORTION_RATIO;
    const local =
      span > 0 ? (immersiveProgress - METHOD_PORTION_RATIO) / span : 0;
    return navState(LANDING_SECTIONS.projets, local * 100);
  }

  const visio = document.getElementById(LANDING_SECTIONS.visio);
  if (visio) {
    const visioTop = visio.getBoundingClientRect().top;
    if (visioTop <= window.innerHeight * 0.4) {
      return navState(
        LANDING_SECTIONS.visio,
        getBlockSectionProgress(visio) * 100,
      );
    }
  }

  const about = document.getElementById(LANDING_SECTIONS.aPropos);
  if (about) {
    return navState(
      LANDING_SECTIONS.aPropos,
      getBlockSectionProgress(about) * 100,
    );
  }

  return { activeSectionId: null, progress: 0 };
}

export function sectionIdFromHref(href: string): NavSectionId | null {
  const hash = href.split("#")[1];
  if (!hash) return null;
  return Object.values(LANDING_SECTIONS).includes(hash as NavSectionId)
    ? (hash as NavSectionId)
    : null;
}
