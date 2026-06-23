"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSiteMenu } from "@/contexts/SiteMenuContext";
import { useHeaderScroll } from "@/hooks/useHeaderTone";
import { HEADER_TONE_STYLES } from "@/lib/headerTone";
import { SITE_MENU } from "@/data/siteNav";

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
  const { menuOpen, closeMenu } = useSiteMenu();

  if (!menuOpen) return null;

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-[65] bg-black/20 lg:hidden"
        aria-label="Fermer le menu"
        onClick={closeMenu}
      />
      <nav
        id="site-menu-panel"
        className="fixed inset-x-0 top-12 z-[67] border-b border-border/50 bg-background/95 px-4 py-5 backdrop-blur-md lg:hidden"
        aria-label="Navigation mobile"
      >
        <ul className="space-y-1">
          {SITE_MENU.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block py-2.5 ${navLinkClass} ${
                  isActivePath(pathname, item.href)
                    ? styles.menuActive
                    : styles.menuInactive
                }`}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
