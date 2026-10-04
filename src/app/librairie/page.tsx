import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import BookCover from "@/components/ui/BookCover";
import { books, bookstore } from "@/content/books";
import { formatPrice, getAvailability } from "@/lib/commerce";

export const metadata: Metadata = {
  title: "Ouvrages",
  description: bookstore.text,
  alternates: { canonical: "/librairie" },
};

/**
 * Catalogue. La structure (src/content/books.ts + src/lib/commerce.ts) est prête
 * pour accueillir une vraie boutique : panier, paiement, stock.
 */
export default function BookstorePage() {
  return (
    <>
      <PageHeader eyebrow="Ouvrages" title={bookstore.title} intro={bookstore.text} seed={45} />
      <div className="bg-umber pt-12">
      <p className="gutter mx-auto max-w-[1600px] text-sm text-cream/60">
        {books.length} ouvrages · Éditions{" "}
        <a href={bookstore.publisher.url} target="_blank" rel="noopener noreferrer" className="text-saffron underline-offset-4 hover:underline">
          {bookstore.publisher.name}
        </a>
      </p>
      </div>
      <section className="bg-umber pb-20 pt-10 text-cream md:pb-28">
        <div className="gutter mx-auto grid max-w-[1600px] grid-cols-2 gap-x-5 gap-y-14 sm:gap-x-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {books.map((b, i) => {
            const availability = getAvailability(b);
            const price = formatPrice(b);
            return (
              <article key={b.slug} id={b.slug} className="group relative flex scroll-mt-28 flex-col">
                <div className="mx-auto w-full max-w-[240px] transition-transform duration-700 ease-[var(--ease-silk)] group-hover:-translate-y-2 group-hover:-rotate-1">
                  <BookCover book={b} index={i} sizes="(min-width:1024px) 240px, 45vw" />
                </div>
                <h2 className="mt-7 text-lg font-light leading-snug">{b.title}</h2>
                {b.subtitle && <p className="mt-1 font-serif text-base italic text-cream/70">{b.subtitle}</p>}
                {b.author && <p className="mt-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-saffron">{b.author}</p>}
                <div className="mt-auto flex flex-col gap-2 pt-5">
                  {price && <span className="text-xs text-cream/65">{price}</span>}
                  {availability.status === "external" ? (
                    <a
                      href={availability.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="eyebrow self-start border-b border-saffron pb-1 text-saffron after:absolute after:inset-0"
                    >
                      {availability.label} →<span className="sr-only"> : {b.title} (Les 7 Lectures, nouvel onglet)</span>
                    </a>
                  ) : (
                    <span className="eyebrow text-cream/45">{availability.label}</span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
