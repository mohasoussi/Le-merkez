"use client";

import Link from "next/link";
import { useRef, type CSSProperties } from "react";
import { gsap, MQ, setImmersive, useGSAP } from "@/components/motion/gsap";
import { actions, type ActionAxis } from "@/content/actions";
import { makePatches, patchStyle } from "@/lib/patchwork";

/** Patchwork propre à chaque carte : nuances de la couleur de l'axe + accents. */
function cardPatches(a: ActionAxis, seed: number) {
  const shades = [
    a.color,
    `color-mix(in oklab, ${a.color} 70%, white)`,
    `color-mix(in oklab, ${a.color} 75%, black)`,
    a.accent,
    `color-mix(in oklab, ${a.color} 50%, ${a.accent})`,
  ];
  return makePatches(12, seed).map((p, i) => ({ ...p, color: shades[i % shades.length], accent: i % 3 ? "#f4ecdd" : a.accent }));
}

function ActionCard({ action, index }: { action: ActionAxis; index: number }) {
  const patches = cardPatches(action, 30 + index * 7);
  const href = action.slug === "librairie" ? "/librairie" : `/actions/${action.slug}`;
  return (
    <article
      data-card
      className="group relative h-[min(70svh,640px)] w-[80vw] shrink-0 snap-center sm:w-[56vw] lg:w-[min(30vw,460px)]"
      style={{ "--c": action.color, "--a": action.accent } as CSSProperties}
    >
      <div
        data-card-inner
        className="relative flex h-full flex-col overflow-hidden rounded-[26px] text-cream shadow-[0_40px_80px_-30px_rgba(0,0,0,.7)] transition-transform duration-700 ease-[var(--ease-silk)] group-hover:-translate-y-2"
        style={{ background: `linear-gradient(160deg, color-mix(in oklab, var(--c) 82%, white) 0%, var(--c) 45%, color-mix(in oklab, var(--c) 70%, black) 100%)` }}
      >
        {/* Lumière qui dérive dans la carte */}
        <span
          aria-hidden="true"
          className="animate-drift pointer-events-none absolute -right-1/4 -top-1/4 h-[80%] w-[90%] rounded-full opacity-60"
          style={{ background: `radial-gradient(circle, color-mix(in oklab, var(--a) 70%, transparent), transparent 65%)`, "--dur": `${12 + index * 2}s`, "--dx": "-60px", "--dy": "50px" } as CSSProperties}
        />

        {/* Patchwork animé */}
        <div role={action.image.src ? "img" : undefined} aria-label={action.image.src ? action.image.alt : undefined} aria-hidden={action.image.src ? undefined : true} className="relative mx-5 mt-5 grid h-[42%] grid-cols-4 grid-rows-3 gap-[3px] overflow-hidden rounded-[16px] [perspective:800px] md:mx-6 md:mt-6">
          {patches.map((p, i) => (
            <span
              key={p.id}
              data-tile
              className="block"
              style={
                action.image.src
                  ? {
                      // la photo de l'axe, découpée en 12 carrés de tissu
                      backgroundImage: `url(${action.image.src})`,
                      backgroundSize: "400% 300%",
                      backgroundPosition: `${((i % 4) / 3) * 100}% ${(Math.floor(i / 4) / 2) * 100}%`,
                    }
                  : patchStyle(p)
              }
            />
          ))}
          <span
            data-number
            aria-hidden="true"
            className="absolute bottom-2 right-3 text-[clamp(3rem,7vw,6rem)] font-extralight leading-none text-cream mix-blend-overlay"
          >
            {action.number}
          </span>
        </div>

        <div className="relative flex flex-1 flex-col px-6 pb-6 pt-6 md:px-8 md:pb-8">
          <p className="eyebrow text-cream/70">{action.number} — Nos actions</p>
          <h3 className="mt-3 text-[clamp(1.5rem,2.2vw,2.1rem)] font-light uppercase leading-[1.05] tracking-[0.02em]">{action.title}</h3>
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-cream/85 md:text-[0.95rem]">{action.summary}</p>
          {action.highlights && (
            <ul className="mt-4 flex flex-wrap gap-1.5 max-sm:hidden">
              {action.highlights.slice(0, 4).map((h) => (
                <li key={h} className="rounded-full border border-cream/30 bg-cream/10 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.14em] backdrop-blur-sm">
                  {h}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-auto pt-5" />
          <Link
            href={href}
            className="inline-flex items-center gap-3 self-start rounded-full bg-cream px-5 py-3 text-[0.62rem] font-semibold uppercase tracking-[0.2em] transition-transform duration-500 after:absolute after:inset-0 hover:scale-105"
            style={{ color: action.color }}
          >
            {action.slug === "librairie" ? "Découvrir les ouvrages" : "Découvrir"}
            <span aria-hidden="true">→</span>
            <span className="sr-only"> — {action.title}</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

/**
 * NOS ACTIONS — cartes colorées et animées qui défilent de droite à gauche au fil du scroll
 * (ordinateur et mobile). Chaque carte pivote et se pose en entrant, ses carrés de tissu se
 * retournent un à un. Sans JS ou en mouvement réduit : carrousel horizontal natif.
 */
export default function ActionChapters() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ desktop: MQ.desktop, mobile: MQ.mobile }, (ctx) => {
        const { desktop } = ctx.conditions as { desktop: boolean };
        const section = root.current!;
        section.classList.add("is-h");
        const track = section.querySelector<HTMLElement>("[data-track]")!;
        const distance = () => track.scrollWidth - window.innerWidth;

        const scroll = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance() * (desktop ? 1 : 1.3)}`,
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
            onToggle: (self) => setImmersive(self.isActive),
            onUpdate: (self) => gsap.set("[data-progress]", { scaleX: self.progress }),
          },
        });

        gsap.utils.toArray<HTMLElement>("[data-card]").forEach((card) => {
          // la carte arrive inclinée, se pose au centre, repart en s'inclinant
          gsap
            .timeline({ scrollTrigger: { containerAnimation: scroll, trigger: card, start: "left right", end: "right left", scrub: true } })
            .fromTo(card, { rotation: 7, yPercent: 8, scale: 0.9 }, { rotation: 0, yPercent: 0, scale: 1, ease: "power2.out" })
            .to(card, { rotation: -6, yPercent: -4, scale: 0.92, ease: "power2.in" });
          // les carrés de tissu se retournent un à un
          gsap.from(card.querySelectorAll("[data-tile]"), {
            rotationY: 90,
            opacity: 0,
            transformOrigin: "50% 50%",
            ease: "back.out(1.6)",
            stagger: { each: 0.04, from: "random" },
            scrollTrigger: { containerAnimation: scroll, trigger: card, start: "left 95%", end: "left 45%", scrub: true },
          });
          gsap.fromTo(
            card.querySelector("[data-number]"),
            { xPercent: 40 },
            { xPercent: -20, ease: "none", scrollTrigger: { containerAnimation: scroll, trigger: card, start: "left right", end: "right left", scrub: true } },
          );
        });

        return () => {
          setImmersive(false);
          section.classList.remove("is-h");
        };
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="actions" aria-labelledby="actions-title" className="group/h grain relative overflow-hidden bg-night text-cream">
      {/* halo de couleurs en fond */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span className="animate-drift absolute -left-[10%] top-[10%] h-[70vmax] w-[70vmax] rounded-full opacity-30" style={{ background: "radial-gradient(circle, #283d5b, transparent 65%)", "--dur": "20s" } as CSSProperties} />
        <span className="animate-drift absolute -right-[10%] bottom-[-20%] h-[70vmax] w-[70vmax] rounded-full opacity-30" style={{ background: "radial-gradient(circle, #8f2d22, transparent 65%)", "--dur": "24s", "--dx": "-40px" } as CSSProperties} />
      </div>

      <div
        data-track
        className="relative z-[2] flex snap-x snap-mandatory items-center gap-5 overflow-x-auto px-[var(--gutter)] py-24 [scrollbar-width:none] group-[.is-h]/h:h-[100svh] group-[.is-h]/h:w-max group-[.is-h]/h:snap-none group-[.is-h]/h:overflow-visible group-[.is-h]/h:py-0 md:gap-8"
      >
        {/* Introduction */}
        <div className="w-[80vw] shrink-0 snap-start pr-4 sm:w-[50vw] lg:w-[30vw] lg:pr-10">
          <p className="eyebrow mb-6 flex items-center gap-4 text-saffron">
            <span aria-hidden="true" className="stitch inline-block w-10" />
            Nos actions
          </p>
          <h2 id="actions-title" className="display text-[clamp(2.6rem,6vw,6rem)] uppercase">
            Nos actions
          </h2>
          <p className="mt-6 max-w-sm text-base leading-relaxed text-cream/70 md:text-lg">
            Se rencontrer, dialoguer, se retirer, réfléchir, servir et transmettre : cinq chemins pour une même intention.
          </p>
          <p aria-hidden="true" className="eyebrow mt-10 flex items-center gap-3 text-cream/50">
            Faites défiler <span className="inline-block animate-pulse">→</span>
          </p>
        </div>

        {actions.map((a, i) => (
          <ActionCard key={a.slug} action={a} index={i} />
        ))}
        <div aria-hidden="true" className="w-[4vw] shrink-0" />
      </div>

      <div aria-hidden="true" className="absolute bottom-8 left-[var(--gutter)] right-[var(--gutter)] z-[2] hidden h-px bg-cream/15 group-[.is-h]/h:block">
        <div data-progress className="h-full origin-left scale-x-0 bg-saffron" />
      </div>
    </section>
  );
}
