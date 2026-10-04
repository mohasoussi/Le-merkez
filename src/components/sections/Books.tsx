"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/components/motion/gsap";
import RevealText from "@/components/motion/RevealText";
import BookCover from "@/components/ui/BookCover";
import Button from "@/components/ui/Button";
import { bookstore, featuredBooks } from "@/content/books";

const layout = ["lg:translate-y-10 lg:-rotate-3", "lg:-translate-y-6 lg:rotate-2", "lg:translate-y-14 lg:-rotate-1", "lg:-translate-y-2 lg:rotate-3", "lg:translate-y-8 lg:-rotate-2", "lg:-translate-y-8 lg:rotate-1", "lg:translate-y-12 lg:-rotate-3"];

/**
 * OUVRAGES — couvertures flottantes des éditions Les 7 Lectures, qui réagissent à la souris.
 */
export default function Books() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const mm = gsap.matchMedia();
      mm.add(`${MQ.desktop}, ${MQ.mobile}`, () => {
        gsap.from("[data-book]", {
          y: 160,
          rotation: (i) => (i % 2 ? 8 : -8),
          opacity: 0,
          duration: 1.6,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: "[data-shelf]", start: "top 88%", once: true },
        });
      });
      mm.add(MQ.desktop, () => {
        const shelf = root.current!.querySelector<HTMLElement>("[data-shelf]")!;
        const items = gsap.utils.toArray<HTMLElement>("[data-book-inner]");
        const move = contextSafe!((e: PointerEvent) => {
          const r = shelf.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          items.forEach((el, i) => {
            const depth = 0.6 + (i % 3) * 0.35;
            gsap.to(el, { x: px * 36 * depth, y: py * 26 * depth, rotationY: px * 14, rotationX: -py * 8, duration: 1.2, ease: "power3.out" });
          });
        });
        shelf.addEventListener("pointermove", move);
        return () => shelf.removeEventListener("pointermove", move);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="ouvrages" aria-labelledby="books-title" className="grain relative overflow-hidden bg-umber py-28 text-cream md:py-36">
      <div className="gutter relative z-[2] mx-auto max-w-[1600px]">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <p className="eyebrow mb-6 flex items-center gap-4 text-saffron">
              <span aria-hidden="true" className="stitch inline-block w-10" />
              {bookstore.eyebrow}
            </p>
            <RevealText as="h2" id="books-title" className="display text-[clamp(2.3rem,4.8vw,4.6rem)]">
              {bookstore.title}
            </RevealText>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <RevealText className="text-lg leading-relaxed text-cream/75">{bookstore.text}</RevealText>
            <div className="mt-8">
              <Button href={bookstore.cta.href} variant="glass">
                {bookstore.cta.label}
              </Button>
            </div>
          </div>
        </div>

        <ul
          data-shelf
          className="-mx-[var(--gutter)] mt-16 flex snap-x snap-mandatory gap-5 overflow-x-auto px-[var(--gutter)] pb-8 [perspective:1400px] [scrollbar-width:none] lg:mx-0 lg:mt-24 lg:grid lg:grid-cols-7 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-16"
        >
          {featuredBooks.map((b, i) => (
            <li key={b.slug} data-book className={`w-[42vw] max-w-[200px] shrink-0 snap-center lg:w-auto lg:max-w-none ${layout[i % layout.length]}`}>
              <div className="animate-float" style={{ animationDelay: `${i * -1.1}s` }}>
                <Link href={`/librairie#${b.slug}`} data-book-inner className="group block [transform-style:preserve-3d]">
                  <BookCover book={b} index={i} sizes="(min-width:1024px) 13vw, 42vw" />
                  <span className="mt-4 block text-sm font-light leading-snug text-cream/85 transition-colors group-hover:text-saffron">{b.title}</span>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
