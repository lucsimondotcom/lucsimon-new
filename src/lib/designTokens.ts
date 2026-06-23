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

export const palette = {
  black: "#0A0A0A",
  blue: "#2847F5",
  white: "#F5F5F5",
} as const;

export const theme = {
  palette,

  /** UI — noir, bleu, blanc uniquement */
  background: palette.white,
  foreground: palette.black,
  muted: withAlpha(palette.black, 0.55),
  accent: palette.blue,
  border: withAlpha(palette.black, 0.12),
  onAccent: palette.white,

  surface: {
    base: withAlpha(palette.white, 0.72),
    hover: withAlpha(palette.white, 0.88),
    subtle: withAlpha(palette.black, 0.04),
    panel: withAlpha(palette.white, 0.92),
    card: withAlpha(palette.white, 0.8),
    menuHover: withAlpha(palette.white, 0.65),
  },

  scrollbar: {
    track: withAlpha(palette.black, 0.06),
    thumb: withAlpha(palette.black, 0.2),
    thumbHover: withAlpha(palette.black, 0.35),
    thumbActive: palette.blue,
    glow: withAlpha(palette.blue, 0.18),
    gradientStart: withAlpha(palette.black, 0.14),
  },

  overlay: withAlpha(palette.black, 0.1),

  /**
   * Scène Three.js — dérivée du noir / bleu / blanc UI.
   * Lisible sur fond noir (pont) et bleu (expertise).
   */
  scene: {
    /** Orbites, arêtes cube, sphères fil de fer */
    orbitLine: "#6B85FF",
    /** Points d’étape, électrons */
    orbitNode: "#E8EEFF",
    /** Anneaux au sol */
    floorRing: "#3D5FD9",
    floorRingOuter: "#5575F2",
    floorShadow: "#1A2E7A",
    shadowCore: "#0D1848",
    shadowReflection: palette.white,
    floorDot: "#5A72F0",
  },

  lights: {
    ambient: palette.white,
    key: palette.white,
    fill: "#5575F2",
    rim: "#A8BCFF",
    warm: "#7B9AFF",
    pointA: "#8899FF",
    pointB: "#4466EE",
  },

  /**
   * Sphère holographique — dégradé bleu (plus de magenta / cyan / violet).
   * Noms conservés pour le shader GLSL (cyan, magenta, violet, mint).
   */
  sphere: {
    pearl: palette.white,
    cyan: "#5B7AFF",
    magenta: "#4466EE",
    violet: palette.blue,
    mint: "#C5D4FF",
    innerGlow: palette.white,
    glassBody: palette.white,
    attenuation: "#5575F2",
    rimWhite: palette.white,
    glassTint: "#B8C9FF",
    specBroad: palette.white,
    specFill: "#D4DEFF",
  },
} as const;

export const sceneBackgroundGradient = theme.background;

/** @deprecated Utiliser `theme` */
export const colors = {
  background: theme.background,
  textPrimary: theme.foreground,
  textSecondary: theme.muted,
  accent: theme.accent,
  border: theme.border,
  surface: theme.surface.base,
  surfaceHover: theme.surface.hover,
} as const;

export const SCENE_BG = theme.background;

export const cssVariables: Record<string, string> = {
  "--background": theme.background,
  "--background-gradient": sceneBackgroundGradient,
  "--foreground": theme.foreground,
  "--text-secondary": theme.muted,
  "--accent": theme.accent,
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
