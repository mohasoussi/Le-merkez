import type { Media } from "./types";

/**
 * Section consacrée au Shaykh.
 * ⚠️ Ne publier que des informations vérifiées. Chaque champ entre crochets est à remplacer.
 */
export interface ShaykhEntry {
  title: string;
  date: string | null;
  href: string | null;
  meta?: string;
}

export const shaykh = {
  eyebrow: "Direction",
  name: "Shaykh Mohamed Faouzi Al Karkari",
  title: "Sous la direction du Shaykh Mohamed Faouzi Al Karkari",
  portrait: {
    src: "/images/shaykh/portrait-muraqaa.jpg",
    alt: "Le Shaykh Mohamed Faouzi Al Karkari vêtu d’une muraqaa aux carrés de couleurs",
    width: 1170,
    height: 1553,
  } as Media,
  /** Photos affichées sous la biographie (« En images »). `credit` : mention du photographe. */
  photos: [
    {
      src: "/images/shaykh/marche-lumiere.jpg",
      alt: "Le Shaykh marche de dos sur un chemin de montagne, vêtu d’une muraqaa, face au soleil",
      width: 1260,
      height: 1780,
    },
    {
      src: "/images/shaykh/conference.jpg",
      alt: "Le Shaykh Mohamed Faouzi Al Karkari s’exprime au micro lors d’une conférence",
      width: 1600,
      height: 1200,
      credit: "Photo : TellementCliché",
    },
    {
      src: "/images/shaykh/marche-desert.jpg",
      alt: "Le Shaykh marche, canne à la main, sur un chemin de terre sous un ciel nuageux",
      width: 750,
      height: 563,
    },
  ] as (Media & { credit?: string })[],
  /** Biographie : paragraphes vérifiés à ajouter. */
  biography: ["[BIOGRAPHIE VÉRIFIÉE À AJOUTER]"],
  tabs: {
    enseignements: {
      label: "Enseignements",
      items: [{ title: "[ENSEIGNEMENT À AJOUTER]", date: null, href: null }] as ShaykhEntry[],
    },
    conferences: {
      label: "Conférences",
      items: [{ title: "[CONFÉRENCE À AJOUTER]", date: null, href: null, meta: "[LIEU À AJOUTER]" }] as ShaykhEntry[],
    },
    videos: {
      label: "Vidéos",
      /** `href` : lien YouTube ou autre, à ajouter. */
      items: [{ title: "[VIDÉO À AJOUTER]", date: null, href: null }] as ShaykhEntry[],
    },
    publications: {
      label: "Publications",
      items: [{ title: "[PUBLICATION À AJOUTER]", date: null, href: null }] as ShaykhEntry[],
    },
  },
};
