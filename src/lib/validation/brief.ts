import { z } from "@/lib/zod";

const t = (max = 2000) => z.string().max(max, `${max} caractères maximum.`).optional().default("");

/** Structure du brief client (stockée en JSON, validée ici côté serveur et côté navigateur). */
export const briefDataSchema = z.object({
  identity: z.object({ name: t(150), slogan: t(200), description: t(3000), colors: t(500), fonts: t(500), logo: t(1000) }).partial().default({}),
  company: z.object({ address: t(300), phone: t(40), email: t(200), hours: t(1000), socials: t(1000) }).partial().default({}),
  site: z.object({ pages: t(2000), features: t(2000), languages: t(300), references: t(2000) }).partial().default({}),
  content: z.object({ texts: t(5000), photos: t(2000), videos: t(2000), testimonials: t(5000), pricing: t(5000) }).partial().default({}),
  goal: z.object({ mainAction: t(1000), notes: t(3000) }).partial().default({}),
});
export type BriefData = z.infer<typeof briefDataSchema>;

/** Champs minimum pour pouvoir envoyer le brief. */
export const briefSubmitSchema = z.object({
  identity: z.object({ name: z.string().trim().min(1, "Indiquez le nom à afficher sur le site."), description: z.string().trim().min(10, "Décrivez votre activité en quelques mots.") }),
  goal: z.object({ mainAction: z.string().trim().min(3, "Indiquez l'action principale attendue de vos visiteurs.") }),
});

export const BRIEF_SECTIONS: { key: keyof BriefData; title: string; description: string; fields: { key: string; label: string; hint?: string; long?: boolean }[] }[] = [
  {
    key: "identity",
    title: "Identité",
    description: "Comment votre entreprise doit apparaître.",
    fields: [
      { key: "name", label: "Nom affiché sur le site" },
      { key: "slogan", label: "Slogan", hint: "Facultatif" },
      { key: "description", label: "Description de votre activité", long: true },
      { key: "colors", label: "Couleurs", hint: "Vos couleurs (codes, ou « bleu nuit et doré »…)" },
      { key: "fonts", label: "Typographies", hint: "Si vous en avez déjà" },
      { key: "logo", label: "Logo", hint: "Avez-vous un logo ? Déposez-le dans l'onglet Fichiers." },
    ],
  },
  {
    key: "company",
    title: "Entreprise",
    description: "Les informations de contact à afficher.",
    fields: [
      { key: "address", label: "Adresse" },
      { key: "phone", label: "Téléphone" },
      { key: "email", label: "Email de contact" },
      { key: "hours", label: "Horaires", long: true },
      { key: "socials", label: "Réseaux sociaux", hint: "Liens Instagram, Facebook, TikTok…", long: true },
    ],
  },
  {
    key: "site",
    title: "Site",
    description: "Ce que doit contenir votre site.",
    fields: [
      { key: "pages", label: "Pages souhaitées", hint: "Ex. Accueil, Services, À propos, Contact", long: true },
      { key: "features", label: "Fonctionnalités", hint: "Réservation, formulaire, galerie…", long: true },
      { key: "languages", label: "Langues" },
      { key: "references", label: "Sites de référence", hint: "Sites que vous aimez et pourquoi", long: true },
    ],
  },
  {
    key: "content",
    title: "Contenu",
    description: "Vos textes et médias. Vous pouvez aussi déposer des fichiers.",
    fields: [
      { key: "texts", label: "Textes", hint: "Collez vos textes, ou indiquez s'ils sont à rédiger", long: true },
      { key: "photos", label: "Photos", hint: "Disponibles ? À déposer dans Fichiers", long: true },
      { key: "videos", label: "Vidéos", hint: "Liens YouTube, Instagram…", long: true },
      { key: "testimonials", label: "Témoignages clients", long: true },
      { key: "pricing", label: "Tarifs", hint: "Si vous souhaitez les afficher", long: true },
    ],
  },
  {
    key: "goal",
    title: "Objectif",
    description: "Le plus important.",
    fields: [
      { key: "mainAction", label: "Quelle action souhaitez-vous que vos visiteurs réalisent sur votre site ?", hint: "Ex. réserver une table, demander un devis, appeler…", long: true },
      { key: "notes", label: "Autres remarques", long: true },
    ],
  },
];
