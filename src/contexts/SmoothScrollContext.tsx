"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type Lenis from "lenis";

interface SmoothScrollContextValue {
  progress: number;
  enabled: boolean;
  lenis: Lenis | null;
  scrollToProgress: (progress: number) => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  progress: 0,
  enabled: false,
  lenis: null,
  scrollToProgress: () => {},
});

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

interface SmoothScrollProviderProps {
  children: ReactNode;
  lenis: Lenis | null;
  enabled: boolean;
}

export function SmoothScrollProvider({
  children,
  lenis,
  enabled,
}: SmoothScrollProviderProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!lenis || !enabled) return;

    const onScroll = () => setProgress(lenis.progress);
    onScroll();
    lenis.on("scroll", onScroll);

    return () => lenis.off("scroll", onScroll);
  }, [lenis, enabled]);

  const scrollToProgress = useCallback(
    (target: number) => {
      if (!lenis) return;
      lenis.scrollTo(target * lenis.limit, { immediate: false });
    },
    [lenis],
  );

  return (
    <SmoothScrollContext.Provider
      value={{ progress, enabled, lenis, scrollToProgress }}
    >
      {children}
    </SmoothScrollContext.Provider>
  );
}
