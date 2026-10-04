import type { CSSProperties } from "react";
import { seeded } from "./patchwork";

/** Bord effiloché : polygone irrégulier le long du bord droit d'une pièce de tissu. */
export function frayedEdge(seed: number, base: number, amp: number) {
  const rnd = seeded(seed);
  const pts: string[] = ["0% 0%"];
  for (let y = 0; y <= 100; y += 2.5) pts.push(`${(base + rnd() * amp).toFixed(2)}% ${y}%`);
  pts.push("0% 100%");
  return `polygon(${pts.join(", ")})`;
}

/** Trame de tissu (fils croisés). */
export const weave: CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(0deg, rgba(0,0,0,.075) 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, rgba(255,255,255,.055) 0 1px, transparent 1px 3px)",
};

/** Grain (bruit) à superposer en multiply. */
export const noise =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";
