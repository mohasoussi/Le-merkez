import { textile } from "@/lib/palette";
import type { Media } from "./types";

/**
 * Le futur lieu. Tant qu'aucune photographie n'existe, une visualisation conceptuelle
 * (plan en patchwork autour d'un centre) est affichée.
 */
export const place = {
  eyebrow: "Le futur lieu",
  title: "Un lieu pour se rencontrer",
  subtitle: "Une maison de la rencontre.",
  text: "Le futur lieu constituera la matérialisation d’une œuvre déjà en mouvement pour accueillir les activités du Merkez et leur donner un espace permanent.",
  listTitle: "Ce lieu réunit",
  centerLabel: "Le centre",
  centerNote: "En turc, « merkez » signifie « centre ».",
  disclaimer: "Visualisation conceptuelle — aucun lieu n’est encore arrêté.",
  /** Les espaces du futur lieu, tels que décrits dans la plaquette (ordre de lecture du plan). */
  spaces: [
    { label: "Espaces de retraite", color: textile.moss },
    { label: "Espaces de rencontre et de conférence", color: textile.indigo },
    { label: "Espaces de spiritualité", color: textile.madder },
    { label: "Espaces de nature", color: textile.olive },
    { label: "Librairie et boutique", color: textile.saffron },
    { label: "Espaces dédiés aux actions solidaires", color: textile.rose },
  ],
  /** Maquette du projet : visualisations conceptuelles du futur lieu (aucun lieu n'est encore arrêté). */
  maquetteTitle: "La maquette du projet",
  maquetteText:
    "Un lieu ouvert sur la nature, pensé comme un village de la rencontre : un bâtiment central, des yourtes pour accueillir, des jardins, des chemins qui relient les espaces.",
  maquetteNote: "Visualisations conceptuelles — ces images illustrent l’esprit du projet, elles ne représentent pas un lieu existant.",
  images: [
    { src: "/images/projet/vue-aerienne.jpg", alt: "Vue aérienne du lieu : bâtiment en bois, yourtes et pavillon aux couleurs de patchwork au milieu des collines", width: 1456, height: 816 },
    { src: "/images/projet/ensemble-pierre-bois.jpg", alt: "Vue aérienne d’un ensemble de pierre et de bois entouré de potagers", width: 1456, height: 816 },
    { src: "/images/projet/vallee-yourte.jpg", alt: "Yourte aux motifs de patchwork, potagers et moutons dans une vallée", width: 1456, height: 816 },
    { src: "/images/projet/jardin-potager.jpg", alt: "Yourtes, potager et clôtures de bois, des personnes se promènent dans les collines", width: 1456, height: 816 },
    { src: "/images/projet/marche-collines.jpg", alt: "Des personnes marchent côte à côte sur un chemin de colline au coucher du soleil", width: 1344, height: 896 },
  ] as Media[],
};
