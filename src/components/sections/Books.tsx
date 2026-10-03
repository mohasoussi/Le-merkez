"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/components/motion/gsap";
import RevealText from "@/components/motion/RevealText";
import BookCover from "@/components/ui/BookCover";
import Button from "@/components/ui/Button";
import { books, bookstore } from "@/content/books";

/**
 * LIBRAIRIE — couvertures flottantes qui réagissent à la souris.
 */
export default function Books() {
  const root = useRef<HTMLElement>(null);
  const shown = books.slice(0, 5);

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
          stagger: 0.1,
          scrollTrigger: { trigger: "[data-shelf]", start: "top 85%", once: true },
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
            gsap.to(el, { x: px * 40 * depth, y: py * 30 * depth, rotationY: px * 16, rotationX: -py * 10, duration: 1.2, ease: "power3.out" });
          });
        });
        shelf.addEventListener("pointermove", move);
        return () => shelf.removeEventListener("pointermove", move);
      });
    },
    { scope: root },
  );

  const layout = [
    "lg:translate-y-10 lg:-rotate-6",
    "lg:-translate-y-8 lg:rotate-3",
    "lg:translate-y-16 lg:-rotate-2",
    "lg:-translate-y-4 lg:rotate-6",
    "lg:translate-y-8 lg:-rotate-3",
  ];

  return (
    <section ref={root} id="librairie" aria-labelledby="books-title" className="grain relative overflow-hidden bg-umber py-28 text-cream md:py-40">
      <div className="gutter relative z-[2] mx-auto max-w-[1600px]">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-6 flex items-center gap-4 text-saffron">
              <span aria-hidden="true" className="stitch inline-block w-10" />
              {bookstore.eyebrow}
            </p>
            <RevealText as="h2" id="books-title" className="display text-[clamp(2.3rem,4.8vw,4.6rem)]">
              {bookstore.title}
            </RevealText>
            <RevealText className="mt-8 max-w-md text-lg leading-relaxed text-cream/75">{bookstore.text}</RevealText>
            <div className="mt-10">
              <Button href={bookstore.cta.href} variant="glass">
                {bookstore.cta.label}
              </Button>
            </div>
          </div>
          <div
            data-shelf
            className="-mx-[var(--gutter)] flex snap-x snap-mandatory gap-5 overflow-x-auto px-[var(--gutter)] pb-6 [perspective:1400px] [scrollbar-width:none] lg:col-span-7 lg:mx-0 lg:grid lg:grid-cols-5 lg:items-center lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0"
          >
            {shown.map((b, i) => (
              <div key={b.slug} data-book className={`w-[46vw] max-w-[220px] shrink-0 snap-center lg:w-auto lg:max-w-none ${layout[i % layout.length]}`}>
                <div className="animate-float" style={{ animationDelay: `${i * -1.3}s` }}>
                  <div data-book-inner className="[transform-style:preserve-3d]">
                    <BookCover book={b} index={i} sizes="(min-width:1024px) 12vw, 46vw" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
