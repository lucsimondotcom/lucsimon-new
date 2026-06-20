"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSmoothScroll } from "@/contexts/SmoothScrollContext";

const MIN_THUMB_PX = 56;

export function CustomScrollbar() {
  const { progress, enabled, scrollToProgress } = useSmoothScroll();
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackHeight, setTrackHeight] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const track = trackRef.current;
    if (!track) return;

    const update = () => {
      setTrackHeight(track.clientHeight);
    };

    update();

    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(track);

    const bodyObserver = new MutationObserver(update);
    bodyObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    window.addEventListener("resize", update);

    return () => {
      resizeObserver.disconnect();
      bodyObserver.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [enabled]);

  const thumbHeight = Math.max(
    MIN_THUMB_PX,
    trackHeight * 0.14,
  );
  const thumbOffset =
    trackHeight > thumbHeight
      ? progress * (trackHeight - thumbHeight)
      : 0;

  const scrollFromPointer = useCallback(
    (clientY: number) => {
      const track = trackRef.current;
      if (!track || trackHeight <= thumbHeight) return;

      const rect = track.getBoundingClientRect();
      const y = clientY - rect.top - thumbHeight / 2;
      const ratio = Math.min(1, Math.max(0, y / (trackHeight - thumbHeight)));
      scrollToProgress(ratio);
    },
    [scrollToProgress, trackHeight, thumbHeight],
  );

  const onTrackClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if ((event.target as HTMLElement).dataset.part === "thumb") return;
      scrollFromPointer(event.clientY);
    },
    [scrollFromPointer],
  );

  useEffect(() => {
    if (!isDragging) return;

    const onMove = (event: PointerEvent) => scrollFromPointer(event.clientY);
    const onUp = () => setIsDragging(false);

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [isDragging, scrollFromPointer]);

  if (!enabled) return null;

  return (
    <div
      id="site-scrollbar"
      className="pointer-events-none fixed inset-y-0 right-0 z-50 hidden w-5 sm:block"
      aria-hidden="true"
    >
      <div
        ref={trackRef}
        className="pointer-events-auto absolute top-3 right-2 bottom-3 w-1.5 cursor-pointer rounded-full"
        style={{ background: "var(--scrollbar-track)" }}
        onClick={onTrackClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          data-part="thumb"
          className="absolute inset-x-0 rounded-full transition-[height,transform,box-shadow,background] duration-200"
          style={{
            height: thumbHeight,
            transform: `translateY(${thumbOffset}px)`,
            background: isDragging
              ? "var(--scrollbar-thumb-active)"
              : isHovered
                ? "var(--scrollbar-thumb-hover)"
                : "var(--scrollbar-thumb)",
            boxShadow: isDragging
              ? "0 0 0 3px var(--scrollbar-glow)"
              : isHovered
                ? "0 0 0 2px var(--scrollbar-glow)"
                : "none",
          }}
          onPointerDown={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
        />
      </div>
    </div>
  );
}
