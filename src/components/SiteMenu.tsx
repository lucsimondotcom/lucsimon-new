"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSiteMenu } from "@/contexts/SiteMenuContext";
import { SITE_MENU } from "@/data/siteNav";

function isActivePath(pathname: string, href: string) {
  if (href.startsWith("/#")) return pathname === "/";
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteMenu() {
  const pathname = usePathname();
  const { menuOpen, closeMenu } = useSiteMenu();

  if (!menuOpen) return null;

  return (
    <nav
      id="site-menu-panel"
      className="fixed inset-0 z-[67] flex items-center justify-center bg-[#0A0A0A] px-8 lg:hidden"
      aria-label="Navigation mobile"
      onClick={closeMenu}
    >
      <ul
        className="flex w-full max-w-sm flex-col items-center gap-8 text-center"
        onClick={(event) => event.stopPropagation()}
      >
        {SITE_MENU.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`block text-3xl font-medium tracking-wide uppercase transition-colors sm:text-4xl ${
                isActivePath(pathname, item.href)
                  ? "text-[#F5F5F5]"
                  : "text-[#F5F5F5]/55 hover:text-[#F5F5F5]"
              }`}
              onClick={closeMenu}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
