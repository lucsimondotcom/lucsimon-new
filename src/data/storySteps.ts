export interface StoryStep {
  id: string;
  number: string;
  title: string;
  description: string;
  tasks: string[];
}

export const STORY_STEPS: StoryStep[] = [
  {
    id: "understanding",

    number: "01",

    title: "Comprendre",

    description:
      "Chaque projet commence par une question simple : quels problèmes faut-il réellement résoudre ?",

    tasks: ["Besoin", "Contexte", "Utilisateurs", "Objectifs"],
  },

  {
    id: "strategizing",

    number: "02",

    title: "Structurer",

    description:
      "Les idées deviennent une feuille de route claire, alignée sur vos objectifs et vos priorités.",

    tasks: ["Stratégie", "Roadmap", "Priorités", "Architecture"],
  },

  {
    id: "building",

    number: "03",

    title: "Construire",

    description:
      "La stratégie prend forme à travers un système web performant, fiable et conçu pour durer.",

    tasks: ["UX", "Développement", "Intégrations", "Automatisation"],
  },

  {
    id: "launching",

    number: "04",

    title: "Lancer",

    description:
      "La solution entre en production dans les meilleures conditions, prête à être utilisée et à créer de la valeur.",

    tasks: ["Déploiement", "Sécurité", "Performance", "Production"],
  },

  {
    id: "measuring",

    number: "05",

    title: "Mesurer",

    description:
      "Les données révèlent ce qui fonctionne, ce qui peut être amélioré et où se trouvent les prochaines opportunités.",

    tasks: ["Données", "Conversions", "Résultats", "Croissance"],
  },
];

export const STORY_TOTAL = STORY_STEPS.length;
