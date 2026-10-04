"use client";

import Link from "next/link";
import { useRef, type CSSProperties } from "react";
import { gsap, MQ, useGSAP } from "@/components/motion/gsap";
import Photo from "@/components/ui/Photo";
import { frayedEdge, noise, weave } from "@/lib/fabric";

export interface StoryItem {
  word: string;
  subtitle: string;
  color: string;
  ink: string;
  thread: string;
  text: string[];
  list?: string[];
  after?: string;
  motto?: string;
  href: string | null;
  hrefLabel: string | null;
  photo: { src: string | null; alt: string; placeholder?: string; position?: string };
}

/**
 * Bandes de tissu rapiécé à lire : un morceau d'étoffe (trame, grain, bord effiloché, pièce brodée,
 * couture pointillée) porte le texte ; la photo se découvre derrière le bord déchiré.
 * Chaque bande se déroule en entrant dans l'écran. Sans JS : bandes empilées, tout est visible.
 */
export default function FabricStory({ items }: { items: StoryItem[] }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MQ.desktop}, ${MQ.mobile}`, () => {
        gsap.utils.toArray<HTMLElement>("[data-story]").forEach((band) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: band, start: "top 78%", once: true } });
          tl.fromTo(band.querySelector("[data-st-fray]"), { xPercent: -104, skewX: 4 }, { xPercent: 0, skewX: 0, duration: 1.2, ease: "expo.out" }, 0.06)
            .fromTo(band.querySelector("[data-st-fabric]"), { xPercent: -104, skewX: 4 }, { xPercent: 0, skewX: 0, duration: 1.2, ease: "expo.out" }, 0)
            .fromTo(band.querySelector("[data-st-photo]"), { clipPath: "inset(0% 0% 0% 100%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.inOut" }, 0.3)
            .fromTo(band.querySelector("[data-st-photo-inner]"), { scale: 1.3 }, { scale: 1.02, duration: 2.2, ease: "power2.out" }, 0.3)
            .fromTo(band.querySelectorAll("[data-st]"), { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.9, ease: "expo.out", stagger: 0.09 }, 0.45);
        });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      {items.map((it, i) => {
        const clip = frayedEdge(i * 13 + 5, 95.2, 3.4);
        const fray = frayedEdge(i * 13 + 11, 96.6, 3.2);
        return (
          <article
            key={it.word}
            data-story
            aria-labelledby={`story-${i}`}
            className="relative flex flex-col overflow-hidden bg-night md:block md:min-h-[460px]"
            style={{ ["--clip" as string]: clip, ["--fray" as string]: fray, ["--ink" as string]: it.ink } as CSSProperties}
          >
            {/* Photo (à droite, derrière le bord déchiré) */}
            <div data-st-photo className="relative order-2 h-60 overflow-hidden bg-umber md:absolute md:inset-y-0 md:right-0 md:h-auto md:w-[44%]">
              <div data-st-photo-inner className="absolute inset-0">
                <Photo media={it.photo} position={it.photo.position} seed={i * 9 + 4} showLabel={false} sizes="(min-width:768px) 44vw, 100vw" className="h-full w-full" />
              </div>
              {!it.photo.src && <span className="ph-label absolute bottom-3 right-4 z-[3] max-w-[70%] text-right text-cream/85">{it.photo.placeholder}</span>}
              <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-transparent" />
            </div>

            {/* Fils effilochés derrière le tissu */}
            <div data-st-fray aria-hidden="true" className="absolute inset-y-0 left-0 hidden w-[66%] md:block" style={{ background: "#e9dcc4", opacity: 0.85, clipPath: "var(--fray)" }} />

            {/* Tissu */}
            <div data-st-fabric className="relative z-[2] order-1 md:w-[64%] md:[clip-path:var(--clip)]" style={{ background: it.color, color: it.ink, ...weave }}>
              <span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.28] mix-blend-multiply" style={{ backgroundImage: noise }} />
              {/* pièce brodée à gauche, cousue par une ligne pointillée verticale */}
              <div aria-hidden="true" className="absolute inset-y-0 left-0 w-[6%] min-w-6 md:w-[8%]" style={{ background: "rgba(0,0,0,.14)", borderRight: `2px dashed ${it.thread}` }}>
                <svg className="absolute inset-0 h-full w-full opacity-60" preserveAspectRatio="none">
                  <defs>
                    <pattern id={`story-dia-${i}`} width="14" height="14" patternUnits="userSpaceOnUse">
                      <path d="M7 1 L13 7 L7 13 L1 7 Z" fill="none" stroke={it.thread} strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill={`url(#story-dia-${i})`} />
                </svg>
              </div>
              {/* couture du bas */}
              <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-px" style={{ borderBottom: `2px dashed ${it.thread}` }} />

              <div className="relative px-6 py-10 pl-[calc(6%+1.75rem)] md:py-14 md:pl-[calc(8%+2.5rem)] md:pr-[8%] lg:pr-[10%]">
                <p data-st className="text-[0.65rem] font-semibold tracking-[0.3em] opacity-70">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 id={`story-${i}`} data-st className="mt-2 text-[clamp(1.9rem,3.8vw,3.4rem)] font-semibold uppercase leading-[0.98] tracking-[0.02em]">
                  {it.word}
                </h3>
                <p data-st className="mt-2 max-w-[30ch] text-[clamp(0.95rem,1.4vw,1.25rem)] leading-snug opacity-85">
                  {it.subtitle}
                </p>
                <div className="mt-6 max-w-xl space-y-4 text-[clamp(0.95rem,1.15vw,1.1rem)] leading-relaxed">
                  {it.text.map((t) => (
                    <p key={t} data-st className="opacity-90">
                      {t}
                    </p>
                  ))}
                  {it.list && (
                    <ul data-st className="grid gap-x-6 sm:grid-cols-2">
                      {it.list.map((l) => (
                        <li key={l} className="flex items-center gap-3 border-b py-2 text-[0.95em]" style={{ borderColor: `${it.thread}66` }}>
                          <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rotate-45" style={{ backgroundColor: it.thread }} />
                          {l}
                        </li>
                      ))}
                    </ul>
                  )}
                  {it.after && (
                    <p data-st className="opacity-90">
                      {it.after}
                    </p>
                  )}
                  {it.motto && (
                    <p data-st className="border-l-2 pl-4 font-serif text-[1.2em] italic leading-snug" style={{ borderColor: it.thread }}>
                      {it.motto}
                    </p>
                  )}
                  {it.href && (
                    <p data-st>
                      <Link href={it.href} className="inline-flex items-center gap-3 border-b border-current pb-1 text-[0.66rem] font-semibold uppercase tracking-[0.22em]">
                        {it.hrefLabel} <span aria-hidden="true">→</span>
                      </Link>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
