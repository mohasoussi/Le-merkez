"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/components/motion/gsap";
import RevealText from "@/components/motion/RevealText";
import SectionHeading from "@/components/ui/SectionHeading";
import { pillars, vision } from "@/content/home";
import { makePatches, patchStyle, seeded } from "@/lib/patchwork";

const COLS = 7;
const ROWS = 5;
const tiles = makePatches(COLS * ROWS, 23);
const rnd = seeded(91);
const scatter = tiles.map(() => ({ x: (rnd() - 0.5) * 140, y: (rnd() - 0.5) * 120, r: (rnd() - 0.5) * 90, s: 0.4 + rnd() * 0.9 }));

/**
 * NOTRE VISION — au scroll, des fragments épars se rapprochent pour former une mosaïque ;
 * au centre apparaît : « Différents par nos histoires. Unis par notre humanité. »
 */
export default function Vision() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ desktop: MQ.desktop, mobile: MQ.mobile }, (ctx) => {
        const { desktop } = ctx.conditions as { desktop: boolean };
        const k = desktop ? 1 : 0.55;
        const tl = gsap.timeline({
          scrollTrigger: desktop
            ? { trigger: "[data-mosaic-stage]", start: "top top", end: "+=160%", scrub: 1, pin: true }
            : { trigger: "[data-mosaic-stage]", start: "top 90%", end: "center 45%", scrub: 1 },
        });
        tl.from("[data-tile]", {
          x: (i) => `${scatter[i].x * k}vw`,
          y: (i) => `${scatter[i].y * k}vh`,
          rotation: (i) => scatter[i].r,
          scale: (i) => scatter[i].s,
          opacity: 0.35,
          ease: "power3.inOut",
          stagger: { each: 0.012, from: "random" },
        })
          .from("[data-mosaic]", { gap: desktop ? 26 : 10, ease: "power2.inOut" }, 0)
          .from("[data-quote-card]", { clipPath: "inset(50% 50% 50% 50%)", ease: "expo.inOut", duration: 0.5 }, ">-0.15")
          .from("[data-quote-line]", { yPercent: 110, opacity: 0, stagger: 0.12, duration: 0.4 }, ">-0.2")
          .from("[data-pillars] > *", { opacity: 0, y: 12, stagger: 0.05, duration: 0.3 }, ">-0.1")
          .to({}, { duration: desktop ? 0.4 : 0.05 });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="vision" aria-labelledby="vision-title" className="relative bg-cream text-umber">
      <div className="gutter mx-auto max-w-[1600px] pb-16 pt-28 md:pb-24 md:pt-40">
        <SectionHeading
          id="vision-title"
          eyebrow={vision.eyebrow}
          title={vision.title}
          titleClassName="max-w-5xl text-[clamp(2.4rem,6.4vw,6.2rem)]"
        />
        <div className="mt-14 grid gap-10 md:mt-20 md:grid-cols-12">
          <div className="space-y-6 text-[clamp(1.05rem,1.35vw,1.3rem)] leading-relaxed text-umber/85 md:col-span-6 md:col-start-2">
            {vision.paragraphs.map((p) => (
              <RevealText key={p}>{p}</RevealText>
            ))}
          </div>
          <div className="md:col-span-4 md:col-start-9 md:pt-2">
            <span aria-hidden="true" className="stitch mb-6 block w-16 text-madder" />
            {vision.emphasis.map((e) => (
              <RevealText key={e} className="font-serif text-[clamp(1.5rem,2.2vw,2.1rem)] italic leading-snug text-brown">
                {e}
              </RevealText>
            ))}
          </div>
        </div>
      </div>

      <div data-mosaic-stage className="relative flex min-h-[90svh] items-center justify-center overflow-hidden py-16 lg:h-[100svh] lg:py-0">
        <div className="relative w-[min(88vw,980px)]">
          <div
            data-mosaic
            aria-hidden="true"
            className="grid aspect-[7/5] w-full"
            style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: 3 }}
          >
            {tiles.map((p) => (
              <div key={p.id} data-tile className="will-change-transform" style={patchStyle(p)} />
            ))}
          </div>
          <div
            data-quote-card
            className="absolute left-1/2 top-1/2 w-[86%] -translate-x-1/2 -translate-y-1/2 bg-cream px-6 py-8 text-center shadow-[0_30px_80px_-20px_rgba(20,16,12,.45)] sm:w-[62%] md:px-10 md:py-12"
          >
            <p className="text-[clamp(1.1rem,2.5vw,2.4rem)] font-light leading-tight tracking-tight text-umber">
              {vision.centerQuote.map((l) => (
                <span key={l} className="line-mask block">
                  <span data-quote-line className="block">
                    {l}
                  </span>
                </span>
              ))}
            </p>
            <ul data-pillars className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[0.6rem] font-semibold uppercase tracking-[0.24em] text-earth md:text-[0.65rem]">
              {pillars.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
