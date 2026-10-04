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
      <section className="bg-umber py-20 text-cream md:py-28">
        <div className="gutter mx-auto grid max-w-[1600px] gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
          {books.map((b, i) => {
            const availability = getAvailability(b);
            const price = formatPrice(b);
            return (
              <article key={b.slug} className="group">
                <div className="mx-auto max-w-[260px] transition-transform duration-700 ease-[var(--ease-silk)] group-hover:-translate-y-2 group-hover:-rotate-1">
                  <BookCover book={b} index={i} sizes="(min-width:1024px) 260px, 50vw" />
                </div>
                <h2 className={`mt-8 text-lg font-light ${b.placeholder ? "ph-label text-sm text-cream/85" : ""}`}>{b.title}</h2>
                <p className="mt-1 text-sm text-cream/60">{b.author ?? "[AUTEUR À AJOUTER]"}</p>
                <p className="mt-3 text-sm leading-relaxed text-cream/70">{b.description}</p>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                  <span className="text-sm text-cream/80">{price ?? <span className="ph-label text-cream/45">[PRIX À AJOUTER]</span>}</span>
                  {availability.status === "external" ? (
                    <a href={availability.href} target="_blank" rel="noopener noreferrer" className="eyebrow border-b border-saffron pb-1 text-saffron">
                      {availability.label} →
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
