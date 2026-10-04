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
  /** Date ISO (AAAA-MM-JJ). */
  date: string;
  /** Heure indicative (ex. « 18 h 30 »), facultative. */
  time?: string | null;
  location?: string | null;
  description?: string | null;
  image?: Media | null;
  /** Lien d'inscription ou d'information, facultatif. */
  link?: { label: string; href: string } | null;
}

export const events: MerkezEvent[] = [
  // Exemple à copier :
  // {
  //   slug: "titre-de-l-evenement",
  //   title: "Titre de l’événement",
  //   date: "2026-12-01",
  //   time: "18 h 30",
  //   location: "Lieu de l’événement",
  //   description: "Courte présentation de l’événement.",
  //   image: { src: "/images/evenements/affiche.jpg", alt: "Affiche de l’événement", width: 1200, height: 1600 },
  //   link: { label: "S’inscrire", href: "https://…" },
  // },
];

export const eventsIntro = {
  eyebrow: "Prochain rendez-vous",
  empty: "[PROCHAIN ÉVÉNEMENT À AJOUTER]",
  emptyNote: "Les prochaines rencontres, retraites et conférences seront annoncées ici.",
};
