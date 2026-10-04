import type { Media } from "./types";

/**
 * Événements à venir. La page Actualités met automatiquement en avant le PROCHAIN événement
 * (le plus proche dans le futur) ; les événements passés ne sont pas affichés ici.
 *
 * Pour en ajouter un : ajouter un objet ci-dessous (date au format AAAA-MM-JJ). Une fois la date passée,
 * l'événement disparaît tout seul de l'encart — il peut alors devenir un article dans src/content/actions.ts.
 */
export interface MerkezEvent {
  slug: string;
  title: string;
  /** Date ISO (AAAA-MM-JJ) — premier jour. */
  date: string;
  /** Dernier jour pour un événement de plusieurs jours (AAAA-MM-JJ), facultatif. */
  endDate?: string | null;
  /** Heure indicative (ex. « 18 h 30 »), facultative. */
  time?: string | null;
  location?: string | null;
  description?: string | null;
  image?: Media | null;
  /** Lien d'inscription ou d'information, facultatif. */
  link?: { label: string; href: string } | null;
  /** Article détaillé (catégorie + slug dans src/content/actions.ts), facultatif. */
  article?: { category: string; slug: string } | null;
}

export const events: MerkezEvent[] = [
  {
    slug: "rencontre-d-assise-40-ans-apres",
    title: "La Rencontre d’Assise, 40 ans après ! — Grande marche pour la paix",
    date: "2026-10-18",
    time: "de 8 h 15 à 20 h 40",
    location: "Paris",
    description:
      "La responsabilité des religions et des cultures dans la construction de la paix. Une marche de lieu de culte en lieu de culte, ouverte à toutes et à tous : rejoignez-la à l’étape de votre choix.",
    image: { src: "/images/evenements/assise-affiche.jpg", alt: "Affiche : La Rencontre d’Assise, 40 ans après ! Dimanche 18 octobre 2026, Paris, grande marche pour la paix", width: 1061, height: 1500 },
    article: { category: "rencontres-interreligieuses", slug: "rencontre-d-assise-40-ans-apres" },
  },
  {
    slug: "retraite-mont-blanc-chamonix",
    title: "Retraite spirituelle soufie au cœur du Mont-Blanc",
    date: "2026-12-04",
    endDate: "2026-12-07",
    location: "Chamonix",
    description:
      "Quatre jours et trois nuits hors du tumulte du monde, face au Mont Blanc : méditation, marche en montagne, enseignements et visite de la « Mer de glace », avec le compagnonnage du Shaykh Mohamed Faouzi al-Karkari. Tarif : 280 € (pension complète).",
    image: { src: "/images/evenements/mont-blanc-affiche.jpg", alt: "Affiche : retraite spirituelle soufie au cœur du Mont-Blanc, du 4 au 7 décembre 2026 à Chamonix", width: 509, height: 720 },
    link: { label: "Réserver sur thezawiya.fr", href: "https://thezawiya.fr" },
    article: { category: "retraites-spirituelles", slug: "retraite-mont-blanc-chamonix" },
  },
];

export const eventsIntro = {
  eyebrow: "Prochain rendez-vous",
  followingEyebrow: "Ensuite",
  empty: "[PROCHAIN ÉVÉNEMENT À AJOUTER]",
  emptyNote: "Les prochaines rencontres, retraites et conférences seront annoncées ici.",
};
