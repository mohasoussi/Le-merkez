import Image from "next/image";
import type { Book } from "@/content/books";
import { makePatches, patchStyle } from "@/lib/patchwork";

/** Couverture de livre : image fournie, sinon couverture textile générée. */
export default function BookCover({ book, index = 0, sizes = "240px" }: { book: Book; index?: number; sizes?: string }) {
  if (book.cover.src) {
    return (
      <div className="relative aspect-[600/950] w-full overflow-hidden rounded-[2px] bg-umber shadow-[0_30px_60px_-15px_rgba(0,0,0,.55)]">
        <Image src={book.cover.src} alt={book.cover.alt} fill sizes={sizes} className="object-cover" />
        <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-[4%] bg-gradient-to-r from-black/25 to-transparent" />
      </div>
    );
  }
  const band = makePatches(5, 100 + index * 9);
  return (
    <div
      role="img"
      aria-label={`${book.cover.alt} — ${book.cover.placeholder ?? "couverture à fournir"}`}
      className="relative flex aspect-[600/950] w-full flex-col overflow-hidden rounded-[2px] bg-brown p-[9%] text-cream shadow-[0_30px_60px_-15px_rgba(0,0,0,.55)]"
    >
      <div aria-hidden="true" className="mb-auto flex h-[9%] gap-px">
        {band.map((p) => (
          <span key={p.id} className="flex-1" style={patchStyle(p)} />
        ))}
      </div>
      <p className="mt-auto text-xs">{book.title}</p>
    </div>
  );
}
