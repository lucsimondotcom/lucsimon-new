"use client";

import Image from "next/image";
import Link from "next/link";
import { MenuCornerFrame } from "@/components/MenuCornerFrame";
import { useSiteMenu } from "@/contexts/SiteMenuContext";
import { useHeaderScroll } from "@/hooks/useHeaderTone";
import { HEADER_TONE_STYLES } from "@/lib/headerTone";
import { sectionIdFromHref } from "@/lib/navScrollProgress";
import type { SiteNavItem } from "@/data/siteNav";
import { LANDING_SECTIONS, SITE_MENU, sectionHref } from "@/data/siteNav";

const headerBaseClass =
  "text-xs font-medium tracking-wide uppercase transition-colors duration-300";

function ProfileLink({
  className = "",
  borderClass,
}: {
  className?: string;
  borderClass: string;
}) {
  return (
    <Link
      href={sectionHref(LANDING_SECTIONS.aPropos)}
      className={`relative block h-8 w-8 shrink-0 overflow-hidden rounded-full border transition-colors duration-300 ${borderClass} hover:opacity-80 ${className}`}
      aria-label="À propos de Luc Simon"
    >
      <Image
        src="/profile-square.jpg"
        alt=""
        fill
        className="object-cover"
        sizes="32px"
      />
    </Link>
  );
}

function HeaderNavItem({
  item,
  isActive,
  progress,
  textClass,
  hoverClass,
}: {
  item: SiteNavItem;
  isActive: boolean;
  progress: number;
  textClass: string;
  hoverClass: string;
}) {
  const roundedProgress = Math.round(progress);

  return (
    <Link
      href={item.href}
      className={`relative inline-block ${textClass} ${hoverClass}`}
      aria-current={isActive ? "true" : undefined}
    >
      <span className={headerBaseClass}>{item.label}</span>
      <span
        className={`absolute left-0 top-full mt-0.5 flex w-full min-w-[5rem] items-center gap-1.5 ${
          isActive ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isActive}
      >
        <span
          className="relative h-px min-w-0 flex-1 bg-current/25"
          aria-hidden
        >
          <span
            className="absolute inset-y-0 left-0 bg-current transition-[width] duration-150 ease-out"
            style={{ width: `${isActive ? roundedProgress : 0}%` }}
          />
        </span>
        <span className="shrink-0 text-[10px] font-medium tabular-nums tracking-wide">
          {roundedProgress}%
        </span>
      </span>
    </Link>
  );
}

export function Header() {
  const { tone, navSection } = useHeaderScroll();
  const styles = HEADER_TONE_STYLES[tone];
  const {
    menuOpen,
    anchorRef,
    closeMenu,
    openMenu,
    toggleMenu,
    cancelHoverClose,
    scheduleHoverClose,
  } = useSiteMenu();

  return (
    <header
      id="site-header"
      className="fixed inset-x-0 top-0 z-[66]"
      data-header-tone={tone}
    >
      <div className="relative mx-auto flex h-12 lg:h-16 w-full items-center justify-between px-4 sm:px-12 lg:px-20">
        <div className="flex min-w-0 items-center gap-2.5">
          <Link
            href="/"
            className={`font-logo shrink-0 ${headerBaseClass} ${styles.text} ${styles.hover} ${
              menuOpen ? "relative z-[68]" : ""
            }`}
            onClick={() => {
              if (menuOpen) closeMenu();
            }}
          >
            LUC SIMON
          </Link>
          <p
            className={`hidden truncate sm:block ${headerBaseClass} ${styles.textMuted}`}
          >
            / Digital Product Engineer
          </p>
        </div>

        <div className="flex items-center gap-4 lg:gap-5">
          <nav
            className="hidden items-center gap-7 lg:flex"
            aria-label="Navigation principale"
          >
            {SITE_MENU.map((item) => {
              const sectionId = sectionIdFromHref(item.href);
              const isActive =
                sectionId !== null &&
                navSection.activeSectionId === sectionId;

              return (
                <HeaderNavItem
                  key={item.href}
                  item={item}
                  isActive={isActive}
                  progress={isActive ? navSection.progress : 0}
                  textClass={styles.text}
                  hoverClass={styles.hover}
                />
              );
            })}
          </nav>

          <div
            ref={anchorRef}
            className="relative lg:hidden"
            onMouseEnter={() => {
              cancelHoverClose();
              openMenu();
            }}
            onMouseLeave={scheduleHoverClose}
          >
            <button
              type="button"
              className={`relative flex items-center gap-2.5 ${headerBaseClass} ${styles.text} ${styles.hover} ${
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
                  <MenuCornerFrame className={`absolute inset-0 ${styles.text}`} />
                )}
              </span>
            </button>
          </div>

          <ProfileLink
            className={menuOpen ? "relative z-[68]" : ""}
            borderClass={styles.profileBorder}
          />
        </div>
      </div>
    </header>
  );
}
