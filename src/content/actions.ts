import { textile } from "@/lib/palette";
import type { Media } from "./types";

/**
 * Les grands axes du Merkez et les articles (actions menées) classés par catégorie.
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
  | "actions-solidaires"
  | "marches"
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
    color: textile.terracotta,
    accent: textile.sand,
    image: { src: null, alt: "Action humanitaire", placeholder: "[PHOTO À FOURNIR — Action humanitaire]" },
  },
  {
    slug: "actions-solidaires",
    number: "05",
    title: "Actions solidaires",
    short: "Solidaire",
    summary: "Aller vers les personnes, près de chez soi : maraudes, visites dans les EHPAD, soutien aux personnes isolées.",
    description: [
      "Des gestes concrets, au plus près des personnes.",
      "Montrer des échanges humains plutôt que des images misérabilistes : rencontrer, écouter, accompagner.",
    ],
    highlights: ["Maraudes", "Visites dans les EHPAD", "Soutien aux personnes isolées", "Distributions", "Actions solidaires"],
    color: textile.rose,
    accent: textile.sand,
    image: { src: null, alt: "Échange humain lors d’une action solidaire", placeholder: "[PHOTO À FOURNIR — Action solidaire]" },
  },
  {
    slug: "marches",
    number: "06",
    title: "Marches",
    short: "Marches",
    summary: "Les pérégrinations (siyahas) des fuqaras et les rencontres que l’on fait en chemin.",
    description: [
      "Marcher, c’est aller vers l’autre.",
      "Les marches et les pérégrinations (siyahas) des fuqaras, et les rencontres de personnes faites à travers elles, de chemin en chemin.",
    ],
    highlights: ["Marches", "Pérégrinations (siyahas)", "Rencontres en chemin"],
    color: textile.olive,
    accent: textile.sand,
    image: { src: null, alt: "Marche des fuqaras sur un chemin", placeholder: "[PHOTO À FOURNIR — Marche, siyaha]" },
  },
  {
    slug: "librairie",
    number: "07",
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
  /** Bouton d'action en bas d'article (inscription, réservation…). */
  cta?: { label: string; href: string };
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

const paix = "/images/actions/rencontre-centre-etudes-paix";

published.push({
  category: "rencontres-interreligieuses",
  slug: "visite-centre-etudes-pour-la-paix",
  title: "Visite au Centre d’études pour la Paix",
  date: null, // [DATE À AJOUTER] — « ce week-end » ; format AAAA-MM-JJ
  location: "Centre d’études pour la Paix",
  excerpt:
    "Un groupe de disciples karkaris a été invité à une rencontre avec les membres de l’association Karuna Ceprobreiz, au Centre d’études pour la Paix.",
  cover: {
    src: `${paix}/table-ronde.jpg`,
    alt: "Repas partagé autour de tables dans une grande salle, disciples en muraqaa et membres de l’association mêlés",
    width: 1600,
    height: 900,
  },
  body: [
    "Ce week-end, un groupe de disciples karkaris a été invité à une rencontre avec les membres de l’association Karuna Ceprobreiz, au Centre d’études pour la Paix.",
    "Cette rencontre a réuni des femmes et des hommes aux parcours et aux convictions divers, animés par un même désir : apprendre à se connaître et bâtir, pas à pas, des ponts entre les êtres et entre les chemins.",
    "Parmi les participants se trouvaient des croyants de différentes sensibilités, mais aussi des personnes en recherche spirituelle ou philosophique. Cette diversité a donné à cette rencontre une profondeur particulière, parfois exigeante, mais sincère.",
    "Se rencontrer vraiment n’est jamais simple. Cela demande de l’écoute, de la patience, et l’humilité d’accueillir l’autre tel qu’il est. Ce temps partagé a été une tentative sincère, riche d’enseignements pour les uns et les autres — et il appelle à se poursuivre, pour faire mieux encore, ensemble.",
    "Au-delà des différences de langage, de culture ou de perception, chacun a essayé, à sa manière, d’honorer ce qui unit les êtres humains dans leur quête de vérité, de paix et de sens.",
    "Dans cet esprit, nous retenons cette parole :",
    "« La vraie sagesse ne se proclame pas. Elle se reconnaît dans la façon d’aimer, d’écouter et de rencontrer l’autre sans condition, avec un cœur ouvert et sincère. »",
    "Merci à chacune et chacun pour la sincérité de cette présence. Que ce temps partagé en appelle d’autres, plus profonds encore, dans le respect, la vérité et la lumière.",
  ],
  photos: [
    { src: `${paix}/salle-lumineuse.jpg`, alt: "Table dressée dans une salle lumineuse ouverte sur un jardin, convives de tous âges", width: 1800, height: 1012 },
    { src: `${paix}/repas-partage.jpg`, alt: "Longue table où l’on partage le repas et la conversation autour d’un piano", width: 960, height: 540 },
    { src: `${paix}/echanges.jpg`, alt: "Convives attablés qui échangent, participants en muraqaa et membres de l’association", width: 960, height: 540 },
    { src: `${paix}/cuisine.jpg`, alt: "Conversation dans la cuisine ouverte, au milieu des préparatifs du repas", width: 960, height: 540 },
    { src: `${paix}/grande-salle.jpg`, alt: "Grande salle lumineuse où les convives déjeunent à plusieurs tables, ouverte sur la campagne", width: 1800, height: 1012 },
    { src: `${paix}/barbecue.jpg`, alt: "Trois hommes préparent des grillades sur un barbecue en plein air", width: 960, height: 540 },
    { src: `${paix}/accueil.jpg`, alt: "Moment de rencontre autour d’une table : participants en muraqaa et invités, des fanions de couleur derrière la baie vitrée", width: 960, height: 540 },
    { src: `${paix}/table-longue.jpg`, alt: "Longue table où l’on partage le repas et la conversation, un homme en tunique blanche debout au fond", width: 960, height: 540 },
    { src: `${paix}/diner.jpg`, alt: "Dîner partagé autour d’une longue table, un participant en muraqaa au premier plan", width: 960, height: 540 },
  ],
});

const assises = "/images/actions/assises-fraternelles";

published.push({
  category: "rencontres-interreligieuses",
  slug: "assises-fraternelles-dialogue-interreligieux",
  title: "Le Shaykh Mohamed Faouzi Al Karkari invité aux « Assises fraternelles » autour du dialogue interreligieux",
  // Lundi 18 mai : l'année n'a pas été précisée ; 2026 est la seule récente où le 18 mai tombe un lundi. À confirmer.
  date: "2026-05-18",
  location: null, // [LIEU À AJOUTER]
  excerpt:
    "Le 18 mai, l’association Les Compagnons a organisé les « Assises fraternelles », sur le thème « Pourquoi le dialogue est la seule solution ? », en présence du Shaykh Mohamed Faouzi Al Karkari.",
  cover: {
    src: `${assises}/shaykh-parole.jpg`,
    alt: "Le Shaykh Mohamed Faouzi Al Karkari prend la parole au micro, au centre d’un cercle de participants",
    width: 1179,
    height: 1248,
  },
  body: [
    "Le lundi 18 mai, l’association Les Compagnons a organisé les « Assises fraternelles », une rencontre placée sous le thème : « Pourquoi le dialogue est la seule solution ? ».",
    "L’événement a réuni plusieurs personnalités engagées en faveur du dialogue, de la paix et du vivre-ensemble, parmi lesquelles le Shaykh Mohamed Faouzi Al Karkari, ainsi que :",
    "- Michel Serfaty, rabbin franco-marocain et fondateur de l’Amitié Judéo-Musulmane de France (AJMF) ;",
    "- Fadela Vaillant, vice-présidente de l’association « Les Guerrières de la Paix » ;",
    "- Jean-François de Marignan, représentant de l’association « EFESIA », qui œuvre au rapprochement des peuples ;",
    "- Mouhamadou Abu Nur, docteur en droit public et juriste au Conseil d’État.",
    "Les échanges se sont articulés autour de trois grandes questions :",
    "- Qu’est-ce qui nous unit ?",
    "- Comment concilier nos différences ?",
    "- Quelles solutions existent pour promouvoir le vivre-ensemble ?",
    "Les intervenants ont souligné l’importance d’un dialogue sincère entre les traditions religieuses, culturelles et humaines, dans un contexte mondial marqué par les tensions identitaires et les fractures sociales. Tous ont insisté sur la nécessité de dépasser les préjugés et de chercher à connaître l’autre, et ont rappelé que ce que visent les trois traditions religieuses est de vouloir pour l’autre ce que l’on voudrait pour soi-même.",
    "La présence du Shaykh Mohamed Faouzi Al Karkari a porté un message fort. Il a appelé à replacer la spiritualité au cœur de nos vies, en prenant conscience que toute la création n’a été créée, en définitive, que pour que nous nous connaissions nous-mêmes et que nous parvenions à la connaissance de notre Créateur.",
    "Il a également expliqué que la France est perçue dans le monde entier, et notamment au Maroc, comme une terre de liberté et de vivre-ensemble. Peuplée d’habitants de toutes origines et de toutes religions, elle demande à chacun, a-t-il rappelé, de respecter les règles et les lois établies, afin que la société puisse se construire dans le respect de chacun.",
    "Nos remerciements vont à l’association Les Compagnons qui, à travers ces « Assises fraternelles », poursuit son engagement en faveur du dialogue, de la paix et du rapprochement entre les différentes composantes de la société.",
  ],
  photos: [
    { src: `${assises}/table-ronde.jpg`, alt: "Assemblée réunie en cercle dans une salle lumineuse, un intervenant prend la parole au micro", width: 1179, height: 1116 },
    { src: `${assises}/cercle-attentif.jpg`, alt: "Participants attentifs, assis en cercle, pendant que le Shaykh s’exprime", width: 1179, height: 1452 },
    { src: `${assises}/intervenant-micro.jpg`, alt: "Un intervenant en chapeau noir prend la parole au micro, devant des participants attentifs", width: 1179, height: 1314 },
    { src: `${assises}/shaykh-ecoute.jpg`, alt: "Le Shaykh écoute attentivement un intervenant, un micro au premier plan", width: 1350, height: 1800 },
    { src: `${assises}/portrait-profil.jpg`, alt: "Portrait de profil d’un participant en chapeau noir, dans la salle aux boiseries", width: 1350, height: 1800 },
    { src: `${assises}/salle.jpg`, alt: "Public assis en rangs dans une salle aux boiseries, à l’écoute d’un intervenant", width: 1179, height: 1176 },
    { src: `${assises}/intervenant.jpg`, alt: "Un intervenant s’exprime au micro, entouré d’autres participants", width: 1179, height: 1218 },
    { src: `${assises}/ecoute.jpg`, alt: "Participants attentifs pendant les échanges, certains vêtus de muraqaas", width: 1179, height: 1470 },
    { src: `${assises}/participant.jpg`, alt: "Un participant écoute attentivement, assis dans la salle", width: 1350, height: 1800 },
  ],
});

const ev = "/images/evenements";

// ─── Prochaines actions (événements à venir) ───
published.push({
  category: "rencontres-interreligieuses",
  slug: "rencontre-d-assise-40-ans-apres",
  title: "La Rencontre d’Assise, 40 ans après : grande marche pour la paix à Paris",
  date: "2026-10-18",
  location: "Paris",
  excerpt:
    "Dimanche 18 octobre 2026, une grande marche pour la paix relie des lieux de culte de Paris, autour de la responsabilité des religions et des cultures dans la construction de la paix.",
  cover: {
    src: `${ev}/assise-affiche.jpg`,
    alt: "Affiche : La Rencontre d’Assise, 40 ans après ! Dimanche 18 octobre 2026, Paris, grande marche pour la paix",
    width: 1061,
    height: 1500,
  },
  body: [
    "Dimanche 18 octobre 2026, Paris accueille une grande marche pour la paix, sur le thème : « La responsabilité des religions et des cultures dans la construction de la paix ».",
    "En 1986, le pape Jean-Paul II a réuni à Assise 130 responsables religieux du monde entier pour une journée de prière pour la paix.",
    "40 ans après, des croyants de différentes traditions, des acteurs associatifs et des citoyens de toutes convictions se rassemblent à Paris pour faire vivre cet esprit et témoigner ensemble que la paix se construit par la rencontre, le dialogue et la fraternité.",
    "## Le parcours",
    "- 8 h 15 – 8 h 45 : Grande Pagode du Bois de Vincennes — accueil et visite (30 min). Étape facultative avant le départ principal.",
    "- 10 h 45 – 11 h 20 : Grande Mosquée de Paris — accueil et visite (35 min). Départ principal de la marche.",
    "- 12 h 10 – 12 h 40 : Église Saint-Sulpice (après la messe de 11 h) — accueil et visite (30 min).",
    "- 12 h 40 – 13 h 40 : déjeuner libre (tiré du sac) dans le quartier Saint-Sulpice.",
    "- 14 h 00 – 14 h 30 : Cathédrale ukrainienne catholique Saint-Volodymyr-le-Grand — accueil et visite (30 min).",
    "- 16 h 40 – 17 h 10 : Synagogue JEM de Beaugrenelle — accueil et visite (30 min).",
    "- 18 h 00 – 19 h 00 : Parvis des Droits de l’Homme (Trocadéro) — grand rassemblement pour la paix (1 heure).",
    "- 19 h 40 – 20 h 40 : Centre Bahá’í, 45 rue Pergolèse, Paris 16e — accueil et visite (1 heure).",
    "## Informations pratiques",
    "- Des transports en commun permettent de rejoindre le groupe entre certaines étapes : rejoignez la marche à l’étape de votre choix.",
    "- Parcours réduit : environ 7 km de marche (18 km pour le parcours complet).",
    "- Pensez à prendre de l’eau, un pique-nique pour le déjeuner et des chaussures confortables.",
    "Une journée ouverte à toutes et à tous !",
  ],
  photos: [{ src: `${ev}/assise-parcours.jpg`, alt: "Le parcours de la marche, étape par étape, avec les horaires et les informations pratiques", width: 1061, height: 1500 }],
});

published.push({
  category: "retraites-spirituelles",
  slug: "retraite-mont-blanc-chamonix",
  title: "Retraite spirituelle soufie au cœur du Mont-Blanc",
  date: "2026-12-04",
  location: "Chamonix",
  excerpt:
    "Du 4 au 7 décembre 2026, quatre jours et trois nuits à Chamonix, face au Mont Blanc, avec le compagnonnage du Shaykh Mohamed Faouzi al-Karkari : méditation, marche en montagne, enseignements.",
  cover: {
    src: `${ev}/mont-blanc-affiche.jpg`,
    alt: "Affiche : retraite spirituelle soufie au cœur du Mont-Blanc, du 4 au 7 décembre 2026 à Chamonix",
    width: 509,
    height: 720,
  },
  body: [
    "Rejoignez-nous pour quatre jours et trois nuits hors du tumulte du monde, au cœur des Alpes françaises, face au majestueux Mont Blanc.",
    "Un temps pour ralentir, se recentrer et revenir à l’essentiel à travers la méditation, les enseignements spirituels, la contemplation des montagnes et des moments de partage, dans la compagnie d’un maître soufi vivant, Sidi Mohamed Faouzi al-Karkari.",
    "## Au programme",
    "- Méditation",
    "- Marche en montagne",
    "- Enseignements",
    "- Visite de la « Mer de glace »",
    "## Séances de méditation collective",
    "Dans la compagnie du Maître, nous nous réunissons dans les dernières heures de la nuit pour un temps de méditation et d’invocation, avant la prière de l’aube (fajr), puis nous récitons ensemble les litanies Karkariya, une litanie traditionnelle de la voie soufie.",
    "Nous nous retrouvons également au coucher du soleil pour un nouveau temps de remembrance collective (dhikr), dans la présence et l’unité.",
    "## Construire autour de la Lumière divine",
    "Nous souhaitons rassembler celles et ceux qui sont en quête de sens, de compréhension et de profondeur intérieure, au-delà des différences de parcours et de traditions.",
    "Des femmes et des hommes réunis par un même élan : chercher le Divin, cultiver la présence et cheminer vers une connaissance plus profonde de soi et du monde, sous la guidance de notre éminent Maître, Sidi Mohamed Faouzi al-Karkari.",
    "## Informations pratiques",
    "- Dates : du 4 au 7 décembre 2026, à Chamonix.",
    "- Tarif : 280 € — séjour de 3 nuits et 4 jours, pension complète.",
    "- Réservation : thezawiya.fr",
    "- Contact : +33 6 74 79 79 16 · contact@thezawiya.fr",
  ],
  photos: [
    { src: `${ev}/mont-blanc-meditation.jpg`, alt: "Séance de méditation collective dans une salle en bois, à la lueur de bougies", width: 472, height: 212 },
    { src: `${ev}/mont-blanc-marche.jpg`, alt: "Marche en forêt, des participants vêtus de muraqaas sur un chemin", width: 472, height: 230 },
    { src: `${ev}/mont-blanc-sommet.jpg`, alt: "Sommet enneigé éclairé par le soleil, au-dessus d’une vallée", width: 472, height: 270 },
  ],
  cta: { label: "Réserver sur thezawiya.fr", href: "https://thezawiya.fr" },
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
