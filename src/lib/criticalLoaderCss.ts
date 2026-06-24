import { LANDING_IMMERSIVE_SCROLL_VH } from "@/lib/landingScroll";

export const CRITICAL_LOADER_CSS = `
:root {
  --landing-scroll-vh: ${LANDING_IMMERSIVE_SCROLL_VH};
}
body:not(.site-ready) {
  overflow: hidden;
  background: #F5F5F5;
}
body:not(.site-ready) #site-app {
  visibility: hidden;
  pointer-events: none;
}
body:not(.site-ready) #site-scrollbar {
  visibility: hidden;
  pointer-events: none;
}
body.site-preparing:not(.site-ready) {
  overflow: hidden;
}
#methode {
  min-height: calc(var(--landing-scroll-vh) * 1vh);
}
`;
