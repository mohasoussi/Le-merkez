import Image from "next/image";
import type { Book } from "@/content/books";
import { makePatches, patchStyle } from "@/lib/patchwork";

/** Couverture de livre : image fournie ou couverture textile générée. */
export default function BookCover({ book, index = 0, sizes = "240px" }: { book: Book; index?: number; sizes?: string }) {
  if (book.cover.src) {
    return (
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-[2px] shadow-[0_30px_60px_-15px_rgba(0,0,0,.55)]">
        <Image src={book.cover.src} alt={book.cover.alt} fill sizes={sizes} className="object-cover" />
      </div>
    );
  }
  const band = makePatches(5, 100 + index * 9);
  return (
    <div
      role="img"
      aria-label={`${book.cover.alt} — ${book.cover.placeholder}`}
      className="relative flex aspect-[2/3] w-full flex-col overflow-hidden rounded-[2px] p-[9%] text-cream shadow-[0_30px_60px_-15px_rgba(0,0,0,.55)]"
      style={{ backgroundColor: book.color }}
    >
      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[6%] bg-black/20" />
      <span aria-hidden="true" className="absolute inset-y-0 left-[6%] w-px bg-white/15" />
      <div aria-hidden="true" className="mb-auto flex h-[9%] gap-px">
        {band.map((p) => (
          <span key={p.id} className="flex-1" style={patchStyle(p)} />
        ))}
      </div>
      <p className="ph-label mt-auto text-[0.55rem] text-cream/90">{book.title}</p>
      <p className="ph-label mt-2 text-[0.5rem] text-cream/60">{book.author ?? "[AUTEUR À AJOUTER]"}</p>
      <span className="mt-4 text-[0.55rem] font-semibold uppercase tracking-[0.3em] text-cream/70">Le Merkez</span>
    </div>
  );
}
