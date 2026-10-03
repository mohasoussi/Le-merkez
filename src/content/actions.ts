import { textile } from "@/lib/palette";
import type { Media } from "./types";

/**
 * Les 5 grands axes du Merkez et les articles (actions menées) classés par catégorie.
 *
 * Pour publier un article : ajouter un objet dans `articles` avec la bonne `category`
 * (slug d'un axe), un `slug` unique, un titre, une date ISO (AAAA-MM-JJ), un extrait,
 * une image et le corps du texte. Supprimer ensuite les articles `placeholder: true`.
 */

export type ActionSlug =
  | "rencontres-interreligieuses"
  | "retraites-spirituelles"
  | "conferences-tables-rondes"
  | "actions-humanitaires"
  | "librairie";

export interface ActionAxis {
  slug: ActionSlug;
  number: string;
  title: string;
  short: string;
  summary: string;
  description: string[];
  objective?: string;
  highlights?: string[];
  color: string;
  accent: string;
  image: Media;
  /** Visuels secondaires (ambiance). */
  moodImages?: Media[];
}

export const actions: ActionAxis[] = [
  {
    slug: "rencontres-interreligieuses",
    number: "01",
    title: "Rencontres interreligieuses",
    short: "Rencontres",
    summary: "Créer des espaces de dialogue entre différentes traditions religieuses.",
    description: [
      "Créer des espaces de dialogue entre différentes traditions religieuses.",
      "Des moments où chacun peut parler de ce qu’il porte, et écouter ce que l’autre porte.",
    ],
    objective: "Favoriser la connaissance mutuelle, le dialogue et le respect.",
    color: textile.indigo,
    accent: textile.saffron,
    image: { src: null, alt: "Rencontre interreligieuse", placeholder: "[PHOTO À FOURNIR — Rencontre interreligieuse]" },
  },
  {
    slug: "retraites-spirituelles",
    number: "02",
    title: "Retraites spirituelles",
    short: "Retraites",
    summary: "Des temps de retrait, de réflexion, de spiritualité et de reconnexion.",
    description: [
      "Des temps de retrait, de réflexion, de spiritualité et de reconnexion.",
      "Des expériences humaines et spirituelles : la nature, le silence, la marche, la méditation et la rencontre.",
    ],
    highlights: ["Nature", "Montagne", "Silence", "Marche", "Méditation", "Rencontres"],
    color: textile.moss,
    accent: textile.sand,
    image: { src: null, alt: "Retraite spirituelle en montagne", placeholder: "[PHOTO À FOURNIR — Retraite, nature, montagne]" },
    moodImages: [
      { src: null, alt: "Marche en silence", placeholder: "[PHOTO — Marche]" },
      { src: null, alt: "Méditation", placeholder: "[PHOTO — Méditation]" },
    ],
  },
  {
    slug: "conferences-tables-rondes",
    number: "03",
    title: "Conférences & tables rondes",
    short: "Conférences",
    summary:
      "Inviter chercheurs, penseurs, responsables religieux, artistes et personnalités à échanger autour de grandes questions humaines.",
    description: [
      "Inviter des chercheurs, penseurs, responsables religieux, artistes et personnalités à échanger autour de grandes questions humaines, spirituelles, culturelles et sociales.",
    ],
    highlights: ["Chercheurs", "Penseurs", "Responsables religieux", "Artistes", "Personnalités"],
    color: textile.madder,
    accent: textile.sand,
    image: { src: null, alt: "Conférence et table ronde", placeholder: "[PHOTO À FOURNIR — Conférence]" },
  },
  {
    slug: "actions-humanitaires",
    number: "04",
    title: "Actions humanitaires",
    short: "Humanitaire",
    summary: "Le Merkez est aussi tourné vers l’action : aller à la rencontre de ceux qui en ont besoin.",
    description: [
      "Le Merkez est également tourné vers l’action.",
      "Parce que se connaître, c’est aussi prendre soin les uns des autres.",
    ],
    highlights: [
      "Maraudes",
      "Distributions",
      "Actions solidaires",
      "Visites dans les EHPAD",
      "Soutien aux personnes isolées",
      "Actions humanitaires",
    ],
    color: textile.terracotta,
    accent: textile.sand,
    image: { src: null, alt: "Échange humain lors d’une action solidaire", placeholder: "[PHOTO À FOURNIR — Action solidaire]" },
  },
  {
    slug: "librairie",
    number: "05",
    title: "Librairie",
    short: "Librairie",
    summary: "Des ouvrages pour prolonger la rencontre, transmettre et approfondir.",
    description: ["Des ouvrages pour prolonger la rencontre, transmettre le savoir et approfondir le chemin."],
    color: textile.saffron,
    accent: textile.umber,
    image: { src: null, alt: "Livres de la librairie du Merkez", placeholder: "[PHOTO À FOURNIR — Livres]" },
  },
];

export interface Article {
  category: ActionSlug;
  slug: string;
  title: string;
  /** Date ISO (AAAA-MM-JJ) ou null si non renseignée. */
  date: string | null;
  location?: string | null;
  excerpt: string;
  cover: Media;
  body: string[];
  /** true = modèle de démonstration, non indexé, à supprimer. */
  placeholder?: boolean;
}

/** Un modèle par catégorie, pour montrer la structure. À remplacer par les vraies actions. */
export const articles: Article[] = actions.map((a) => ({
  category: a.slug,
  slug: "modele-article",
  title: `[TITRE DE L’ARTICLE À AJOUTER — ${a.short}]`,
  date: null,
  location: null,
  excerpt: "[RÉSUMÉ DE L’ACTION À AJOUTER]",
  cover: { src: null, alt: a.title, placeholder: "[PHOTO DE L’ACTION À FOURNIR]" },
  body: [
    "[TEXTE DE L’ARTICLE À AJOUTER]",
    "Ce modèle montre la mise en page d’un article. Pour publier une action réelle, ajoutez-la dans src/content/actions.ts.",
  ],
  placeholder: true,
}));

export const getAction = (slug: string) => actions.find((a) => a.slug === slug);
export const getArticles = (category?: string) =>
  articles
    .filter((a) => !category || a.category === category)
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
export const getArticle = (category: string, slug: string) =>
  articles.find((a) => a.category === category && a.slug === slug);
