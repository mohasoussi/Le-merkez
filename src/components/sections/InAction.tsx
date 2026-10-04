"use client";

import { useRef, type CSSProperties } from "react";
import { gsap, MQ, SplitText, useGSAP } from "@/components/motion/gsap";
import { inAction } from "@/content/home";
import { textile } from "@/lib/palette";

/** Teinte de fond (claire) et couleur d'accent de chaque étape. */
const tints = ["#f4ecdd", "#f3e7e3", "#eef0e4", "#f5e7dc", "#f4ebd6"];
const accents = [textile.saffron, textile.rose, textile.olive, textile.terracotta, textile.indigo];

/** Halos colorés flous qui dérivent lentement derrière le texte. */
const blobs = [
  { c: textile.saffron, x: "18%", y: "28%", s: "58vmax", d: "16s", dx: "140px", dy: "90px" },
  { c: textile.rose, x: "82%", y: "22%", s: "52vmax", d: "19s", dx: "-120px", dy: "110px" },
  { c: textile.moss, x: "72%", y: "84%", s: "50vmax", d: "22s", dx: "-90px", dy: "-120px" },
  { c: textile.indigo, x: "12%", y: "88%", s: "44vmax", d: "18s", dx: "130px", dy: "-80px" },
  { c: textile.terracotta, x: "50%", y: "50%", s: "40vmax", d: "25s", dx: "80px", dy: "70px" },
];

/**
 * LE MERKEZ EN ACTION — Rencontrer → Échanger → Transmettre → Servir → Construire.
 * Fond clair traversé de halos de couleur flous et mouvants.
 * Sans JS ou en mouvement réduit : une simple liste verticale.
 */
export default function InAction() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ desktop: MQ.desktop, mobile: MQ.mobile }, (ctx) => {
        const { desktop } = ctx.conditions as { desktop: boolean };
        const section = root.current!;
        section.classList.add("is-stacked");
        const steps = gsap.utils.toArray<HTMLElement>("[data-step]");
        const splits = steps.map((s) => SplitText.create(s.querySelector("[data-word]")!, { type: "chars", mask: "chars" }));

        gsap.set(steps, { autoAlpha: 0 });
        gsap.set(steps[0], { autoAlpha: 1 });

        const tl = gsap.timeline({
          defaults: { ease: "expo.inOut" },
          scrollTrigger: {
            trigger: "[data-ia-stage]",
            start: "top top",
            end: `+=${steps.length * (desktop ? 90 : 70)}%`,
            scrub: 1,
            pin: true,
          },
        });

        steps.forEach((step, i) => {
          const chars = splits[i].chars;
          const line = step.querySelector("[data-line]");
          const at = i * 1.4;
          if (i > 0) {
            tl.set(step, { autoAlpha: 1 }, at)
              .from(chars, { yPercent: 110, duration: 0.7, stagger: 0.03 }, at)
              .from(line, { opacity: 0, y: 20, duration: 0.5, ease: "power2.out" }, at + 0.3);
          }
          tl.to("[data-ia-stage]", { backgroundColor: tints[i], duration: 0.6, ease: "none" }, at)
            .to("[data-ia-accent]", { backgroundColor: accents[i], duration: 0.6, ease: "none" }, at)
            .to("[data-blobs]", { rotation: i * 24, scale: 1 + (i % 2) * 0.12, duration: 1.2, ease: "sine.inOut" }, at);
          if (i < steps.length - 1) {
            tl.to(chars, { yPercent: -110, duration: 0.6, stagger: 0.02 }, at + 1)
              .to(line, { opacity: 0, y: -16, duration: 0.4 }, at + 1)
              .set(step, { autoAlpha: 0 }, at + 1.6);
          }
        });
        tl.to({}, { duration: 0.6 });

        return () => {
          splits.forEach((s) => s.revert());
          section.classList.remove("is-stacked");
        };
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="en-action" aria-labelledby="inaction-title" className="group relative text-umber">
      <div data-ia-stage className="relative overflow-hidden bg-cream group-[.is-stacked]:h-[100svh]">
        {/* Halos flous */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div data-blobs className="absolute -inset-[15%]">
            {blobs.map((b, i) => (
              <span
                key={i}
                className={`animate-drift absolute rounded-full opacity-55 mix-blend-multiply ${i > 2 ? "max-md:hidden" : ""}`}
                style={
                  {
                    left: b.x,
                    top: b.y,
                    width: b.s,
                    height: b.s,
                    marginLeft: `calc(${b.s} / -2)`,
                    marginTop: `calc(${b.s} / -2)`,
                    background: `radial-gradient(circle, color-mix(in oklab, ${b.c} 70%, white) 0%, transparent 65%)`,
                    "--dur": b.d,
                    "--dx": b.dx,
                    "--dy": b.dy,
                    "--dr": "12deg",
                  } as CSSProperties
                }
              />
            ))}
          </div>
        </div>

        <div className="gutter relative z-[2] mx-auto flex h-full max-w-[1600px] flex-col py-28 group-[.is-stacked]:py-0">
          <div className="pt-[calc(var(--nav-h)+1.5rem)] group-[.is-stacked]:absolute group-[.is-stacked]:inset-x-[var(--gutter)] group-[.is-stacked]:top-0">
            <p className="eyebrow flex items-center gap-3 text-earth">
              <span data-ia-accent aria-hidden="true" className="h-2 w-2 rounded-full bg-saffron" />
              {inAction.eyebrow}
            </p>
            <h2 id="inaction-title" className="mt-4 max-w-xl text-lg font-light leading-relaxed text-umber/75 md:text-xl">
              {inAction.intro}
            </h2>
          </div>

          <ol className="mt-16 space-y-14 group-[.is-stacked]:relative group-[.is-stacked]:mt-0 group-[.is-stacked]:flex-1 group-[.is-stacked]:space-y-0">
            {inAction.steps.map((s, i) => (
              <li
                key={s.word}
                data-step
                className="group-[.is-stacked]:absolute group-[.is-stacked]:inset-0 group-[.is-stacked]:flex group-[.is-stacked]:flex-col group-[.is-stacked]:items-center group-[.is-stacked]:justify-center group-[.is-stacked]:text-center"
              >
                <span className="eyebrow mb-4 block text-umber/45">
                  0{i + 1} / 0{inAction.steps.length}
                </span>
                <span
                  data-word
                  className="block whitespace-nowrap text-[clamp(2.2rem,9.5vw,8.5rem)] font-extralight uppercase leading-none tracking-[0.04em] text-umber"
                >
                  {s.word}
                </span>
                <span data-line className="mt-6 block max-w-xl font-serif text-xl italic text-brown/80 md:text-2xl">
                  {s.line}
                </span>
                {i < inAction.steps.length - 1 && (
                  <span aria-hidden="true" className="mt-8 block text-2xl text-terracotta group-[.is-stacked]:hidden">
                    ↓
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
