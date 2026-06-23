export interface ProjectVisual {
  src: string;
  alt: string;
}

export interface ProjectWebsiteLink {
  label: string;
  url: string;
}

export interface ProjectSpec {
  label: string;
  value: string;
}

export interface ProjectDetail {
  subtitle: string;
  website?: ProjectWebsiteLink;
  visuals: ProjectVisual[];
  specs: ProjectSpec[];
}

export interface Project {
  /** Slug URL — ex. "citizen-k" → /projets/citizen-k */
  slug: string;
  title: string;
  client: string;
  description: string;
  tags: string[];
  accent: string;
  /** Visuel scroll / liste : JPEG/PNG/WebP pour Three.js ; SVG ok pour la liste statique */
  image?: string;
  detail: ProjectDetail;
}

export const PROJECTS: Project[] = [
  {
    slug: "agamea",
    title: "Agaméa",
    client: "Agence digitale",
    description:
      "Refonte complète du parcours de commande : catalogue, devis automatisés et suivi client en temps réel.",
    tags: ["Next.js", "API", "ERP"],
    accent: "#8b9cf7",
    image: "/projects/agamea-sphere.jpg",
    detail: {
      subtitle:
        "Refonte du parcours de commande : catalogue, devis automatisés et suivi client en temps réel.",
      website: {
        label: "agamea.fr",
        url: "https://agamea.fr",
      },
      visuals: [
        { src: "/projects/agamea-sphere.jpg", alt: "Agaméa — vue d'ensemble" },
        { src: "/projects/plateforme-b2b.svg", alt: "Agaméa — parcours catalogue" },
        { src: "/projects/dashboard-ops.svg", alt: "Agaméa — suivi client" },
      ],
      specs: [
        { label: "Client", value: "Agence digitale" },
        { label: "Rôle", value: "Product Engineer — conception & développement" },
        { label: "Stack", value: "Next.js, API REST, ERP" },
        { label: "Livraison", value: "2024" },
      ],
    },
  },
  {
    slug: "monfort",
    title: "Théâtre Silvia Monfort",
    client: "Ville de Paris",
    description:
      "Centralisation des KPIs, alertes métier et visualisation des flux pour piloter l'activité au quotidien.",
    tags: ["React", "Données", "Automatisation"],
    accent: "#7ec8e3",
    image: "/projects/monfort-sphere.jpg",
    detail: {
      subtitle:
        "Centralisation des KPIs, alertes métier et visualisation des flux pour piloter l'activité au quotidien.",
      website: {
        label: "theatresilviamonfort.com",
        url: "https://theatresilviamonfort.com",
      },
      visuals: [
        { src: "/projects/mockup-monfort-1.jpg", alt: "Monfort — vue d'ensemble" },
        { src: "/projects/mockup-monfort-2.jpg", alt: "Monfort — dashboard KPIs" },
        { src: "/projects/mockup-monfort-3.jpg", alt: "Monfort — flux opérationnels" },
        { src: "/projects/mockup-monfort-4.jpg", alt: "Monfort — alertes métier" },
      ],
      specs: [
        { label: "Client", value: "Ville de Paris" },
        { label: "Rôle", value: "Architecture data & développement front" },
        { label: "Stack", value: "React, Node.js, PostgreSQL" },
        { label: "Livraison", value: "2023" },
      ],
    },
  },
  {
    slug: "citizen-k",
    title: "Citizen K",
    client: "Cabinet conseil",
    description:
      "Architecture de contenu, performance web et parcours de prise de contact optimisé pour la génération de leads.",
    tags: ["Next.js", "SEO", "Analytics"],
    accent: "#c4a8e0",
    image: "/projects/site-conversion.svg",
    detail: {
      subtitle:
        "Conception d’un écosystème média et e-commerce international, conçu pour la croissance et la performance.",
      website: {
        label: "citizenk.fr",
        url: "https://citizenk.fr",
      },
      visuals: [
        { src: "/projects/mockup-citizenk-1.jpg", alt: "Citizen K — page d'accueil" },
        { src: "/projects/mockup-citizenk-2.jpg", alt: "Citizen K — parcours contact" },
        { src: "/projects/mockup-citizenk-3.jpg", alt: "Citizen K — analytics" },
        { src: "/projects/mockup-citizenk-4.jpg", alt: "Citizen K — analytics" },
      ],
      specs: [
        { label: "Besoin", value: "Création from scratch" },
        { label: "Rôle", value: "Stratégie, design system & développement" },
        { label: "Stack", value: "WordPress, GSAP, Lenis" },
        { label: "Livraison", value: "2024" },
      ],
    },
  },
  {
    slug: "e-tonus",
    title: "E-Tonus",
    client: "Agence créative",
    description:
      "Remplacement d'un empilement de spreadsheets par un outil unifié : projets, planning et facturation.",
    tags: ["TypeScript", "PostgreSQL", "Auth"],
    accent: "#e8a8c8",
    image: "/projects/outil-interne.svg",
    detail: {
      subtitle:
        "Conception et pilotage d’un écosystème digital complet autour d’un objet connecté, intégrant applications mobiles, backend, plateforme web et e-commerce.",
      visuals: [
        { src: "/projects/mockup-e-tonus-1.jpg", alt: "E-Tonus mockup 1" },
        { src: "/projects/mockup-e-tonus-2.jpg", alt: "E-Tonus mockup 2" },
        { src: "/projects/mockup-e-tonus-3.jpg", alt: "E-Tonus mockup 3" },
        { src: "/projects/mockup-e-tonus-4.jpg", alt: "E-Tonus mockup 4" },
      ],
      specs: [
        { label: "Rôle", value: "Product design & développement full-stack" },
        { label: "Stack", value: "TypeScript, Auth, PostgreSQL, API" },
        { label: "Supports", value: "Web, iOS, Android" },
        { label: "Livraison", value: "2025" },
      ],
    },
  },
  {
    slug: "agifi",
    title: "Agifi",
    client: "E-commerce",
    description:
      "Synchronisation boutique, CRM et emailing : segmentation dynamique et relances automatisées.",
    tags: ["Intégrations", "Webhooks", "n8n"],
    accent: "#9ed4c4",
    image: "/projects/automatisation-crm.svg",
    detail: {
      subtitle:
        "Synchronisation boutique, CRM et emailing : segmentation dynamique et relances automatisées.",
      visuals: [
        { src: "/projects/mockup-agifi-1.jpg", alt: "Agifi mockup 1" },
        { src: "/projects/mockup-agifi-2.jpg", alt: "Agifi mockup 2" },
        { src: "/projects/mockup-agifi-3.jpg", alt: "Agifi mockup 3" },
        { src: "/projects/mockup-agifi-4.jpg", alt: "Agifi mockup 4" },
      ],
      specs: [
        { label: "Client", value: "E-commerce" },
        { label: "Rôle", value: "Intégrations & automatisation" },
        { label: "Stack", value: "Webhooks, n8n, API CRM" },
        { label: "Livraison", value: "2024" },
      ],
    },
  },
  {
    slug: "royal-cheese",
    title: "Royal Cheese",
    client: "E-commerce",
    description:
      "Synchronisation boutique, CRM et emailing : segmentation dynamique et relances automatisées.",
    tags: ["Intégrations", "Webhooks", "n8n"],
    accent: "#9ed4c4",
    image: "/projects/automatisation-crm.svg",
    detail: {
      subtitle:
        "Synchronisation boutique, CRM et emailing : segmentation dynamique et relances automatisées.",
      visuals: [
        { src: "/projects/mockup-royal-cheese-1.jpg", alt: "Royal Cheese mockup 1" },
        { src: "/projects/mockup-royal-cheese-2.jpg", alt: "Royal Cheese mockup 2" },
        { src: "/projects/mockup-royal-cheese-3.jpg", alt: "Royal Cheese mockup 3" },
        { src: "/projects/mockup-royal-cheese-4.jpg", alt: "Royal Cheese mockup 4" },
      ],
      specs: [
        { label: "Client", value: "E-commerce" },
        { label: "Rôle", value: "Intégrations & automatisation" },
        { label: "Stack", value: "Shopify, Klaviyo, n8n" },
        { label: "Livraison", value: "2024" },
      ],
    },
  },
  {
    slug: "niagara-studio",
    title: "Niagara",
    client: "E-commerce",
    description:
      "Synchronisation boutique, CRM et emailing : segmentation dynamique et relances automatisées.",
    tags: ["Intégrations", "Webhooks", "n8n"],
    accent: "#9ed4c4",
    image: "/projects/automatisation-crm.svg",
    detail: {
      subtitle:
        "Synchronisation boutique, CRM et emailing : segmentation dynamique et relances automatisées.",
      visuals: [
        { src: "/projects/automatisation-crm.svg", alt: "Niagara — vue d'ensemble" },
        { src: "/projects/plateforme-b2b.svg", alt: "Niagara — flux e-commerce" },
        { src: "/projects/outil-interne.svg", alt: "Niagara — automatisations" },
      ],
      specs: [
        { label: "Client", value: "E-commerce" },
        { label: "Rôle", value: "Intégrations & automatisation" },
        { label: "Stack", value: "WooCommerce, CRM, n8n" },
        { label: "Livraison", value: "2023" },
      ],
    },
  },
 
  {
    slug: "wildseat",
    title: "Wildseat",
    client: "E-commerce",
    description:
      "Synchronisation boutique, CRM et emailing : segmentation dynamique et relances automatisées.",
    tags: ["Intégrations", "Webhooks", "n8n"],
    accent: "#9ed4c4",
    image: "/projects/automatisation-crm.svg",
    detail: {
      subtitle:
        "Synchronisation boutique, CRM et emailing : segmentation dynamique et relances automatisées.",
      visuals: [
        { src: "/projects/automatisation-crm.svg", alt: "Wildseat — vue d'ensemble" },
        { src: "/projects/dashboard-ops.svg", alt: "Wildseat — segmentation" },
        { src: "/projects/site-conversion.svg", alt: "Wildseat — parcours acquisition" },
        { src: "/projects/outil-interne.svg", alt: "Wildseat — relances" },
      ],
      specs: [
        { label: "Client", value: "E-commerce" },
        { label: "Rôle", value: "Intégrations & automatisation" },
        { label: "Stack", value: "PrestaShop, emailing, n8n" },
        { label: "Livraison", value: "2023" },
      ],
    },
  },
  {
    slug: "well-done-john",
    title: "Well Done John",
    client: "E-commerce",
    description:
      "Synchronisation boutique, CRM et emailing : segmentation dynamique et relances automatisées.",
    tags: ["Intégrations", "Webhooks", "n8n"],
    accent: "#9ed4c4",
    image: "/projects/automatisation-crm.svg",
    detail: {
      subtitle:
        "Synchronisation boutique, CRM et emailing : segmentation dynamique et relances automatisées.",
      visuals: [
        { src: "/projects/automatisation-crm.svg", alt: "Wildseat — vue d'ensemble" },
        { src: "/projects/dashboard-ops.svg", alt: "Wildseat — segmentation" },
        { src: "/projects/site-conversion.svg", alt: "Wildseat — parcours acquisition" },
        { src: "/projects/outil-interne.svg", alt: "Wildseat — relances" },
      ],
      specs: [
        { label: "Client", value: "E-commerce" },
        { label: "Rôle", value: "Intégrations & automatisation" },
        { label: "Stack", value: "PrestaShop, emailing, n8n" },
        { label: "Livraison", value: "2023" },
      ],
    },
  },
];

/** Alias conservé pour le scroll projets */
export const RECENT_PROJECTS = PROJECTS;

export const PROJECT_COUNT = PROJECTS.length;

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}

export function getProjectSlugs(): string[] {
  return PROJECTS.map((project) => project.slug);
}

export function getProjectIndex(slug: string): number {
  return PROJECTS.findIndex((project) => project.slug === slug);
}

export interface ResolvedProjectPage {
  project: Project;
  index: number;
  total: number;
}

export function resolveProjectPage(slug: string): ResolvedProjectPage | null {
  const projectIndex = getProjectIndex(slug);
  if (projectIndex === -1) return null;

  return {
    project: PROJECTS[projectIndex],
    index: projectIndex + 1,
    total: PROJECTS.length,
  };
}

export function getNextProject(slug: string): Project | null {
  const index = getProjectIndex(slug);
  if (index === -1) return null;

  return PROJECTS[(index + 1) % PROJECTS.length];
}
