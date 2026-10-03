/** Une image du site. `src: null` = photo pas encore fournie → un placeholder clairement identifié est affiché. */
export interface Media {
  src: string | null;
  alt: string;
  /** Libellé du placeholder affiché tant que `src` est vide. */
  placeholder?: string;
  width?: number;
  height?: number;
}

export interface LinkItem {
  label: string;
  href: string;
}
