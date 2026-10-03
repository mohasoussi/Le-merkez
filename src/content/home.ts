import type { Media } from "./types";

/** Textes de la page d'accueil. Modifier ici, pas dans les composants. */

export const verse = {
  fr: "Ô hommes ! Nous vous avons créés d’un homme et d’une femme, et Nous avons fait de vous des peuples et des tribus afin que vous vous connaissiez.",
  short: "Nous avons fait de vous des peuples et des tribus afin que vous vous connaissiez.",
  ar: "وَجَعَلْنَاكُمْ شُعُوبًا وَقَبَائِلَ لِتَعَارَفُوا",
  reference: "Coran, sourate Al-Hujurât (49), verset 13",
};

export const pillars = ["Se connaître", "Se rencontrer", "Se lier", "Transmettre", "Servir"];

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

export const vision = {
  eyebrow: "Notre vision",
  title: "Se connaître pour mieux se comprendre",
  paragraphs: [
    "Le Merkez est un espace dédié à la rencontre, au dialogue, à la transmission et au service.",
    "Sous la direction du Shaykh Mohamed Faouzi Al Karkari, le projet cherche à créer des espaces où des personnes issues d’horizons différents peuvent se rencontrer, échanger, apprendre les unes des autres et construire des liens durables.",
  ],
  emphasis: ["La diversité n’est pas ici considérée comme une séparation.", "Elle devient une richesse."],
  centerQuote: ["Différents par nos histoires.", "Unis par notre humanité."],
};

/** Animation « mots venant de toutes les directions → RENCONTRE ». */
export const convergence = {
  eyebrow: "Des peuples différents · Des histoires différentes",
  word: "Rencontre",
  /** Le mot « rencontre » dans différentes langues. */
  words: [
    { text: "Encuentro", lang: "es" },
    { text: "Meeting", lang: "en" },
    { text: "لقاء", lang: "ar" },
    { text: "Begegnung", lang: "de" },
    { text: "Incontro", lang: "it" },
    { text: "Buluşma", lang: "tr" },
    { text: "Encontro", lang: "pt" },
    { text: "Ontmoeting", lang: "nl" },
    { text: "מפגש", lang: "he" },
    { text: "Spotkanie", lang: "pl" },
    { text: "Ἀπάντησις", lang: "grc" },
    { text: "Mkutano", lang: "sw" },
  ],
  caption: "Les différences ne sont pas des barrières : elles composent une œuvre commune.",
};

export const muraqaa = {
  eyebrow: "La muraqaa",
  title: "Une multitude de couleurs, un seul vêtement",
  /**
   * Photographie de la muraqaa. Déposer le fichier (ex. /public/images/muraqaa.jpg)
   * puis renseigner `src`, `width` et `height`.
   */
  image: {
    src: null,
    alt: "La muraqaa : vêtement composé de carrés de tissus de couleurs et de motifs différents",
    placeholder: "[PHOTO DE LA MURAQAA À FOURNIR]",
  } as Media,
  highlights: ["Sa propre couleur", "Son propre motif", "Son histoire"],
  /**
   * Zones de la photo mises en évidence au scroll (en % de l'image : x, y, largeur, hauteur).
   * À ajuster sur les carrés les plus parlants une fois la photo fournie.
   */
  focus: [
    { x: 12.5, y: 10, w: 25, h: 20 },
    { x: 50, y: 40, w: 37.5, h: 20 },
    { x: 25, y: 70, w: 25, h: 20 },
  ],
  text: [
    "Chaque morceau possède sa propre couleur, son propre motif, son histoire.",
    "Mais tous sont réunis dans un même vêtement.",
    "La muraqaa devient ainsi une image du projet du Merkez : des peuples différents, des traditions différentes, des histoires différentes, réunis dans un même espace de rencontre.",
  ],
  legend: "Chaque carré : une personne, une culture, une communauté, une tradition, un peuple.",
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
