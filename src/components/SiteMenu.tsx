"use client";

import { useEffect, useLayoutEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuCornerFrame } from "@/components/MenuCornerFrame";
import { useSiteMenu } from "@/contexts/SiteMenuContext";
import { useHeaderScroll } from "@/hooks/useHeaderTone";
import { HEADER_TONE_STYLES } from "@/lib/headerTone";
import { SITE_MENU } from "@/data/siteNav";

const ICON_SIZE = 14;
const CONTENT_FADE_MS = 200;

const navLinkClass =
  "text-xs font-medium tracking-wide uppercase transition-colors";

function isActivePath(pathname: string, href: string) {
  if (href.startsWith("/#")) return pathname === "/";
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteMenu() {
  const pathname = usePathname();
  const { tone } = useHeaderScroll();
  const styles = HEADER_TONE_STYLES[tone];
  const {
    menuOpen,
    menuContentVisible,
    menuPanelRef,
    anchorRef,
    anchorRight,
    anchorTop,
    closeMenu,
    cancelHoverClose,
    scheduleHoverClose,
    animateOpen,
  } = useSiteMenu();

  useLayoutEffect(() => {
    if (!menuOpen) return;
    animateOpen();
  }, [menuOpen, animateOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (menuPanelRef.current?.contains(target)) return;
      if (anchorRef.current?.contains(target)) return;
      closeMenu();
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [menuOpen, closeMenu, menuPanelRef, anchorRef]);

  if (!menuOpen) return null;

  return (
    <nav
      id="site-menu-panel"
      ref={menuPanelRef}
      className="fixed z-[67] overflow-hidden"
      style={{
        top: anchorTop,
        right: anchorRight,
        width: ICON_SIZE,
        height: ICON_SIZE,
      }}
      aria-hidden={!menuOpen}
      onMouseEnter={cancelHoverClose}
      onMouseLeave={scheduleHoverClose}
      onClick={(event) => event.stopPropagation()}
    >
      <MenuCornerFrame className={`absolute inset-0 z-[2] ${styles.text}`} />

      <div
        className="absolute inset-0 z-[1] bg-background/45 backdrop-blur-[2px]"
        style={{
          opacity: menuContentVisible ? 1 : 0,
          pointerEvents: menuContentVisible ? "auto" : "none",
          transition: `opacity ${CONTENT_FADE_MS}ms ease`,
        }}
      >
        <div className="flex h-full flex-col justify-center px-5 py-4">
          <ul className="space-y-0.5">
            {SITE_MENU.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block py-2 ${navLinkClass} ${
                    isActivePath(pathname, item.href)
                      ? styles.menuActive
                      : styles.menuInactive
                  }`}
                  onClick={closeMenu}
                  tabIndex={menuContentVisible ? 0 : -1}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
