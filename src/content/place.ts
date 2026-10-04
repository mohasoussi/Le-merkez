import { textile } from "@/lib/palette";
import type { Media } from "./types";

/**
 * Le futur lieu. Tant qu'aucune photographie n'existe, une visualisation conceptuelle
 * (plan en patchwork autour d'un centre) est affichée.
 */
export const place = {
  eyebrow: "Le projet physique",
  title: "Un lieu pour se rencontrer",
  subtitle: "Une maison de la rencontre.",
  text: "Le Merkez a vocation à disposer d’un lieu physique, ouvert, capable d’accueillir des personnes venant de différents horizons.",
  centerLabel: "Le centre",
  centerNote: "En turc, « merkez » signifie « centre ».",
  disclaimer: "Visualisation conceptuelle — aucun lieu n’est encore arrêté.",
  /** Les 8 espaces autour du centre (ordre : de gauche à droite, de haut en bas). */
  spaces: [
    { label: "Rencontres", color: textile.indigo },
    { label: "Retraites", color: textile.moss },
    { label: "Conférences", color: textile.madder },
    { label: "Transmission", color: textile.saffron },
    { label: "Tables rondes", color: textile.rose },
    { label: "Actions humanitaires", color: textile.terracotta },
    { label: "Activités culturelles", color: textile.olive },
    { label: "Accueil", color: textile.ochre },
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
