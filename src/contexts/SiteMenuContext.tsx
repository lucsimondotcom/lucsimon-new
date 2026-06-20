"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

const ICON_SIZE = 14;
const CONTENT_FADE_MS = 200;
const CLOSE_PAUSE_MS = 240;
const FRAME_EASE = "elastic.out(1, 0.72)";
const FRAME_DURATION = 0.82;
const CONTENT_REVEAL_AT = FRAME_DURATION * 0.42;
const CLOSE_EASE = "power3.inOut";
const CLOSE_DURATION = 0.48;

export const MENU_ANCHOR_TOP_OFFSET = ICON_SIZE / 2;

const HOVER_CLOSE_MS = 280;

function menuDimensions() {
  return {
    width: Math.min(248, window.innerWidth - 48),
    height: Math.min(220, window.innerHeight - 80),
  };
}

interface SiteMenuContextValue {
  menuOpen: boolean;
  menuContentVisible: boolean;
  menuPanelRef: React.RefObject<HTMLElement | null>;
  anchorRef: React.RefObject<HTMLDivElement | null>;
  anchorRight: number;
  anchorTop: number;
  openMenu: () => void;
  closeMenu: () => void;
  resetMenu: () => void;
  toggleMenu: () => void;
  cancelHoverClose: () => void;
  scheduleHoverClose: () => void;
  animateOpen: () => void;
  animateClose: (onComplete?: () => void) => void;
}

const SiteMenuContext = createContext<SiteMenuContextValue | null>(null);

export function useSiteMenu() {
  const ctx = useContext(SiteMenuContext);
  if (!ctx) throw new Error("useSiteMenu must be used within SiteMenuProvider");
  return ctx;
}

export function SiteMenuProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuContentVisible, setMenuContentVisible] = useState(false);
  const [anchorRight, setAnchorRight] = useState(32);
  const [anchorTop, setAnchorTop] = useState(25);

  const menuOpenRef = useRef(false);
  const menuPanelRef = useRef<HTMLElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const frameTweenRef = useRef<gsap.core.Timeline | null>(null);
  const closePauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  menuOpenRef.current = menuOpen;

  const clearCloseTimers = useCallback(() => {
    if (closePauseTimerRef.current) {
      clearTimeout(closePauseTimerRef.current);
      closePauseTimerRef.current = null;
    }
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const updateAnchor = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;

    const rect = anchor.getBoundingClientRect();
    setAnchorRight(window.innerWidth - rect.right);
    setAnchorTop(rect.top + rect.height / 2 - MENU_ANCHOR_TOP_OFFSET);
  }, []);

  const setClosedLayout = useCallback((panel: HTMLElement) => {
    gsap.set(panel, {
      width: ICON_SIZE,
      height: ICON_SIZE,
      overwrite: true,
    });
  }, []);

  const animateOpen = useCallback(() => {
    const panel = menuPanelRef.current;
    if (!panel) return;

    frameTweenRef.current?.kill();
    frameTweenRef.current = null;
    updateAnchor();

    const { width, height } = menuDimensions();
    const tl = gsap.timeline({
      onComplete: () => {
        frameTweenRef.current = null;
      },
    });

    tl.to(
      panel,
      {
        width,
        height,
        duration: FRAME_DURATION,
        ease: FRAME_EASE,
        overwrite: true,
      },
      0,
    );

    tl.call(
      () => {
        if (menuOpenRef.current) setMenuContentVisible(true);
      },
      [],
      CONTENT_REVEAL_AT,
    );

    frameTweenRef.current = tl;
  }, [updateAnchor]);

  const cancelHoverClose = useCallback(() => {
    if (hoverCloseTimerRef.current) {
      clearTimeout(hoverCloseTimerRef.current);
      hoverCloseTimerRef.current = null;
    }
  }, []);

  const finishClose = useCallback(() => {
    clearCloseTimers();
    cancelHoverClose();
    frameTweenRef.current?.kill();
    frameTweenRef.current = null;

    const panel = menuPanelRef.current;
    if (panel) {
      gsap.killTweensOf(panel);
      setClosedLayout(panel);
    }

    setMenuContentVisible(false);
    setMenuOpen(false);
  }, [clearCloseTimers, cancelHoverClose, setClosedLayout]);

  const resetMenu = useCallback(() => {
    finishClose();
  }, [finishClose]);

  const animateClose = useCallback(
    (onComplete?: () => void) => {
      const panel = menuPanelRef.current;
      if (!panel) {
        onComplete?.();
        return;
      }

      frameTweenRef.current?.kill();

      const tl = gsap.timeline({
        onComplete: () => {
          setClosedLayout(panel);
          frameTweenRef.current = null;
          onComplete?.();
        },
      });

      tl.to(
        panel,
        {
          width: ICON_SIZE,
          height: ICON_SIZE,
          duration: CLOSE_DURATION,
          ease: CLOSE_EASE,
          overwrite: true,
        },
        0,
      );

      frameTweenRef.current = tl;
    },
    [setClosedLayout],
  );

  const closeMenu = useCallback(() => {
    if (!menuOpenRef.current) return;

    clearCloseTimers();
    cancelHoverClose();
    frameTweenRef.current?.kill();
    frameTweenRef.current = null;

    if (!menuPanelRef.current) {
      finishClose();
      return;
    }

    closePauseTimerRef.current = setTimeout(() => {
      setMenuContentVisible(false);

      closeTimerRef.current = setTimeout(() => {
        if (!menuOpenRef.current) {
          closeTimerRef.current = null;
          return;
        }

        if (!menuPanelRef.current) {
          finishClose();
          closeTimerRef.current = null;
          return;
        }

        animateClose(() => {
          finishClose();
          closeTimerRef.current = null;
        });
      }, CONTENT_FADE_MS);

      closePauseTimerRef.current = null;
    }, CLOSE_PAUSE_MS);
  }, [animateClose, clearCloseTimers, cancelHoverClose, finishClose]);

  const openMenu = useCallback(() => {
    clearCloseTimers();
    cancelHoverClose();
    frameTweenRef.current?.kill();
    frameTweenRef.current = null;
    setMenuContentVisible(false);
    updateAnchor();

    if (!menuOpenRef.current) {
      setMenuOpen(true);
      return;
    }

    requestAnimationFrame(() => {
      if (menuOpenRef.current) animateOpen();
    });
  }, [updateAnchor, clearCloseTimers, cancelHoverClose, animateOpen]);

  const toggleMenu = useCallback(() => {
    if (menuOpenRef.current) closeMenu();
    else openMenu();
  }, [closeMenu, openMenu]);

  const scheduleHoverClose = useCallback(() => {
    cancelHoverClose();
    hoverCloseTimerRef.current = setTimeout(() => {
      closeMenu();
      hoverCloseTimerRef.current = null;
    }, HOVER_CLOSE_MS);
  }, [closeMenu, cancelHoverClose]);

  useLayoutEffect(() => {
    const panel = menuPanelRef.current;
    if (panel) setClosedLayout(panel);
    updateAnchor();
  }, [setClosedLayout, updateAnchor]);

  useEffect(() => {
    cancelHoverClose();
    updateAnchor();

    if (menuOpenRef.current && !menuPanelRef.current) {
      setMenuContentVisible(false);
      setMenuOpen(false);
    }
  }, [pathname, cancelHoverClose, updateAnchor]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    window.addEventListener("resize", updateAnchor);
    return () => window.removeEventListener("resize", updateAnchor);
  }, [updateAnchor]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeMenu]);

  useEffect(
    () => () => {
      finishClose();
    },
    [finishClose],
  );

  return (
    <SiteMenuContext.Provider
      value={{
        menuOpen,
        menuContentVisible,
        menuPanelRef,
        anchorRef,
        anchorRight,
        anchorTop,
        openMenu,
        closeMenu,
        resetMenu,
        toggleMenu,
        cancelHoverClose,
        scheduleHoverClose,
        animateOpen,
        animateClose,
      }}
    >
      {children}
    </SiteMenuContext.Provider>
  );
}
