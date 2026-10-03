/**
 * Palette inspirée de la muraqaa.
 *
 * Base sobre (nuit, brun, sable, crème) + accents textiles utilisés
 * avec parcimonie, comme les carrés de couleur d'une muraqaa.
 * ⚠️ À affiner à partir de la photographie de la muraqaa lorsqu'elle sera fournie :
 * modifier uniquement les valeurs hexadécimales ci-dessous (et leurs équivalents
 * dans src/app/globals.css → @theme).
 */
export const base = {
  night: "#14100c",
  umber: "#2a1d14",
  brown: "#4a3324",
  earth: "#7a5638",
  sand: "#d8c3a0",
  linen: "#e9dcc4",
  cream: "#f4ecdd",
} as const;

export const textile = {
  madder: "#8f2d22", // rouge garance
  terracotta: "#b4613a",
  saffron: "#c99a3e", // jaune / or
  olive: "#77753f",
  moss: "#2f4b3b", // vert profond
  indigo: "#283d5b", // bleu
  rose: "#b88676",
  ochre: "#a87a3c",
  sand: "#d8c3a0",
  umber: "#4a3324",
} as const;

export type TextileColor = keyof typeof textile;
export const textileColors = Object.values(textile);
