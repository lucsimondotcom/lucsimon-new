"use client";

import type { ReactNode } from "react";
import { SiteMenuProvider } from "@/contexts/SiteMenuContext";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { SiteMenu } from "./SiteMenu";
import { VisioFab } from "./VisioFab";
import { SmoothScroll } from "./SmoothScroll";
import { SiteAppShell } from "./SiteAppShell";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SmoothScroll>
      <SiteMenuProvider>
        <SiteAppShell>
          <Header />
          <SiteMenu />
          {children}
          <Footer />
          <VisioFab />
        </SiteAppShell>
      </SiteMenuProvider>
    </SmoothScroll>
  );
}
