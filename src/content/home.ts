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
 * Photos qui coulissent derrière le titre du hero : d'abord le projet du Merkez (maquettes),
 * puis les actions menées. `group` donne le libellé affiché ; `caption` précise la nature du visuel.
 * Pour ajouter une photo : l'ajouter à la liste (images dans /public/images/…).
 */
export interface HeroSlide {
  src: string;
  alt: string;
  group: "Le projet du Merkez" | "Nos actions";
  caption: string;
  /** Cadrage de l'image (object-position CSS). */
  position?: string;
}

const projet = "/images/projet";
const concept = "Visualisation conceptuelle du futur lieu";

export const heroSlides: HeroSlide[] = [
  { src: `${projet}/vue-aerienne.jpg`, alt: "Vue aérienne d’un lieu de rencontre au cœur des collines : bâtiment en bois, yourtes et pavillon aux couleurs de patchwork", group: "Le projet du Merkez", caption: concept },
  { src: `${projet}/ensemble-pierre-bois.jpg`, alt: "Vue aérienne d’un ensemble de pierre et de bois entouré de potagers, avec une yourte en patchwork", group: "Le projet du Merkez", caption: concept },
  { src: `${projet}/vallee-yourte.jpg`, alt: "Une yourte aux motifs de patchwork, des potagers et des moutons dans une vallée", group: "Le projet du Merkez", caption: concept },
  { src: `${projet}/jardin-potager.jpg`, alt: "Yourtes, potager et clôtures de bois dans les collines, des personnes vêtues de couleurs se promènent", group: "Le projet du Merkez", caption: concept },
  { src: `${projet}/marche-collines.jpg`, alt: "Des personnes en tenues claires et colorées marchent côte à côte sur un chemin de colline", group: "Le projet du Merkez", caption: concept },
  { src: "/images/actions/rencontre-abbaye-de-fleury/jardin.jpg", alt: "Fuqaras en muraqaa et moines bénédictins réunis dans le parc de l’abbaye de Fleury", group: "Nos actions", caption: "Rencontre à l’abbaye de Fleury", position: "50% 55%" },
  { src: "/images/actions/retraite-blue-mountains/groupe-panorama.jpg", alt: "Photo de groupe des participants à la retraite des Blue Mountains, sur un belvédère", group: "Nos actions", caption: "Retraite dans les Blue Mountains", position: "50% 70%" },
  { src: "/images/retraites/musique.jpg", alt: "Musique partagée à l’oud et à la guitare pendant une retraite", group: "Nos actions", caption: "Retraite spirituelle" },
  { src: "/images/actions/rencontre-centre-etudes-paix/table-ronde.jpg", alt: "Repas partagé entre disciples en muraqaa et membres d’une association", group: "Nos actions", caption: "Rencontre au Centre d’études pour la Paix" },
];

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
