export interface SiteNavItem {
  label: string;
  href: string;
}

export const LANDING_SECTIONS = {
  methode: "methode",
  projets: "projets",
  aPropos: "a-propos",
  visio: "visio",
} as const;

export function sectionHref(sectionId: string) {
  return `/#${sectionId}`;
}

export const SITE_NAV: SiteNavItem[] = [
  { label: "Expertise", href: sectionHref(LANDING_SECTIONS.methode) },
  { label: "Projets", href: sectionHref(LANDING_SECTIONS.projets) },
  { label: "À propos", href: sectionHref(LANDING_SECTIONS.aPropos) },
];

export const SITE_MENU: SiteNavItem[] = [
  ...SITE_NAV,
  { label: "Contact", href: sectionHref(LANDING_SECTIONS.visio) },
];

export const VISIO_PAGE = {
  label: "Contact",
  href: sectionHref(LANDING_SECTIONS.visio),
} as const;

export const CONTACT_EMAIL = "contact@lucsimon.fr";

export const VISIO_MAILTO = `mailto:${CONTACT_EMAIL}?subject=Planifier%20une%20visio`;
