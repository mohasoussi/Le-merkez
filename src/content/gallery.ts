import type { Media } from "./types";

/**
 * Galerie éditoriale. Chaque photo a un format qui détermine sa place dans la composition.
 * Déposer les images dans /public/images/galerie/ puis renseigner `src`.
 */
export type GalleryFormat = "portrait" | "landscape" | "full" | "square";

export interface GalleryItem extends Media {
  category: string;
  format: GalleryFormat;
}

export const galleryIntro = {
  eyebrow: "Galerie",
  title: "Des visages, des lieux, des liens",
  mosaicCaption: "Une mosaïque de personnes différentes forme une seule image.",
  /** Image unique reconstituée par la mosaïque (portrait de groupe, rencontre…). */
  mosaicImage: {
    src: null,
    alt: "Rencontre de personnes d’horizons différents",
    placeholder: "[PHOTO DE GROUPE À FOURNIR]",
  } as Media,
};

export const gallery: GalleryItem[] = [
  { category: "Rencontres", format: "portrait", src: null, alt: "Rencontre", placeholder: "[PHOTO — Rencontres]" },
  { category: "Retraites", format: "landscape", src: "/images/retraites/flute.jpg", alt: "Un participant joue de la flûte traversière pendant une retraite" },
  { category: "Conférences", format: "square", src: null, alt: "Conférence", placeholder: "[PHOTO — Conférences]" },
  { category: "Retraites", format: "full", src: "/images/retraites/musique.jpg", alt: "Musique partagée à l’oud et à la guitare pendant une retraite" },
  { category: "Actions humanitaires", format: "landscape", src: null, alt: "Action humanitaire", placeholder: "[PHOTO — Humanitaire]" },
  { category: "Voyages", format: "portrait", src: null, alt: "Voyage", placeholder: "[PHOTO — Voyages]" },
  { category: "Retraites", format: "portrait", src: "/images/retraites/marche.jpg", alt: "Marche en forêt, vêtus de muraqaas colorées" },
  { category: "Livres", format: "square", src: null, alt: "Livres", placeholder: "[PHOTO — Livres]" },
];
