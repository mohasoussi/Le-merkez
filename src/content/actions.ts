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
  /** Photos de l'axe (affichées sur sa page, en galerie). */
  photos?: Media[];
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
    image: {
      src: "/images/actions/rencontre-abbaye-de-fleury/jardin.jpg",
      alt: "Fuqaras en muraqaa et moines bénédictins réunis dans le parc de l’abbaye de Fleury",
      width: 1600,
      height: 1200,
    },
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
    image: {
      src: "/images/retraites/marche.jpg",
      alt: "Un groupe vêtu de muraqaas colorées marche sur un chemin en forêt",
      width: 1350,
      height: 1800,
    },
    photos: [
      { src: "/images/retraites/marche.jpg", alt: "Marche en forêt, vêtus de muraqaas aux carrés de tissu colorés", width: 1350, height: 1800 },
      { src: "/images/retraites/musique.jpg", alt: "Deux participants jouent de l’oud et de la guitare devant un mur de briques", width: 1800, height: 1350 },
      { src: "/images/retraites/table.jpg", alt: "Table du petit-déjeuner dressée devant une fenêtre ouverte sur la forêt", width: 1350, height: 1800 },
      { src: "/images/retraites/flute.jpg", alt: "Un participant joue de la flûte traversière près d’une baie vitrée", width: 1800, height: 1350 },
      { src: "/images/retraites/repas.jpg", alt: "Repas partagé autour d’une longue table face à la forêt", width: 1350, height: 1800 },
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
  /** Photos de l'événement, affichées sous le texte. */
  photos?: Media[];
  /** true = modèle de démonstration, non indexé, à supprimer. */
  placeholder?: boolean;
}

const fleury = "/images/actions/rencontre-abbaye-de-fleury";

/** Actions publiées. */
const published: Article[] = [
  {
    category: "rencontres-interreligieuses",
    slug: "rencontre-abbaye-de-fleury",
    title: "Rencontre fraternelle et dialogue spirituel à Saint-Benoît-sur-Loire",
    date: null, // [DATE À AJOUTER] — format AAAA-MM-JJ
    location: "Abbaye de Fleury, Saint-Benoît-sur-Loire",
    excerpt:
      "Les fuqaras de la tariqa Karkariya ont eu la joie de rencontrer les moines de l’Abbaye de Fleury dans le cadre d’un temps d’échange et de dialogue interreligieux.",
    cover: { src: `${fleury}/abbaye.jpg`, alt: "Trois fuqaras, dont deux en muraqaa, devant la basilique de l’abbaye de Fleury", width: 1600, height: 1200 },
    body: [
      "Les fuqaras de la tariqa Karkariya ont eu la joie de rencontrer les moines de l’Abbaye de Fleury dans le cadre d’un temps d’échange et de dialogue interreligieux.",
      "Cette rencontre a été l’occasion de partager nos expériences spirituelles, d’approfondir notre connaissance mutuelle et de mettre en lumière les valeurs qui nous rassemblent : la recherche de Dieu, la prière, l’humilité, le service et la paix.",
      "Dans un climat de respect et d’écoute sincère, les échanges ont permis de dépasser les préjugés et de renforcer les liens de fraternité entre nos communautés. Ces moments de rencontre rappellent l’importance du dialogue comme moyen de favoriser la compréhension mutuelle et la coexistence harmonieuse entre les croyants.",
      "Nous remercions chaleureusement les frères de l’abbaye pour leur accueil empreint de bienveillance et pour leur invitation à poursuivre ces échanges dans l’avenir. Puissent ces rencontres continuer à semer des graines de paix, d’amitié et de fraternité entre les hommes.",
    ],
    photos: [
      { src: `${fleury}/jardin.jpg`, alt: "Moines et fuqaras réunis dans le parc de l’abbaye", width: 1600, height: 1200 },
      { src: `${fleury}/marche.jpg`, alt: "Marche côte à côte sur un chemin, moines et fuqaras", width: 1200, height: 1600 },
      { src: `${fleury}/echange.jpg`, alt: "Temps d’échange entre les moines et un fuqara en muraqaa, assis en cercle", width: 1600, height: 1200 },
      { src: `${fleury}/puits.jpg`, alt: "Moines et fuqaras penchés ensemble au-dessus d’un ancien puits de pierre", width: 1600, height: 1200 },
    ],
  },
];

const blueMountains = "/images/actions/retraite-blue-mountains";

published.push({
  category: "retraites-spirituelles",
  slug: "retraite-blue-mountains-ontario",
  title: "Retraite spirituelle dans les Blue Mountains, en Ontario",
  date: null, // [DATE À AJOUTER] — « cet été » ; format AAAA-MM-JJ
  location: "Blue Mountains, Ontario (Canada)",
  excerpt:
    "Cet été, les disciples d’Amérique du Nord ont organisé ensemble une retraite spirituelle dans les Blue Mountains, en présence du Shaykh Mohamed Faouzi al-Karkari.",
  cover: {
    src: `${blueMountains}/groupe-panorama.jpg`,
    alt: "Photo de groupe des participants, beaucoup vêtus de muraqaas, sur un belvédère dominant le lac",
    width: 1800,
    height: 1350,
  },
  body: [
    "Les disciples d’Amérique du Nord ont conjointement organisé cet été une retraite spirituelle dans les Blue Mountains, en Ontario (Canada). Chercheurs spirituels, étudiants, érudits, amis et proches venus du monde entier se sont rassemblés pour apprendre, prier et invoquer Dieu en présence du Shaykh Mohamed Faouzi al-Karkari.",
    "Loin du rythme du quotidien, cette retraite a offert un véritable temps de recueillement au cœur de la nature : assemblées de transmission en plein air autour du Shaykh, moments d’invocation partagés, échanges en petits cercles et haltes face aux vastes paysages de la région.",
    "Venus d’horizons, de cultures et de parcours différents, les participants ont vécu ensemble l’apprentissage, la prière et le souvenir de Dieu. Beaucoup portaient la muraqaa, ce vêtement fait de pièces de tissu assemblées qui exprime à lui seul l’esprit du Merkez : des histoires différentes, réunies dans un même vêtement.",
    "Cette retraite s’inscrit pleinement dans la vocation du Merkez : créer des espaces où l’on apprend à se connaître, où la spiritualité se vit ensemble, et où les liens tissés se prolongent bien au-delà du temps de la rencontre.",
  ],
  photos: [
    { src: `${blueMountains}/cercle.jpg`, alt: "Assemblée en cercle sur l’herbe autour du Shaykh, vue d’en haut", width: 922, height: 1152 },
    { src: `${blueMountains}/soeurs.jpg`, alt: "Participantes réunies devant l’entrée des Blue Mountains, plusieurs en muraqaa", width: 1350, height: 1800 },
    { src: `${blueMountains}/chalet.jpg`, alt: "Échange en petit cercle dans un chalet en bois ouvert sur la forêt", width: 1229, height: 1536 },
    { src: `${blueMountains}/invocation.jpg`, alt: "Participantes en invocation, mains ouvertes, dans une salle baignée de lumière", width: 922, height: 1152 },
  ],
});

/** Modèles de démonstration pour les catégories encore vides (non indexés). À supprimer au fur et à mesure. */
const templates: Article[] = actions.map((a) => ({
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

export const articles: Article[] = [
  ...published,
  ...templates.filter((t) => !published.some((p) => p.category === t.category)),
];

export const getAction = (slug: string) => actions.find((a) => a.slug === slug);
export const getArticles = (category?: string) =>
  articles
    .filter((a) => !category || a.category === category)
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
export const getArticle = (category: string, slug: string) =>
  articles.find((a) => a.category === category && a.slug === slug);
