"use client";

import { useRef } from "react";
import { gsap, MQ, SplitText, useGSAP } from "@/components/motion/gsap";
import { convergence } from "@/content/home";
import { textileColors } from "@/lib/palette";

/** Positions de départ autour du cadre (en % de la scène). */
const spots = [
  { x: 14, y: 18 },
  { x: 44, y: 14 },
  { x: 80, y: 18 },
  { x: 88, y: 42 },
  { x: 84, y: 74 },
  { x: 60, y: 88 },
  { x: 28, y: 86 },
  { x: 12, y: 68 },
  { x: 11, y: 42 },
  { x: 70, y: 28 },
  { x: 24, y: 30 },
  { x: 74, y: 62 },
];

/**
 * Des mots venus de toutes les directions convergent vers « RENCONTRE ».
 */
export default function Convergence() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ desktop: MQ.desktop, mobile: MQ.mobile }, (ctx) => {
        const { desktop } = ctx.conditions as { desktop: boolean };
        const stage = root.current!.querySelector<HTMLElement>("[data-stage]")!;
        const words = gsap.utils.toArray<HTMLElement>("[data-word]");
        const split = SplitText.create(root.current!.querySelector<HTMLElement>("[data-target]")!, { type: "chars" });

        const tl = gsap.timeline({
          scrollTrigger: { trigger: stage, start: "top top", end: desktop ? "+=180%" : "+=120%", scrub: 1, pin: true },
        });
        tl.from(words, { opacity: 0, scale: 0.8, duration: 0.25, stagger: 0.02 })
          .to(
            words,
            {
              // vers le centre de la scène (chaque mot est centré sur son point via translate -50%)
              x: (_: number, el: HTMLElement) => stage.clientWidth / 2 - el.offsetLeft,
              y: (_: number, el: HTMLElement) => stage.clientHeight / 2 - el.offsetTop,
              scale: 0.35,
              opacity: 0,
              ease: "power2.in",
              duration: 1,
              stagger: { each: 0.03, from: "edges" },
            },
            0.35,
          )
          .from("[data-ring]", { scale: 0, opacity: 0, duration: 0.6, ease: "expo.out" }, 1.1)
          .from(split.chars, { yPercent: 120, opacity: 0, stagger: 0.04, duration: 0.5, ease: "expo.out" }, 1.15)
          .from("[data-caption]", { opacity: 0, y: 20, duration: 0.4 }, 1.6)
          .to({}, { duration: 0.3 });

        return () => split.revert();
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="convergence-title" className="relative bg-night text-cream">
      <div data-stage className="grain relative h-[100svh] min-h-[560px] overflow-hidden">
        <p className="eyebrow gutter absolute left-0 right-0 top-[calc(var(--nav-h)+1.5rem)] z-[2] text-center text-cream/50">
          {convergence.eyebrow}
        </p>

        <ul aria-label="Le mot « rencontre » dans différentes langues">
          {convergence.words.map((w, i) => (
            <li
              key={w.text}
              data-word
              lang={w.lang}
              className={`absolute whitespace-nowrap font-light ${i > 6 ? "max-md:hidden" : ""} ${
                w.lang === "ar" || w.lang === "he" ? "font-arabic" : ""
              } ${i % 3 === 0 ? "font-serif italic" : ""}`}
              style={{
                left: `${spots[i].x}%`,
                top: `${spots[i].y}%`,
                translate: "-50% -50%",
                fontSize: `clamp(1.1rem, ${1.4 + (i % 4) * 0.7}vw, ${2 + (i % 4) * 0.9}rem)`,
                color: `color-mix(in oklab, ${textileColors[i % textileColors.length]} 55%, #f4ecdd)`,
              }}
            >
              {w.text}
            </li>
          ))}
        </ul>

        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <span
            data-ring
            aria-hidden="true"
            className="absolute h-[min(70vw,520px)] w-[min(70vw,520px)] rounded-full border border-saffron/25"
            style={{ boxShadow: "0 0 120px 10px rgba(201,154,62,.08) inset" }}
          />
          <h2
            id="convergence-title"
            data-target
            className="relative whitespace-nowrap pl-[0.12em] text-[clamp(2rem,8.6vw,10rem)] font-extralight uppercase leading-none tracking-[0.12em] md:pl-[0.18em] md:tracking-[0.18em]"
          >
            {convergence.word}
          </h2>
          <p data-caption className="relative mt-8 max-w-xl font-serif text-lg italic text-cream/75 md:text-2xl">
            {convergence.caption}
          </p>
        </div>
      </div>
    </section>
  );
}
