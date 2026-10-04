import type { Media } from "./types";

/**
 * Page « Le Merkez » : le projet expliqué en détail.
 * Textes issus des éléments fournis (concept, muraqaa, axes, lieu, objectifs). Aucun fait inventé.
 */
export const merkezPage = {
  eyebrow: "Le Merkez",
  title: "Un espace pour se rencontrer",
  intro:
    "Le Merkez est un espace dédié à la rencontre, au dialogue, à la transmission et à réunir ce qui semble séparé. Un projet porté sous la direction du Shaykh Mohamed Faouzi Al Karkari, qui crée des ponts entre les peuples, les cultures, les religions et les communautés.",
  nameNote: "En turc, « merkez » signifie « centre ».",

  idea: {
    eyebrow: "L’idée fondatrice",
    verse:
      "Ô hommes ! Nous vous avons créés d’un homme et d’une femme, et Nous avons fait de vous des peuples et des tribus afin que vous vous connaissiez.",
    ar: "وَجَعَلْنَاكُمْ شُعُوبًا وَقَبَائِلَ لِتَعَارَفُوا",
    reference: "Coran, sourate Al-Hujurât (49), verset 13",
    text: [
      "Ce verset est le cœur du Merkez. Les différences entre les peuples n’y sont pas présentées comme des barrières, mais comme des éléments qui peuvent composer une œuvre commune.",
      "Le Merkez est un espace où des personnes issues d’horizons différents peuvent se rencontrer, échanger, apprendre les unes des autres et construire des liens durables.",
    ],
    steps: ["Se connaître", "Se rencontrer", "Se lier", "Transmettre", "Servir"],
    emphasis: ["La diversité n’est pas ici considérée comme une séparation.", "Elle devient une richesse."],
  },

  muraqaa: {
    eyebrow: "La muraqaa",
    title: "Une multitude de couleurs, un seul vêtement",
    text: [
      "La muraqaa est un vêtement composé de différents carrés et morceaux de tissus, de couleurs et de motifs différents. Chaque morceau possède sa propre couleur, son propre motif, son histoire.",
      "Mais tous sont réunis dans un même vêtement.",
      "La muraqaa devient ainsi une image du projet du Merkez : des peuples différents, des traditions différentes, des histoires différentes, réunis dans un même espace de rencontre.",
    ],
    legend: "Chaque carré : une personne, une culture, une communauté, une tradition, un peuple.",
    photos: [
      { src: "/images/shaykh/portrait-muraqaa.jpg", alt: "Le Shaykh Mohamed Faouzi Al Karkari vêtu d’une muraqaa aux carrés de couleurs", width: 1170, height: 1553 },
      { src: "/images/retraites/marche.jpg", alt: "Marche en forêt, vêtus de muraqaas aux carrés de tissu colorés", width: 1350, height: 1800 },
      { src: "/images/actions/retraite-blue-mountains/groupe-panorama.jpg", alt: "Participants à la retraite des Blue Mountains, beaucoup vêtus de muraqaas", width: 1800, height: 1350 },
    ] as Media[],
  },

  axes: {
    eyebrow: "Ce que nous faisons",
    title: "Cinq façons de se rencontrer",
    text: "Le Merkez n’est pas uniquement une idée : c’est un projet qui vit sur le terrain.",
  },

  place: {
    eyebrow: "Un lieu pour se rencontrer",
    title: "Une maison de la rencontre",
    text: [
      "À long terme, le Merkez a vocation à disposer d’un lieu physique, ouvert, capable d’accueillir des rencontres, des retraites, des conférences, des tables rondes, des actions humanitaires, des activités culturelles, de la transmission et des personnes venant de différents horizons.",
    ],
    note: "Visualisations conceptuelles — ces images illustrent l’esprit du projet, elles ne représentent pas un lieu existant. Aucun lieu n’est encore arrêté.",
    photos: [
      { src: "/images/projet/vue-aerienne.jpg", alt: "Vue aérienne du lieu : bâtiment en bois, yourtes et pavillon aux couleurs de patchwork au milieu des collines", width: 1456, height: 816 },
      { src: "/images/projet/ensemble-pierre-bois.jpg", alt: "Vue aérienne d’un ensemble de pierre et de bois entouré de potagers", width: 1456, height: 816 },
      { src: "/images/projet/vallee-yourte.jpg", alt: "Yourte aux motifs de patchwork, potagers et moutons dans une vallée", width: 1456, height: 816 },
      { src: "/images/projet/marche-collines.jpg", alt: "Des personnes marchent côte à côte sur un chemin de colline", width: 1344, height: 896 },
    ] as Media[],
  },

  join: {
    eyebrow: "Participer",
    title: "Comment participer ?",
    text: "En participant aux activités, en soutenant le projet ou en contribuant à la création du futur lieu.",
    items: [
      { title: "Participer aux activités", text: "Rencontres, retraites, conférences et actions solidaires : retrouvez les prochains rendez-vous dans les actualités.", cta: { label: "Voir les actualités", href: "/actualites" } },
      { title: "Rejoindre la communauté", text: "Suivre les nouvelles du Merkez et rejoindre les échanges.", cta: { label: "Nous rejoindre", href: "https://t.me/+ntcTlHvj-fk5NjE0" } },
      { title: "Soutenir le projet", text: "Contribuer à la création d’un lieu physique et au financement des activités et actions du Merkez.", cta: { label: "Nous soutenir", href: "/#soutenir" } },
    ],
  },
};
