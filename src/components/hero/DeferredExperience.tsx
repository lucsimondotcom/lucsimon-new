"use client";

import dynamic from "next/dynamic";
import { useLayoutEffect, useState } from "react";
import { LANDING_IMMERSIVE_SCROLL_VH } from "@/lib/landingScroll";

const SCROLL_SECTION_STYLE = {
  height: `${LANDING_IMMERSIVE_SCROLL_VH}vh`,
  minHeight: `${LANDING_IMMERSIVE_SCROLL_VH}vh`,
} as const;

function ExperiencePlaceholder() {
  return (
    <section
      id="methode"
      className="relative scroll-mt-12 bg-background lg:scroll-mt-16"
      style={SCROLL_SECTION_STYLE}
      aria-hidden
    >
      <div className="sticky top-0 h-screen bg-background" />
    </section>
  );
}

const HolographicSystemHero = dynamic(
  () =>
    import("./HolographicSystemHero").then((mod) => mod.HolographicSystemHero),
  {
    ssr: false,
    loading: () => <ExperiencePlaceholder />,
  },
);

function shouldPrepareExperience() {
  return (
    document.body.classList.contains("site-preparing") ||
    document.body.classList.contains("site-ready")
  );
}

export function DeferredExperience() {
  const [showExperience, setShowExperience] = useState(false);

  useLayoutEffect(() => {
    void import("./HolographicSystemHero");
  }, []);

  useLayoutEffect(() => {
    const update = () => {
      if (shouldPrepareExperience()) {
        setShowExperience(true);
      }
    };

    update();

    const observer = new MutationObserver(update);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  if (!showExperience) {
    return <ExperiencePlaceholder />;
  }

  return <HolographicSystemHero />;
}
