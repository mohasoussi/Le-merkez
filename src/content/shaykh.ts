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
    src: null,
    alt: "Portrait du Shaykh Mohamed Faouzi Al Karkari",
    placeholder: "[PORTRAIT À FOURNIR]",
  } as Media,
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
