import { textile } from "@/lib/palette";

/**
 * L'emblème du Merkez : 9 carrés de tissu, un centre.
 * Huit couleurs différentes autour d'un cœur commun — le plan du futur lieu reprend la même forme.
 */
export const emblemColors = [
  textile.madder,
  textile.indigo,
  textile.saffron,
  textile.moss,
  "#f4ecdd",
  textile.terracotta,
  textile.ochre,
  textile.rose,
  textile.olive,
];

export default function Emblem({ size = 28, className = "", gap = 1.5 }: { size?: number; className?: string; gap?: number }) {
  const cell = (size - gap * 2) / 3;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className} aria-hidden="true">
      {emblemColors.map((c, i) => (
        <rect
          key={i}
          x={(i % 3) * (cell + gap)}
          y={Math.floor(i / 3) * (cell + gap)}
          width={cell}
          height={cell}
          fill={c}
        />
      ))}
    </svg>
  );
}
