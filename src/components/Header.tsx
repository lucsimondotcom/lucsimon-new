"use client";

import Image from "next/image";
import Link from "next/link";
import { useSiteMenu } from "@/contexts/SiteMenuContext";
import { useHeaderScroll } from "@/hooks/useHeaderTone";
import { HEADER_TONE_STYLES } from "@/lib/headerTone";
import { sectionIdFromHref } from "@/lib/navScrollProgress";
import type { SiteNavItem } from "@/data/siteNav";
import { LANDING_SECTIONS, SITE_MENU, sectionHref } from "@/data/siteNav";

const headerBaseClass =
  "text-xs font-medium tracking-wide uppercase transition-colors duration-300";

const MOBILE_HEADER_ICON_SIZE = "h-7 w-7";
const MOBILE_MENU_ICON_HEIGHT = "h-4";

function ProfileLink({
  className = "",
  borderClass,
  sizeClass = "h-8 w-8",
}: {
  className?: string;
  borderClass: string;
  sizeClass?: string;
}) {
  return (
    <Link
      href={sectionHref(LANDING_SECTIONS.aPropos)}
      className={`relative block shrink-0 overflow-hidden rounded-full transition-colors duration-300 ${sizeClass} ${borderClass} hover:opacity-80 ${className}`}
      aria-label="À propos de Luc Simon"
    >
      <Image
        src="/profile-square.jpg"
        alt=""
        fill
        className="object-cover"
        sizes={sizeClass.includes("h-7") ? "28px" : "32px"}
      />
    </Link>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span
      className={`relative flex ${MOBILE_MENU_ICON_HEIGHT} w-5 shrink-0 flex-col justify-between`}
      aria-hidden
    >
      <span
        className={`block h-px w-full bg-current transition-transform duration-200 ${
          open ? "translate-y-[13px] rotate-45" : ""
        }`}
      />
      <span
        className={`block h-px w-full bg-current transition-opacity duration-200 ${
          open ? "opacity-0" : "opacity-100"
        }`}
      />
      <span
        className={`block h-px w-full bg-current transition-transform duration-200 ${
          open ? "-translate-y-[13px] -rotate-45" : ""
        }`}
      />
    </span>
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
  const { menuOpen, closeMenu, toggleMenu } = useSiteMenu();
  const mobileMenuStyles = HEADER_TONE_STYLES["on-dark"];

  return (
    <header
      id="site-header"
      className={`fixed inset-x-0 top-0 ${menuOpen ? "z-[68]" : "z-[66]"}`}
      data-header-tone={tone}
    >
      <div className="relative mx-auto flex h-12 w-full items-center justify-between px-4 sm:px-12 lg:h-16 lg:px-20">
        <div className="flex min-w-0 items-center gap-3">
          <ProfileLink
            className="lg:hidden"
            borderClass={
              menuOpen ? mobileMenuStyles.profileBorder : styles.profileBorder
            }
            sizeClass={MOBILE_HEADER_ICON_SIZE}
          />
          <Link
            href="/"
            className={`font-logo shrink-0 ${headerBaseClass} ${
              menuOpen ? mobileMenuStyles.text : styles.text
            } ${menuOpen ? mobileMenuStyles.hover : styles.hover}`}
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

          <button
            type="button"
            className={`flex items-center gap-2.5 lg:hidden ${headerBaseClass} ${
              menuOpen ? mobileMenuStyles.text : styles.text
            } ${menuOpen ? mobileMenuStyles.hover : styles.hover}`}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
            aria-controls="site-menu-panel"
            onClick={toggleMenu}
          >
            Menu
            <MenuIcon open={menuOpen} />
          </button>

          <ProfileLink
            className={`hidden lg:block ${menuOpen ? "relative z-[68]" : ""}`}
            borderClass={styles.profileBorder}
            sizeClass="h-8 w-8"
          />
        </div>
      </div>
    </header>
  );
}
