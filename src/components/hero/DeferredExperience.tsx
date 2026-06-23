"use client";

import dynamic from "next/dynamic";
import { useLayoutEffect, useState } from "react";

const HolographicSystemHero = dynamic(
  () =>
    import("./HolographicSystemHero").then((mod) => mod.HolographicSystemHero),
  { ssr: false },
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
    return (
      <section
        id="methode"
        className="h-screen scroll-mt-12 bg-background lg:scroll-mt-16"
        aria-hidden
      />
    );
  }

  return <HolographicSystemHero />;
}
