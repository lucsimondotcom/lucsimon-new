"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

interface SiteMenuContextValue {
  menuOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
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

  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((open) => !open), []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeMenu]);

  return (
    <SiteMenuContext.Provider
      value={{ menuOpen, openMenu, closeMenu, toggleMenu }}
    >
      {children}
    </SiteMenuContext.Provider>
  );
}
