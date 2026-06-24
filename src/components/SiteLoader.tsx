"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { MenuCornerFrame } from "@/components/MenuCornerFrame";
import { useSiteLoader } from "@/contexts/SiteLoaderContext";
import { useSmoothScroll } from "@/contexts/SmoothScrollContext";

const MIN_DURATION_MS = 700;

const brandTextClass =
  "text-xs font-medium tracking-[0.08em] text-foreground uppercase";

/** true après la première intro complète — évite de rejouer en navigation interne */
let loaderIntroDone = false;

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function waitForAssets(): Promise<void> {
  const minDelay = new Promise<void>((resolve) => {
    window.setTimeout(resolve, MIN_DURATION_MS);
  });

  const fonts = document.fonts.ready;
  const windowLoad = new Promise<void>((resolve) => {
    if (document.readyState === "complete") {
      resolve();
      return;
    }
    window.addEventListener("load", () => resolve(), { once: true });
  });

  return Promise.all([minDelay, fonts, windowLoad]).then(() => undefined);
}

function markSiteReady() {
  document.body.classList.remove("is-loading");
  document.body.classList.add("site-ready");
}

export function SiteLoader() {
  const { setComplete } = useSiteLoader();
  const { lenis } = useSmoothScroll();
  const lenisRef = useRef(lenis);
  const overlayRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);
  const [displayProgress, setDisplayProgress] = useState(0);

  lenisRef.current = lenis;

  useLayoutEffect(() => {
    if (
      loaderIntroDone ||
      document.body.classList.contains("site-ready")
    ) {
      setComplete(true);
      setDone(true);
      return;
    }

    if (prefersReducedMotion()) {
      markSiteReady();
      loaderIntroDone = true;
      setComplete(true);
      setDone(true);
      return;
    }

    document.body.classList.add("is-loading", "site-preparing");

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lenisRef.current?.stop();

    const progress = { value: 0 };
    let exitStarted = false;

    const counterTween = gsap.to(progress, {
      value: 88,
      duration: 1.25,
      ease: "power2.out",
      onUpdate: () => setDisplayProgress(Math.round(progress.value)),
    });

    gsap.fromTo(
      centerRef.current,
      { scale: 0.92, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.1 },
    );

    gsap.fromTo(
      footerRef.current,
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.75, ease: "power3.out", delay: 0.2 },
    );

    const finish = () => {
      document.body.style.overflow = previousOverflow;
      lenisRef.current?.start();
      loaderIntroDone = true;
      setComplete(true);
      setDone(true);
    };

    const runExit = () => {
      if (exitStarted) return;
      exitStarted = true;

      counterTween.kill();
      markSiteReady();

      gsap.to(progress, {
        value: 100,
        duration: 0.28,
        ease: "power2.inOut",
        onUpdate: () => setDisplayProgress(Math.round(progress.value)),
        onComplete: () => {
          gsap.to(overlayRef.current, {
            opacity: 0,
            duration: 0.55,
            ease: "power2.inOut",
            onComplete: finish,
          });
        },
      });
    };

    void waitForAssets().then(runExit);

    return () => {
      counterTween.kill();
      document.body.style.overflow = previousOverflow;
      document.body.classList.remove("is-loading");
      lenisRef.current?.start();
    };
  }, [setComplete]);

  if (done) return null;

  const counter = String(displayProgress).padStart(3, "0");
  const lineScale = Math.min(1, displayProgress / 100);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex flex-col bg-background text-foreground will-change-[opacity]"
      aria-live="polite"
      aria-busy={displayProgress < 100}
      aria-label="Chargement du site"
    >
      <div className="absolute inset-x-0 top-0">
        <div className="relative mx-auto flex h-16 w-full items-center px-8 sm:px-12 lg:px-20">
          <p className={brandTextClass}>LUC SIMON</p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-8">
        <div ref={centerRef} className="relative flex items-center justify-center">
          <MenuCornerFrame
            arm={18}
            className="relative h-28 w-28 text-foreground sm:h-32 sm:w-32"
          />
          <p className="absolute text-5xl font-medium tabular-nums tracking-tight text-foreground sm:text-6xl">
            {counter}
          </p>
        </div>
      </div>

      <div
        ref={footerRef}
        className="px-8 pb-8 sm:px-12 sm:pb-10 lg:px-20"
      >
        <div className="mb-4 h-px overflow-hidden bg-foreground/20">
          <div
            className="h-full origin-left bg-foreground"
            style={{ transform: `scaleX(${lineScale})` }}
          />
        </div>
        <p className="text-right text-xs tabular-nums tracking-[0.12em] text-foreground uppercase">
          {displayProgress}%
        </p>
      </div>
    </div>
  );
}
