import { makePatches, patchStyle } from "@/lib/patchwork";

/** Surface de patchwork (grille de morceaux de tissu) — sert de visuel de remplacement et de texture. */
export default function PatchField({
  cols = 6,
  rows = 4,
  seed = 3,
  gap = 2,
  className = "",
}: {
  cols?: number;
  rows?: number;
  seed?: number;
  gap?: number;
  className?: string;
}) {
  const patches = makePatches(cols * rows, seed);
  return (
    <div
      aria-hidden="true"
      className={`grid h-full w-full ${className}`}
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)`, gap }}
    >
      {patches.map((p) => (
        <div key={p.id} style={patchStyle(p)} />
      ))}
    </div>
  );
}
