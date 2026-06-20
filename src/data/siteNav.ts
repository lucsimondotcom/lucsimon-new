export interface SiteNavItem {
  label: string;
  href: string;
}

export const SITE_NAV: SiteNavItem[] = [
  { label: "Méthode", href: "/" },
  { label: "Projets", href: "/projets" },
  { label: "À propos", href: "/a-propos" },
];

export const SITE_MENU: SiteNavItem[] = [
  ...SITE_NAV,
  { label: "Planifier une visio", href: "/planifier-une-visio" },
];

export const VISIO_PAGE = {
  label: "Planifier une visio",
  href: "/planifier-une-visio",
} as const;

export const CONTACT_EMAIL = "contact@lucsimon.fr";

export const VISIO_MAILTO = `mailto:${CONTACT_EMAIL}?subject=Planifier%20une%20visio`;
