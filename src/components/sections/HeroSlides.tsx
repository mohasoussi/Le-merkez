"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "@/components/motion/gsap";
import { heroGroups, heroSlideDelay, heroSlides } from "@/content/home";

const DELAY = heroSlideDelay;

/**
 * Photos coulissantes du hero : chaque photo glisse de droite à gauche en poussant la précédente,
 * pendant que son image « respire » lentement. Les visuels du projet viennent d'abord, puis les actions.
 * Mouvement réduit : première photo fixe, navigation manuelle uniquement.
 */
export default function HeroSlides() {
  const slides = heroSlides;
  const [index, setIndex] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const current = useRef(0);
  const busy = useRef(false);
  const reduce = useRef(false);
  const timer = useRef<number | null>(null);

  const go = useCallback(
    (to: number) => {
      const el = root.current;
      if (!el || to === current.current || busy.current) return;
      const items = el.querySelectorAll<HTMLElement>("[data-slide]");
      const from = items[current.current];
      const next = items[to];
      current.current = to;
      setIndex(to);
      if (reduce.current) {
        gsap.set(items, { autoAlpha: 0 });
        gsap.set(next, { autoAlpha: 1, xPercent: 0 });
        return;
      }
      busy.current = true;
      gsap.set(next, { autoAlpha: 1, xPercent: 100, zIndex: 2 });
      gsap.set(from, { zIndex: 1 });
      gsap
        .timeline({
          defaults: { duration: 1.05, ease: "expo.inOut" },
          onComplete: () => {
            gsap.set(from, { autoAlpha: 0, xPercent: 0 });
            busy.current = false;
          },
        })
        .to(next, { xPercent: 0 }, 0)
        .to(from, { xPercent: -30 }, 0)
        .fromTo(next.querySelector("[data-slide-img]"), { xPercent: -25 }, { xPercent: 0 }, 0);
      // respiration lente de la photo : hors de la transition, pour ne pas la rallonger
      gsap.fromTo(next.querySelector("[data-slide-img]"), { scale: 1.1 }, { scale: 1, duration: 4, ease: "none", overwrite: "auto" });
    },
    [],
  );

  const schedule = useCallback(() => {
    if (timer.current) window.clearTimeout(timer.current);
    if (reduce.current) return;
    timer.current = window.setTimeout(() => {
      if (document.hidden) return schedule();
      go((current.current + 1) % slides.length);
      schedule();
    }, DELAY);
  }, [go, slides.length]);

  useEffect(() => {
    reduce.current = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = root.current!.querySelectorAll<HTMLElement>("[data-slide]");
    gsap.set(items, { autoAlpha: 0 });
    gsap.set(items[0], { autoAlpha: 1, zIndex: 2 });
    if (!reduce.current) gsap.fromTo(items[0].querySelector("[data-slide-img]"), { scale: 1.1 }, { scale: 1, duration: 4, ease: "none" });
    // précharge les photos suivantes pour qu'elles soient prêtes à défiler toutes les 3 s
    const warm = window.setTimeout(() => slides.slice(1).forEach((s) => Object.assign(new window.Image(), { src: s.src })), 600);
    schedule();
    return () => {
      window.clearTimeout(warm);
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [schedule, slides]);

  const pick = (i: number) => {
    go(i);
    schedule();
  };

  const slide = slides[index];
  const group = heroGroups[slide.group];

  return (
    <>
      <div ref={root} data-slides aria-hidden="true" className="absolute inset-0 -z-[5] overflow-hidden bg-night">
        {slides.map((s, i) => (
          <div key={s.src} data-slide className="absolute inset-0 overflow-hidden">
            <div data-slide-img className="absolute -inset-[3%]">
              <Image
                src={s.src}
                alt=""
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
                style={{ objectPosition: s.position ?? "50% 50%" }}
              />
            </div>
          </div>
        ))}
        <div className="absolute inset-0 z-10 bg-night/32" />
        <div className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_62%_58%_at_50%_52%,rgba(20,16,12,.58),transparent_80%)]" />
        <div className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(20,16,12,.55)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 z-10 h-1/3 bg-gradient-to-t from-night/80 to-transparent" />
      </div>

      {/* Légende + navigation */}
      <div className="gutter pointer-events-none absolute inset-x-0 bottom-5 z-[3] flex items-end justify-between gap-4 md:bottom-7">
        <div aria-live="polite" className="max-w-[46%] md:max-w-[40%]">
          <p className="eyebrow flex items-center gap-2 text-[0.55rem] md:text-[0.62rem]" style={{ color: group.color }}>
            <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45" style={{ backgroundColor: group.color }} />
            {group.label}
          </p>
          <p className="mt-1.5 text-[0.62rem] leading-snug text-cream/70 md:text-xs">{slide.caption}</p>
          <span className="sr-only">{slide.alt}</span>
        </div>
        <div className="pointer-events-auto flex items-center gap-1.5" role="group" aria-label="Choisir la photo">
          {slides.map((s, i) => (
            <button
              key={s.src}
              type="button"
              onClick={() => pick(i)}
              aria-label={`Photo ${i + 1} sur ${slides.length}`}
              aria-current={i === index ? "true" : undefined}
              className="group grid h-6 place-items-center px-0.5"
            >
              <span
                className={`block h-[3px] rounded-full transition-all duration-500 ${i === index ? "w-7" : "w-3 opacity-45 group-hover:opacity-90"}`}
                style={{ backgroundColor: heroGroups[s.group].color }}
              />
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
