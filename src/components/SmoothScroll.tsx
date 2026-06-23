"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SmoothScrollProvider } from "@/contexts/SmoothScrollContext";
import { SiteLoaderProvider } from "@/contexts/SiteLoaderContext";
import { CustomScrollbar } from "@/components/CustomScrollbar";
import { SiteLoader } from "@/components/SiteLoader";

import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollProps {
  children: ReactNode;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const pathname = usePathname();
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const touchDevice =
      window.matchMedia("(pointer: coarse)").matches ||
      window.innerWidth < 1024;

    setEnabled(!reducedMotion);

    if (reducedMotion) return;

    const instance = new Lenis({
      duration: touchDevice ? 1.28 : 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: touchDevice ? 1.05 : 1.5,
      anchors: true,
    });

    setLenis(instance);

    instance.on("scroll", ScrollTrigger.update);

    const ticker = (time: number) => {
      instance.raf(time * 1000);
    };

    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(ticker);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  useEffect(() => {
    if (!lenis) return;

    lenis.resize();
    ScrollTrigger.refresh();

    const frame = requestAnimationFrame(() => {
      lenis.resize();
      ScrollTrigger.refresh();
    });

    return () => cancelAnimationFrame(frame);
  }, [pathname, lenis]);

  return (
    <SmoothScrollProvider lenis={lenis} enabled={enabled}>
      <SiteLoaderProvider>
        <SiteLoader />
        {children}
        <CustomScrollbar />
      </SiteLoaderProvider>
    </SmoothScrollProvider>
  );
}
