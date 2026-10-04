"use client";

import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import { gsap, MQ, setImmersive, useGSAP } from "@/components/motion/gsap";
import Photo from "@/components/ui/Photo";
import { fabricBands, type FabricBand } from "@/content/home";
import { featuredBooks } from "@/content/books";
import { seeded } from "@/lib/patchwork";

/** Bord effiloché : polygone irrégulier le long du bord droit du tissu. */
function frayedEdge(seed: number, base: number, amp: number) {
  const rnd = seeded(seed);
  const pts: string[] = ["0% 0%"];
  for (let y = 0; y <= 100; y += 2.5) pts.push(`${(base + rnd() * amp).toFixed(2)}% ${y}%`);
  pts.push("0% 100%");
  return `polygon(${pts.join(", ")})`;
}

const weave: CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(0deg, rgba(0,0,0,.075) 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, rgba(255,255,255,.055) 0 1px, transparent 1px 3px)",
};
const noise =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

/** Fil cousu : ligne ondulée en pointillés qui se dessine. */
function Thread({ color, seed }: { color: string; seed: number }) {
  const rnd = seeded(seed);
  let d = "M0 5";
  for (let x = 0; x <= 1000; x += 100) d += ` Q${x + 50} ${5 + (rnd() - 0.5) * 6} ${x + 100} 5`;
  return (
    <svg aria-hidden="true" viewBox="0 0 1000 10" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-2 w-full overflow-visible">
      <path data-thread d={d} pathLength={1} fill="none" stroke={color} strokeWidth="2.5" strokeDasharray="0.012 0.008" strokeLinecap="round" />
    </svg>
  );
}

function Band({ band, index }: { band: FabricBand; index: number }) {
  const edge = frayedEdge(index * 11 + 3, 95, 3.4);
  const fray = frayedEdge(index * 11 + 9, 96.6, 3.2);
  return (
    <div data-band className="group/band relative min-h-[170px] flex-1 overflow-hidden bg-night group-[.is-pinned]/fb:min-h-0 sm:min-h-[200px]" style={{ ["--ink" as string]: band.ink }}>
      {/* Photo à droite */}
      <div data-photo className="absolute inset-y-0 right-0 w-[58%] overflow-hidden bg-umber">
        <div data-photo-inner className="absolute inset-0">
          {band.books ? (
            <div className="absolute inset-0 flex items-center justify-center gap-[3%] bg-[radial-gradient(ellipse_at_70%_40%,#3a2616,#14100c_75%)] pl-[34%] pr-4 max-sm:pl-[30%]">
              {featuredBooks.slice(0, 3).map((b, i) => (
                <div key={b.slug} className={`relative aspect-[600/950] h-[78%] shrink-0 shadow-[0_20px_40px_-12px_rgba(0,0,0,.8)] ${i === 2 ? "max-sm:hidden" : ""}`} style={{ rotate: `${(i - 1) * 5}deg`, translate: `0 ${i === 1 ? "-4%" : "3%"}` }}>
                  <Image src={b.cover.src!} alt={i === 0 ? "Couvertures d’ouvrages des éditions Les 7 Lectures" : ""} fill sizes="12vw" className="object-cover" />
                </div>
              ))}
            </div>
          ) : (
            <Photo media={band.photo} seed={index * 9 + 4} showLabel={false} sizes="(min-width:768px) 58vw, 60vw" className="h-full w-full" position={band.photo.position} />
          )}
        </div>
        {!band.books && !band.photo.src && (
          <span className="ph-label absolute bottom-3 right-3 z-[3] max-w-[55%] text-right text-[0.5rem] text-cream/85 sm:text-[0.625rem]">{band.photo.placeholder}</span>
        )}
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-transparent" />
      </div>

      {/* Fils effilochés (derrière le tissu) */}
      <div data-fray aria-hidden="true" className="absolute inset-y-0 left-0 w-[60%]" style={{ background: "#e9dcc4", opacity: 0.85, clipPath: fray }} />

      {/* Tissu */}
      <div data-fabric className="absolute inset-y-0 left-0 z-[2] w-[60%]" style={{ background: band.color, clipPath: edge, ...weave }}>
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.28] mix-blend-multiply" style={{ backgroundImage: noise }} />
        {/* pièce brodée à gauche, cousue par une ligne pointillée verticale */}
        <div aria-hidden="true" className="absolute inset-y-0 left-0 w-[11%]" style={{ background: "rgba(0,0,0,.14)", borderRight: `2px dashed ${band.thread}` }}>
          <svg className="absolute inset-0 h-full w-full opacity-60" preserveAspectRatio="none">
            <defs>
              <pattern id={`dia-${index}`} width="14" height="14" patternUnits="userSpaceOnUse">
                <path d="M7 1 L13 7 L7 13 L1 7 Z" fill="none" stroke={band.thread} strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#dia-${index})`} />
          </svg>
        </div>
        <div className="relative flex h-full flex-col justify-center pl-[15%] pr-[8%]" style={{ color: band.ink }}>
          <div className="line-mask">
            <h3 data-word className="text-[clamp(1.15rem,3.1vw,3rem)] font-semibold uppercase leading-[0.98] tracking-[0.02em]">
              {band.word}
            </h3>
          </div>
          <p data-line className="mt-1.5 max-w-[28ch] text-[clamp(0.68rem,1.15vw,1.1rem)] leading-snug opacity-85 md:mt-3">
            {band.line}
          </p>
        </div>
      </div>

      <Thread color={band.thread} seed={index + 40} />
    </div>
  );
}

/**
 * LES CINQ GESTES — cinq bandes de tissu superposées : titre à gauche, photo à droite, couture entre chaque.
 * Ordinateur : section épinglée, les bandes se déroulent l'une après l'autre au scroll.
 * Mobile : chaque bande se déroule en entrant dans l'écran. Sans JS : bandes empilées, tout est visible.
 */
export default function FabricBands() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      const reveal = (tl: gsap.core.Timeline, band: HTMLElement, at: number, fast = false) => {
        const d = fast ? 0.8 : 1.1;
        tl.fromTo(band.querySelector("[data-fray]"), { xPercent: -108, skewX: 5 }, { xPercent: 0, skewX: 0, duration: d, ease: "expo.out" }, at + 0.06)
          .fromTo(band.querySelector("[data-fabric]"), { xPercent: -108, skewX: 5 }, { xPercent: 0, skewX: 0, duration: d, ease: "expo.out" }, at)
          .fromTo(band.querySelector("[data-photo]"), { clipPath: "inset(0% 0% 0% 100%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: d + 0.2, ease: "expo.inOut" }, at + 0.25)
          .fromTo(band.querySelector("[data-photo-inner]"), { scale: 1.35 }, { scale: 1.02, duration: d + 0.8, ease: "power2.out" }, at + 0.25)
          .fromTo(band.querySelector("[data-word]"), { yPercent: 115 }, { yPercent: 0, duration: 0.9, ease: "expo.out" }, at + 0.35)
          .fromTo(band.querySelector("[data-line]"), { opacity: 0, y: 14 }, { opacity: 0.85, y: 0, duration: 0.8, ease: "power2.out" }, at + 0.55)
          .fromTo(band.querySelector("[data-thread]"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, ease: "power1.inOut" }, at + 0.2);
      };

      // Ordinateur : épinglé
      mm.add(MQ.desktop, () => {
        const section = root.current!;
        section.classList.add("is-pinned");
        const bands = gsap.utils.toArray<HTMLElement>("[data-band]");
        gsap.set(bands, { backgroundColor: "#14100c" });
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: "[data-fb-stage]",
            start: "top top",
            end: "+=260%",
            scrub: 1,
            pin: true,
            onToggle: (self) => setImmersive(self.isActive),
          },
        });
        bands.forEach((b, i) => reveal(tl, b, i * 1.15));
        tl.to({}, { duration: 0.8 });
        return () => {
          setImmersive(false);
          section.classList.remove("is-pinned");
        };
      });

      // Mobile : chaque bande se déroule à son arrivée
      mm.add(MQ.mobile, () => {
        gsap.utils.toArray<HTMLElement>("[data-band]").forEach((b) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: b, start: "top 88%", once: true } });
          reveal(tl, b, 0, true);
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="gestes" aria-labelledby="gestes-title" className="group/fb relative bg-night">
      <h2 id="gestes-title" className="sr-only">
        Les gestes du Merkez : rencontrer, se retrouver, transmettre, servir, cultiver
      </h2>
      <div data-fb-stage className="flex flex-col group-[.is-pinned]/fb:h-[100svh] group-[.is-pinned]/fb:overflow-hidden">
        {fabricBands.map((b, i) => (
          <Band key={b.word} band={b} index={i} />
        ))}
      </div>
    </section>
  );
}
