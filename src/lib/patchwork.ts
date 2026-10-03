import type { CSSProperties } from "react";
import { textile } from "./palette";

/** Motifs textiles réalisés en CSS (aucune image à charger). */
export type PatternKind = "plain" | "stripes" | "weave" | "check" | "dots" | "chevron" | "diagonal" | "border";

export interface Patch {
  id: number;
  color: string;
  accent: string;
  pattern: PatternKind;
}

/** Générateur pseudo-aléatoire déterministe (même rendu serveur / client). */
export function seeded(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 100000) / 100000;
  };
}

const colors = [
  textile.madder,
  textile.saffron,
  textile.moss,
  textile.indigo,
  textile.terracotta,
  textile.sand,
  textile.olive,
  textile.rose,
  textile.ochre,
  textile.umber,
];
const patterns: PatternKind[] = ["plain", "stripes", "weave", "plain", "check", "dots", "chevron", "diagonal", "border", "plain"];

export function makePatches(count: number, seed = 7): Patch[] {
  const rnd = seeded(seed);
  return Array.from({ length: count }, (_, id) => {
    const color = colors[Math.floor(rnd() * colors.length)];
    let accent = colors[Math.floor(rnd() * colors.length)];
    if (accent === color) accent = textile.sand;
    return { id, color, accent, pattern: patterns[Math.floor(rnd() * patterns.length)] };
  });
}

/** Retourne le style CSS d'un morceau de tissu. */
export function patchStyle(p: Pick<Patch, "color" | "accent" | "pattern">): CSSProperties {
  const a = `color-mix(in oklab, ${p.accent} 70%, transparent)`;
  switch (p.pattern) {
    case "stripes":
      return { backgroundColor: p.color, backgroundImage: `repeating-linear-gradient(90deg, ${a} 0 3px, transparent 3px 11px)` };
    case "weave":
      return {
        backgroundColor: p.color,
        backgroundImage: `repeating-linear-gradient(0deg, rgba(0,0,0,.14) 0 1px, transparent 1px 4px), repeating-linear-gradient(90deg, rgba(255,255,255,.08) 0 1px, transparent 1px 4px)`,
      };
    case "check":
      return {
        backgroundColor: p.color,
        backgroundImage: `linear-gradient(90deg, ${a} 50%, transparent 50%), linear-gradient(${a} 50%, transparent 50%)`,
        backgroundSize: "14px 14px",
        backgroundBlendMode: "multiply",
      };
    case "dots":
      return { backgroundColor: p.color, backgroundImage: `radial-gradient(${a} 1.5px, transparent 1.6px)`, backgroundSize: "9px 9px" };
    case "chevron":
      return {
        backgroundColor: p.color,
        backgroundImage: `linear-gradient(135deg, ${a} 25%, transparent 25%), linear-gradient(225deg, ${a} 25%, transparent 25%)`,
        backgroundSize: "16px 16px",
      };
    case "diagonal":
      return { backgroundColor: p.color, backgroundImage: `repeating-linear-gradient(45deg, ${a} 0 2px, transparent 2px 9px)` };
    case "border":
      return { backgroundColor: p.color, boxShadow: `inset 0 0 0 4px ${p.accent}, inset 0 0 0 6px rgba(0,0,0,.18)` };
    default:
      return {
        backgroundColor: p.color,
        backgroundImage: `repeating-linear-gradient(0deg, rgba(0,0,0,.08) 0 1px, transparent 1px 3px)`,
      };
  }
}
