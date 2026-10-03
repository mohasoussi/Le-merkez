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
  /** Photos ou rendus du lieu, lorsqu'ils existeront. */
  images: [] as Media[],
};
