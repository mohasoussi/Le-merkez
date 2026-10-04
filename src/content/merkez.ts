import type { Media } from "./types";

/**
 * Page « Le projet » (/le-merkez) — texte de la plaquette institutionnelle du Merkez.
 * Les textes sont ceux de la plaquette (corrections typographiques mineures uniquement).
 */
export const merkezPage = {
  eyebrow: "Le projet",
  title: "Un lieu de lumière, de rencontre et d’union",
  intro:
    "Le Merkez, sous la direction du Shaykh Mohamed Faouzi Al Karkari, est un espace de rencontre, de spiritualité, de transmission et de service.",

  verse: {
    text: "Ô hommes ! Nous vous avons créés d’un homme et d’une femme, et Nous avons fait de vous des peuples et des tribus afin que vous vous connaissiez.",
    ar: "وَجَعَلْنَاكُمْ شُعُوبًا وَقَبَائِلَ لِتَعَارَفُوا",
    reference: "Coran, sourate Al-Hujurât (49), verset 13",
  },

  existence: {
    eyebrow: "Il existe déjà",
    title: "Le Merkez n’attend pas un bâtiment",
    text: [
      "Mais le Merkez n’attend pas la construction d’un bâtiment pour exister. Il existe à travers les retraites spirituelles organisées, les rencontres interreligieuses, les conférences, les tables rondes, les actions solidaires, les visites, les initiatives culturelles et toutes les rencontres qui permettent à des personnes d’horizons différents de se retrouver.",
      "Aujourd’hui, le Merkez est une réalité immatérielle. Demain, cette réalité se matérialisera dans des lieux dédiés à ces activités.",
    ],
    emphasis: ["Les murs ne créent pas le Merkez.", "Ils donnent un lieu à ce qui existe déjà."],
    steps: ["Se connaître", "Se rencontrer", "Transmettre", "Servir", "Unir"],
  },

  vision: {
    eyebrow: "Une vision",
    title: "Se connaître pour se rapprocher",
    text: [
      "Le Merkez repose sur une conviction fondamentale : ce qui unit les êtres humains est plus profond et plus important que ce qui semble les séparer.",
      "Les différences de culture, d’origine, de tradition ou de religion ne constituent pas des barrières et des murs, mais elles sont autant d’occasions de se connaître et de se comprendre.",
      "Dans un monde marqué par les discours de division, de séparation et de fracture, le Merkez crée des espaces où la rencontre redevient possible. Des espaces où l’on se parle. Des espaces où l’on s’écoute. Des espaces où l’on découvre l’autre pour mieux le connaître. Des espaces où les différences peuvent coexister et être une occasion de se découvrir.",
    ],
    emphasis: "Le Merkez crée des ponts là où d’autres construisent des frontières.",
  },

  light: {
    eyebrow: "La lumière",
    title: "La lumière se partage sans diminuer",
    lines: [
      "La lumière de la connaissance.",
      "La lumière de la spiritualité.",
      "La lumière de la rencontre.",
      "La lumière qui permet de voir en l’autre un miroir et non une opposition.",
    ],
    text: [
      "La lumière constitue l’un des fils conducteurs du Merkez.",
      "La lumière a de particulier qu’elle ne diminue pas lorsqu’elle est partagée. Au contraire, elle s’étend et se transmet. Une personne éclaire une autre. Une rencontre en éclaire une autre. Une communauté en rencontre une autre.",
    ],
    emphasis:
      "C’est ainsi que le Merkez avance : en faisant circuler la lumière d’une personne à l’autre, d’une communauté à l’autre, d’un lieu à l’autre.",
  },

  garment: {
    eyebrow: "Le vêtement rapiécé",
    title: "Des couleurs différentes, un même vêtement",
    text: [
      "Le vêtement rapiécé constitue une expression visuelle du Merkez. Il est composé de morceaux de tissus différents. Chaque morceau possède sa couleur, son motif, sa texture et son histoire. Pourtant, tous sont réunis dans un même vêtement.",
      "Le vêtement rapiécé exprime ainsi l’une des idées fondamentales du Merkez : nous n’avons pas besoin d’être identiques pour être unis. Au contraire, c’est la multiplicité de nos différences qui crée la beauté d’un monde fait d’une multitude de formes et de couleurs. Chaque histoire conserve sa singularité. Mais toutes peuvent participer à une œuvre commune et collective.",
    ],
    photos: [
      { src: "/images/shaykh/portrait-muraqaa.jpg", alt: "Le Shaykh Mohamed Faouzi Al Karkari vêtu d’un vêtement rapiécé aux carrés de couleurs", width: 1170, height: 1553 },
      { src: "/images/retraites/marche.jpg", alt: "Marche en forêt, vêtus de vêtements rapiécés aux carrés de tissu colorés", width: 1350, height: 1800 },
      { src: "/images/actions/retraite-blue-mountains/groupe-panorama.jpg", alt: "Participants à la retraite des Blue Mountains, beaucoup vêtus de vêtements rapiécés", width: 1800, height: 1350 },
    ] as Media[],
  },

  action: {
    eyebrow: "Le Merkez en action",
    title: "Rencontrer, se retrouver, transmettre, servir, cultiver",
    items: [
      {
        word: "Rencontrer",
        subtitle: "Rencontres interreligieuses et interculturelles",
        color: "#efe6d3",
        ink: "#4a3324",
        thread: "#a67c3d",
        text: [
          "Le Merkez organise des rencontres permettant aux différentes communautés de se retrouver autour de sujets universels : la paix, l’union, l’amour du prochain, la fraternité et le vivre-ensemble. Ces rencontres créent des liens là où la méconnaissance peut créer de la distance.",
        ],
        href: "/actions/rencontres-interreligieuses",
        hrefLabel: "Les rencontres",
      },
      {
        word: "Se retrouver",
        subtitle: "Retraites spirituelles",
        color: "#d8c3a0",
        ink: "#7a4a1d",
        thread: "#8a6a35",
        text: [
          "Les retraites constituent une dimension essentielle du Merkez. Elles offrent des temps de retrait du monde, de spiritualité, de méditation, d’enseignement, de dhikr, de marche, de contemplation et de vie collective.",
        ],
        motto: "Se retirer du bruit pour retrouver la Lumière.",
        href: "/actions/retraites-spirituelles",
        hrefLabel: "Les retraites",
      },
      {
        word: "Transmettre",
        subtitle: "Conférences et tables rondes",
        color: "#6e1b21",
        ink: "#f4ecdd",
        thread: "#d9b15c",
        text: [
          "Le Merkez organise des conférences, des tables rondes et des rencontres consacrées à la spiritualité, à la paix, à la coexistence, à la culture, à la connaissance et aux grandes questions humaines. La transmission y occupe une place centrale.",
        ],
        motto: "Parce que la connaissance éclaire. Parce que la parole rapproche. Parce que le dialogue transforme le regard que nous portons sur l’autre.",
        href: "/actions/conferences-tables-rondes",
        hrefLabel: "Les conférences",
      },
      {
        word: "Servir",
        subtitle: "Des actions tournées vers l’humain",
        color: "#1f4a36",
        ink: "#f4ecdd",
        thread: "#c9a35a",
        text: ["La spiritualité trouve également son expression dans l’action."],
        list: ["Maraudes", "Actions solidaires", "Visites dans les hôpitaux", "Visites auprès de personnes isolées", "Actions auprès des écoles", "Initiatives humanitaires"],
        after: "La spiritualité ne se limite pas à l’intériorité. Elle se traduit également par la présence, l’attention et le service des plus faibles et des plus démunis.",
        motto: "Se recueillir. Se rencontrer. Servir.",
        href: "/actions/actions-solidaires",
        hrefLabel: "Les actions solidaires",
      },
      {
        word: "Cultiver",
        subtitle: "La terre comme espace de transmission",
        color: "#14233f",
        ink: "#f4ecdd",
        thread: "#d9b15c",
        text: [
          "Le Merkez porte également une relation particulière à la nature.",
          "La permaculture, le jardinage, la plantation d’oliviers et la transmission des savoir-faire liés à la terre participent à cette vision.",
        ],
        motto: "Planter, prendre soin, transmettre.",
        href: null,
        hrefLabel: null,
      },
    ],
  },

  bridge: {
    eyebrow: "De l’espace immatériel à l’espace physique",
    title: "Donner des murs à une réalité qui existe déjà",
    text: [
      "Aujourd’hui, les activités du Merkez se déploient dans toute l’Europe, que ce soit en France, en Belgique, aux Pays-Bas, en Allemagne ou en Suisse. Les rencontres ont lieu. Les retraites ont lieu. Les conférences ont lieu. Les actions solidaires ont lieu et les liens se créent et se tissent.",
    ],
    exists: "Le Merkez existe.",
    next: "L’étape suivante consiste à donner à cette réalité un lieu qui lui soit propre. Un lieu permanent permettant de réunir au même endroit les différentes dimensions du Merkez.",
    places: [
      "Un lieu de spiritualité.",
      "Un lieu de rencontre.",
      "Un lieu de transmission.",
      "Un lieu de retraite.",
      "Un lieu d’action.",
      "Un lieu de nature.",
      "Un lieu de lumière.",
    ],
    cta: { label: "Découvrir le futur lieu", href: "/le-futur-lieu" },
    note: "Visualisations conceptuelles — ces images illustrent l’esprit du projet, elles ne représentent pas un lieu existant. Aucun lieu n’est encore arrêté.",
    photos: [
      { src: "/images/projet/vue-aerienne.jpg", alt: "Vue aérienne du lieu imaginé : bâtiment en bois, yourtes et pavillon aux couleurs de patchwork au milieu des collines", width: 1456, height: 816 },
      { src: "/images/projet/ensemble-pierre-bois.jpg", alt: "Vue aérienne d’un ensemble de pierre et de bois entouré de potagers", width: 1456, height: 816 },
      { src: "/images/projet/vallee-yourte.jpg", alt: "Yourte aux motifs de patchwork, potagers et moutons dans une vallée", width: 1456, height: 816 },
      { src: "/images/projet/marche-collines.jpg", alt: "Des personnes marchent côte à côte sur un chemin de colline", width: 1344, height: 896 },
    ] as Media[],
  },
};
