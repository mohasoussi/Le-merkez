/**
 * Configuration générale du site : identité, navigation, réseaux, contact.
 * Tous les champs entre crochets [ ... ] sont des placeholders à remplacer.
 */
export const site = {
  name: "Le Merkez",
  title: "Le Merkez — Créer des ponts entre les peuples",
  description:
    "Le Merkez est un espace dédié à la rencontre, au dialogue, à la spiritualité, à la transmission et aux actions humanitaires.",
  tagline: "Créer des ponts entre les peuples.",
  /** URL publique : définir NEXT_PUBLIC_SITE_URL au déploiement. */
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  locale: "fr_FR",
  director: "Shaykh Mohamed Faouzi Al Karkari",

  /**
   * Affiche (true) ou masque (false) les étiquettes « [PHOTO À FOURNIR] » sur les visuels
   * de remplacement. Laisser à true tant que le contenu n'est pas complet.
   */
  showPlaceholderLabels: true,
};

export const nav = [
  { label: "Vision", href: "/#vision" },
  { label: "Muraqaa", href: "/#muraqaa" },
  { label: "Nos actions", href: "/#actions" },
  { label: "Le Shaykh", href: "/#shaykh" },
  { label: "Actualités", href: "/actualites" },
  { label: "Librairie", href: "/librairie" },
  { label: "Soutenir", href: "/#soutenir" },
];

export const footerLinks = [
  { label: "Vision", href: "/#vision" },
  { label: "Nos actions", href: "/#actions" },
  { label: "Rencontres", href: "/actions/rencontres-interreligieuses" },
  { label: "Retraites", href: "/actions/retraites-spirituelles" },
  { label: "Conférences", href: "/actions/conferences-tables-rondes" },
  { label: "Humanitaire", href: "/actions/actions-humanitaires" },
  { label: "Librairie", href: "/librairie" },
  { label: "Soutenir", href: "/#soutenir" },
  { label: "Contact", href: "/#contact" },
];

/** Réseaux sociaux — `href: null` tant que l'URL n'est pas fournie. */
export const socials: { label: string; href: string | null; placeholder: string }[] = [
  { label: "Instagram", href: null, placeholder: "[LIEN INSTAGRAM À AJOUTER]" },
  { label: "YouTube", href: null, placeholder: "[LIEN YOUTUBE À AJOUTER]" },
  { label: "Facebook", href: null, placeholder: "[LIEN FACEBOOK À AJOUTER]" },
  { label: "TikTok", href: null, placeholder: "[LIEN TIKTOK À AJOUTER]" },
];

/** Coordonnées — `null` tant qu'elles ne sont pas fournies. */
export const contact = {
  email: null as string | null,
  emailPlaceholder: "[EMAIL DE CONTACT À AJOUTER]",
  phone: null as string | null,
  phonePlaceholder: "[TÉLÉPHONE À AJOUTER]",
  address: null as string | null,
  addressPlaceholder: "[ADRESSE À AJOUTER]",
};
