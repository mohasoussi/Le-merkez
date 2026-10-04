/** Textes de la page d'accueil. Modifier ici, pas dans les composants. */

export const verse = {
  fr: "Ô hommes ! Nous vous avons créés d’un homme et d’une femme, et Nous avons fait de vous des peuples et des tribus afin que vous vous connaissiez.",
  short: "Nous avons fait de vous des peuples et des tribus afin que vous vous connaissiez.",
  ar: "وَجَعَلْنَاكُمْ شُعُوبًا وَقَبَائِلَ لِتَعَارَفُوا",
  reference: "Coran, sourate Al-Hujurât (49), verset 13",
};

export const hero = {
  title: "Le Merkez",
  tagline: ["Créer des ponts.", "Se rencontrer.", "Se connaître.", "Servir."],
  primaryCta: { label: "Découvrir le Merkez", href: "#vision" },
  secondaryCta: { label: "Soutenir le projet", href: "#soutenir" },
  /**
   * Vidéo de fond cinématographique (rencontres, mains, visages, paysages…).
   * Déposer les fichiers dans /public/videos puis renseigner les chemins.
   * Tant que `src` est vide, une composition animée de fragments textiles est affichée.
   */
  video: {
    src: null as string | null, // ex. "/videos/hero.mp4"
    srcWebm: null as string | null, // ex. "/videos/hero.webm"
    poster: null as string | null, // ex. "/images/hero-poster.jpg"
    placeholder: "[VIDÉO HERO À FOURNIR]",
  },
};

/**
 * Photos qui défilent derrière le titre du hero, toutes les 3 secondes, en alternant :
 * le projet du Merkez → une rencontre interreligieuse → une retraite spirituelle → …
 * L'ordre ci-dessous EST l'ordre de passage : garder l'alternance projet / interreligieux / retraite.
 */
export type HeroGroup = "projet" | "interreligieux" | "retraite";

export interface HeroSlide {
  src: string;
  alt: string;
  group: HeroGroup;
  /** Légende affichée en bas à gauche. */
  caption: string;
  /** Cadrage de l'image (object-position CSS). */
  position?: string;
}

export const heroGroups: Record<HeroGroup, { label: string; color: string }> = {
  projet: { label: "Le projet du Merkez", color: "#c99a3e" },
  interreligieux: { label: "Rencontres interreligieuses", color: "#e3a493" },
  retraite: { label: "Retraites spirituelles", color: "#a9cfa6" },
};

/** Intervalle entre deux photos (millisecondes). */
export const heroSlideDelay = 3000;

const projet = "/images/projet";
const concept = "Visualisation conceptuelle du futur lieu";
const fleury = "/images/actions/rencontre-abbaye-de-fleury";
const paix = "/images/actions/rencontre-centre-etudes-paix";
const blue = "/images/actions/retraite-blue-mountains";

export const heroSlides: HeroSlide[] = [
  { src: `${projet}/vue-aerienne.jpg`, alt: "Vue aérienne d’un lieu de rencontre au cœur des collines : bâtiment en bois, yourtes et pavillon aux couleurs de patchwork", group: "projet", caption: concept },
  { src: `${fleury}/jardin.jpg`, alt: "Fuqaras en muraqaa et moines bénédictins réunis dans le parc de l’abbaye de Fleury", group: "interreligieux", caption: "Rencontre à l’abbaye de Fleury", position: "50% 55%" },
  { src: `${blue}/groupe-panorama.jpg`, alt: "Photo de groupe des participants à la retraite des Blue Mountains, sur un belvédère", group: "retraite", caption: "Retraite dans les Blue Mountains", position: "50% 70%" },

  { src: `${projet}/ensemble-pierre-bois.jpg`, alt: "Vue aérienne d’un ensemble de pierre et de bois entouré de potagers, avec une yourte en patchwork", group: "projet", caption: concept },
  { src: `${paix}/table-ronde.jpg`, alt: "Repas partagé entre disciples en muraqaa et membres d’une association", group: "interreligieux", caption: "Rencontre au Centre d’études pour la Paix" },
  { src: "/images/retraites/musique.jpg", alt: "Musique partagée à l’oud et à la guitare pendant une retraite", group: "retraite", caption: "Retraite spirituelle" },

  { src: `${projet}/vallee-yourte.jpg`, alt: "Une yourte aux motifs de patchwork, des potagers et des moutons dans une vallée", group: "projet", caption: concept },
  { src: `${fleury}/abbaye.jpg`, alt: "Trois fuqaras devant la basilique de l’abbaye de Fleury", group: "interreligieux", caption: "Abbaye de Fleury, Saint-Benoît-sur-Loire", position: "50% 40%" },
  { src: "/images/retraites/flute.jpg", alt: "Un participant joue de la flûte traversière pendant une retraite", group: "retraite", caption: "Retraite spirituelle" },

  { src: `${projet}/jardin-potager.jpg`, alt: "Yourtes, potager et clôtures de bois dans les collines, des personnes vêtues de couleurs se promènent", group: "projet", caption: concept },
  { src: `${paix}/salle-lumineuse.jpg`, alt: "Table dressée dans une salle lumineuse ouverte sur un jardin, convives de tous âges", group: "interreligieux", caption: "Rencontre au Centre d’études pour la Paix" },
  { src: "/images/retraites/marche.jpg", alt: "Marche en forêt, vêtus de muraqaas aux carrés de tissu colorés", group: "retraite", caption: "Retraite spirituelle", position: "50% 62%" },
];

/**
 * Vidéo affichée sous le hero, dans un cadre en patchwork.
 * `youtubeId` : l'identifiant dans le lien (youtu.be/XXXXXXXXXXX). Laisser vide pour masquer la section.
 */
export const film = {
  youtubeId: "PGJgaHGDcS8",
  url: "https://youtu.be/PGJgaHGDcS8",
  eyebrow: "En vidéo",
  /** Titre du lecteur (accessibilité) — à préciser quand le titre de la vidéo est confirmé. */
  title: "Vidéo du Merkez",
  /** Légende facultative sous le cadre. */
  caption: null as string | null,
};

export const vision = {
  /** Phrase écrite au cœur du patchwork qui se constitue (seul texte de la section). */
  statement:
    "Le Merkez est un espace dédié à la rencontre, au dialogue, à la transmission et à réunir ce qui semble séparé.",
};



export const inAction = {
  eyebrow: "Le Merkez en action",
  intro: "Le Merkez n’est pas uniquement une idée. C’est un projet qui vit sur le terrain.",
  steps: [
    { word: "Rencontrer", line: "Aller vers l’autre, au-delà de ce qui sépare." },
    { word: "Échanger", line: "Écouter, parler, apprendre les uns des autres." },
    { word: "Transmettre", line: "Partager un savoir, une expérience, une sagesse." },
    { word: "Servir", line: "Se mettre au service de ceux qui en ont besoin." },
    { word: "Construire", line: "Bâtir ensemble des liens durables et un lieu commun." },
  ],
};

/** Le récit du site, rappelé en clôture. */
export const story = [
  "Des peuples différents",
  "Des histoires différentes",
  "Des rencontres",
  "Des liens",
  "Une communauté",
  "Un lieu",
  "Le Merkez",
];
