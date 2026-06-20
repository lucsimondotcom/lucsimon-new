/**
 * ═══════════════════════════════════════════════════════════════
 *  PALETTE — modifier les couleurs ici uniquement
 * ═══════════════════════════════════════════════════════════════
 */

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16) / 255,
    g: parseInt(h.slice(2, 4), 16) / 255,
    b: parseInt(h.slice(4, 6), 16) / 255,
  };
}

function withAlpha(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${alpha})`;
}

function toGlslVec3(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  return `vec3(${r.toFixed(4)}, ${g.toFixed(4)}, ${b.toFixed(4)})`;
}

export const theme = {
  /** UI & fond de page */
  background: "#F5F3FF",
  backgroundEdge: "#EBE8FF",
  foreground: "#1A1A40",
  muted: "#707090",
  accent: "#6973D8",
  softAccent: "#B0B0FF",
  border: "#D4D2E8",
  onAccent: "#F4F3F8",

  surface: {
    base: withAlpha("#FFFFFF", 0.42),
    hover: withAlpha("#FFFFFF", 0.58),
    subtle: withAlpha("#FFFFFF", 0.24),
    panel: withAlpha("#F5F3FF", 0.92),
    card: withAlpha("#FFFFFF", 0.52),
    menuHover: withAlpha("#FFFFFF", 0.45),
  },

  scrollbar: {
    track: "#E8E4F8",
    thumb: "#C5C0E0",
    thumbHover: "#B0B0FF",
    thumbActive: "#9090D8",
    glow: withAlpha("#B0B0FF", 0.22),
    gradientStart: "#D8D4F0",
  },

  overlay: withAlpha("#1A1A40", 0.1),

  /** Scène Three.js */
  scene: {
    orbitLine: "#7870C8",
    orbitNode: "#9088D8",
    floorRing: "#E8B0F0",
    floorRingOuter: "#D0A0E8",
    floorShadow: "#9888B8",
    shadowCore: "#8060A0",
    shadowReflection: "#D8C8F0",
    floorDot: "#9080B0",
  },

  lights: {
    ambient: "#EBE8FF",
    key: "#F0EEFF",
    fill: "#9080D8",
    rim: "#70C8E8",
    warm: "#D8B0E8",
    pointA: "#C8B8E8",
    pointB: "#8880C8",
  },

  /** Sphère — verre physique + iridescence */
  sphere: {
    pearl: "#F8F6FF",
    cyan: "#A0F0FF",
    magenta: "#FF80FF",
    violet: "#C0A0FF",
    mint: "#98FFD8",
    innerGlow: "#E6E0F8",
    glassBody: "#E4E0F8",
    attenuation: "#A888D8",
    rimWhite: "#F0EEFF",
    glassTint: "#E0E4F8",
    specBroad: "#E8ECFA",
    specFill: "#D8E0F8",
  },
} as const;

export const sceneBackgroundGradient = `radial-gradient(ellipse 80% 60% at 50% 45%, ${theme.background} 0%, ${theme.backgroundEdge} 100%)`;

/** @deprecated Utiliser `theme` */
export const colors = {
  background: theme.background,
  textPrimary: theme.foreground,
  textSecondary: theme.muted,
  accent: theme.accent,
  softAccent: theme.softAccent,
  border: theme.border,
  surface: theme.surface.base,
  surfaceHover: theme.surface.hover,
} as const;

export const SCENE_BG = theme.background;

export const cssVariables: Record<string, string> = {
  "--background": theme.background,
  "--background-edge": theme.backgroundEdge,
  "--background-gradient": sceneBackgroundGradient,
  "--foreground": theme.foreground,
  "--text-secondary": theme.muted,
  "--accent": theme.accent,
  "--soft-accent": theme.softAccent,
  "--border": theme.border,
  "--on-accent": theme.onAccent,
  "--surface": theme.surface.base,
  "--surface-hover": theme.surface.hover,
  "--surface-subtle": theme.surface.subtle,
  "--surface-panel": theme.surface.panel,
  "--surface-card": theme.surface.card,
  "--surface-menu-hover": theme.surface.menuHover,
  "--overlay": theme.overlay,
  "--scrollbar-track": theme.scrollbar.track,
  "--scrollbar-thumb": theme.scrollbar.thumb,
  "--scrollbar-thumb-hover": theme.scrollbar.thumbHover,
  "--scrollbar-thumb-active": theme.scrollbar.thumbActive,
  "--scrollbar-glow": theme.scrollbar.glow,
  "--scrollbar-gradient-start": theme.scrollbar.gradientStart,
  "--scrollbar-width": "6px",
};

export const sphereGlsl = {
  pearl: toGlslVec3(theme.sphere.pearl),
  cyan: toGlslVec3(theme.sphere.cyan),
  magenta: toGlslVec3(theme.sphere.magenta),
  violet: toGlslVec3(theme.sphere.violet),
  mint: toGlslVec3(theme.sphere.mint),
  innerGlow: toGlslVec3(theme.sphere.innerGlow),
  rimWhite: toGlslVec3(theme.sphere.rimWhite),
  glassTint: toGlslVec3(theme.sphere.glassTint),
  specBroad: toGlslVec3(theme.sphere.specBroad),
  specFill: toGlslVec3(theme.sphere.specFill),
};
