"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/components/motion/gsap";
import { vision } from "@/content/home";
import { makePatches, patchStyle, seeded } from "@/lib/patchwork";

const COLS = 7;
const ROWS = 5;
const tiles = makePatches(COLS * ROWS, 23);
const rnd = seeded(91);
const scatter = tiles.map(() => ({ x: (rnd() - 0.5) * 140, y: (rnd() - 0.5) * 120, r: (rnd() - 0.5) * 90, s: 0.4 + rnd() * 0.9 }));

/**
 * LE MERKEZ — directement le patchwork : au scroll, des fragments épars se rapprochent
 * pour former une mosaïque, et la phrase de vision s'écrit en son cœur.
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
          .from("[data-quote-word]", { yPercent: 110, opacity: 0, stagger: 0.025, duration: 0.4 }, ">-0.2")
          .to({}, { duration: desktop ? 0.4 : 0.05 });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="vision" aria-labelledby="vision-title" className="relative bg-cream text-umber">
      <h2 id="vision-title" className="sr-only">
        Le Merkez
      </h2>
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
            className="absolute left-1/2 top-1/2 w-[86%] -translate-x-1/2 -translate-y-1/2 bg-cream px-6 py-8 text-center shadow-[0_30px_80px_-20px_rgba(20,16,12,.45)] sm:w-[70%] md:px-12 md:py-14"
          >
            <p className="text-balance text-[clamp(1.05rem,2.1vw,2rem)] font-light leading-snug tracking-tight text-umber">
              {vision.statement.split(" ").map((w, i) => (
                <span key={i}>
                  <span className="line-mask inline-block align-bottom">
                    <span data-quote-word className="inline-block">
                      {w}
                    </span>
                  </span>{" "}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
