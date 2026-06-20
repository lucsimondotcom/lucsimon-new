"use client";

import type { ReactNode } from "react";

export function SiteAppShell({ children }: { children: ReactNode }) {
  return <div id="site-app">{children}</div>;
}
