"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuCornerFrame } from "@/components/MenuCornerFrame";
import { useSiteMenu } from "@/contexts/SiteMenuContext";

const brandTextClass =
  "text-xs font-medium tracking-[0.04em] text-foreground uppercase";

export function Header() {
  const {
    menuOpen,
    anchorRef,
    closeMenu,
    openMenu,
    toggleMenu,
    cancelHoverClose,
    scheduleHoverClose,
  } = useSiteMenu();
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header id="site-header" className="fixed inset-x-0 top-0 z-[66] font-chrome">
      <div className="relative mx-auto flex h-16 w-full items-center justify-between px-8 sm:px-12 lg:px-20">
        <Link
          href="/"
          className={`${brandTextClass} transition-colors hover:text-muted ${
            menuOpen ? "relative z-[68]" : ""
          }`}
          onClick={() => {
            if (menuOpen) closeMenu();
          }}
        >
          LUC SIMON
        </Link>

        {isHome && (
          <p
            className={`pointer-events-none absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 sm:block ${brandTextClass}`}
          >
            Digital Product Engineer
          </p>
        )}

        <div
          ref={anchorRef}
          className="relative"
          onMouseEnter={() => {
            cancelHoverClose();
            openMenu();
          }}
          onMouseLeave={scheduleHoverClose}
        >
          <button
            type="button"
            className={`relative flex items-center gap-2.5 text-xs font-medium tracking-[0.04em] text-foreground uppercase transition-colors hover:text-muted ${
              menuOpen ? "z-[68]" : "z-[61]"
            }`}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
            aria-controls="site-menu-panel"
            onClick={(event) => {
              event.stopPropagation();
              toggleMenu();
            }}
          >
            Menu
            <span className="relative block h-3.5 w-3.5 shrink-0" aria-hidden>
              {!menuOpen && (
                <MenuCornerFrame className="absolute inset-0" />
              )}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
