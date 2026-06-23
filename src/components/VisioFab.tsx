"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { VISIO_PAGE } from "@/data/siteNav";
import { VideoCallIcon } from "@/components/icons/VideoCallIcon";

export function VisioFab() {
  const pathname = usePathname();

  if (pathname === "/") return null;
  if (/^\/projets\/[^/]+$/.test(pathname)) return null;

  return (
    <Link
      href={VISIO_PAGE.href}
      className="fixed right-8 bottom-8 z-[50] flex h-14 w-14 items-center justify-center rounded-full border border-border/70 bg-accent/90 text-on-accent shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-md transition-colors hover:bg-accent sm:right-12 sm:bottom-10 lg:right-20"
      aria-label={VISIO_PAGE.label}
    >
      <VideoCallIcon className="h-[28px] w-[28px] text-on-accent/90" />
    </Link>
  );
}
