"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSmoothScroll } from "@/contexts/SmoothScrollContext";
import { type HeaderTone, resolveHeaderTone } from "@/lib/headerTone";
import {
  type NavSectionScrollState,
  resolveNavSectionScroll,
} from "@/lib/navScrollProgress";

export function useHeaderScroll(): {
  tone: HeaderTone;
  navSection: NavSectionScrollState;
} {
  const pathname = usePathname();
  const { lenis } = useSmoothScroll();
  const [tone, setTone] = useState<HeaderTone>("on-light");
  const [navSection, setNavSection] = useState<NavSectionScrollState>({
    activeSectionId: null,
    progress: 0,
  });

  useEffect(() => {
    const update = () => {
      setTone(resolveHeaderTone(pathname));
      setNavSection(resolveNavSectionScroll(pathname));
    };

    update();

    if (lenis) {
      lenis.on("scroll", update);
      return () => lenis.off("scroll", update);
    }

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pathname, lenis]);

  return { tone, navSection };
}

/** @deprecated Utiliser useHeaderScroll */
export function useHeaderTone(): HeaderTone {
  return useHeaderScroll().tone;
}
