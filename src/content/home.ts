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
