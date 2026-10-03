"use client";

import { useRef } from "react";
import { gsap, MQ, SplitText, useGSAP } from "@/components/motion/gsap";
import { inAction } from "@/content/home";

const tints = ["#14100c", "#1a1720", "#161a15", "#1f1410", "#1c160c"];
const accents = ["#c99a3e", "#b88676", "#77753f", "#b4613a", "#d8c3a0"];

/**
 * LE MERKEZ EN ACTION — Rencontrer ↓ Échanger ↓ Transmettre ↓ Servir ↓ Construire.
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
          tl.to("[data-ia-bg]", { backgroundColor: tints[i], duration: 0.6, ease: "none" }, at)
            .to("[data-ia-fill]", { scaleY: (i + 1) / steps.length, duration: 0.6, ease: "none" }, at)
            .to(`[data-dot="${i}"]`, { backgroundColor: accents[i], scale: 1.6, duration: 0.3 }, at)
            .to("[data-arrow]", { color: accents[i], duration: 0.3 }, at);
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
    <section ref={root} aria-labelledby="inaction-title" className="group relative text-cream">
      <div data-ia-stage data-ia-bg className="grain relative overflow-hidden bg-night group-[.is-stacked]:h-[100svh]">
        <div className="gutter relative z-[2] mx-auto flex h-full max-w-[1600px] flex-col py-28 group-[.is-stacked]:py-0">
          <div className="pt-[calc(var(--nav-h)+1.5rem)] group-[.is-stacked]:absolute group-[.is-stacked]:inset-x-[var(--gutter)] group-[.is-stacked]:top-0">
            <p className="eyebrow text-saffron">{inAction.eyebrow}</p>
            <h2 id="inaction-title" className="mt-4 max-w-xl text-lg font-light leading-relaxed text-cream/75 md:text-xl">
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
                <span className="eyebrow mb-4 block text-cream/45">
                  0{i + 1} / 0{inAction.steps.length}
                </span>
                <span
                  data-word
                  className="block whitespace-nowrap text-[clamp(2.2rem,9.5vw,8.5rem)] font-extralight uppercase leading-none tracking-[0.04em]"
                >
                  {s.word}
                </span>
                <span data-line className="mt-6 block max-w-xl font-serif text-xl italic text-cream/75 md:text-2xl">
                  {s.line}
                </span>
                {i < inAction.steps.length - 1 && (
                  <span aria-hidden="true" className="mt-8 block text-2xl text-saffron group-[.is-stacked]:hidden">
                    ↓
                  </span>
                )}
              </li>
            ))}
          </ol>

          {/* Fil de progression vertical */}
          <div aria-hidden="true" className="absolute bottom-[12svh] right-[var(--gutter)] top-[24svh] hidden w-6 flex-col items-center group-[.is-stacked]:flex">
            <div className="relative w-px flex-1 bg-cream/15">
              <div data-ia-fill className="absolute inset-0 origin-top scale-y-0 bg-cream/60" />
              <div className="absolute inset-0 flex flex-col justify-between">
                {inAction.steps.map((s, i) => (
                  <span key={s.word} data-dot={i} className="-ml-[3px] block h-[7px] w-[7px] rounded-full bg-cream/30" />
                ))}
              </div>
            </div>
            <span data-arrow className="mt-4 text-lg text-saffron">
              ↓
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
