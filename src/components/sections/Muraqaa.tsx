"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/components/motion/gsap";
import SectionHeading from "@/components/ui/SectionHeading";
import { muraqaa } from "@/content/home";
import { site } from "@/content/site";
import { makePatches, patchStyle, seeded } from "@/lib/patchwork";

const COLS = 8;
const ROWS = 10;
const pieces = makePatches(COLS * ROWS, 57);
const rnd = seeded(77);
const offsets = pieces.map(() => ({ x: (rnd() - 0.5) * 60, y: (rnd() - 0.5) * 60, r: (rnd() - 0.5) * 16 }));

/**
 * LA MURAQAA — l'image semble composée de fragments qui se cousent au scroll,
 * puis le regard se pose tour à tour sur une couleur, un motif, une histoire.
 */
export default function Muraqaa() {
  const root = useRef<HTMLElement>(null);
  const img = muraqaa.image;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ desktop: MQ.desktop, mobile: MQ.mobile }, (ctx) => {
        const { desktop } = ctx.conditions as { desktop: boolean };
        const paras = gsap.utils.toArray<HTMLElement>("[data-para]");
        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: desktop
            ? { trigger: "[data-mq-stage]", start: "top top", end: "+=260%", scrub: 1, pin: true }
            : { trigger: "[data-mq-frame]", start: "top 85%", end: "center 40%", scrub: 1 },
        });

        // 1. les fragments se cousent
        tl.from("[data-piece]", {
          x: (i) => offsets[i].x,
          y: (i) => offsets[i].y,
          rotation: (i) => offsets[i].r,
          scale: 0.82,
          opacity: 0.2,
          duration: 1,
          stagger: { each: 0.006, from: "random" },
        }).from("[data-mq-grid]", { gap: desktop ? 8 : 4, duration: 1 }, 0);

        if (!desktop) return;

        // 2. zoom / parallaxe et mise en évidence de trois zones
        tl.to("[data-mq-grid]", { scale: 1.08, duration: 3, ease: "none" }, 1);
        gsap.set(paras, { opacity: 0.22 });
        muraqaa.focus.forEach((f, i) => {
          const at = 1.1 + i * 0.95;
          tl.to("[data-focus]", { left: `${f.x}%`, top: `${f.y}%`, width: `${f.w}%`, height: `${f.h}%`, opacity: 1, duration: 0.45 }, at)
            .to("[data-focus]", { boxShadow: "0 0 0 9999px rgba(20,16,12,0.55)", duration: 0.3 }, at)
            .to("[data-focus-label]", { y: -24 * i, duration: 0.4 }, at)
            .to(paras, { opacity: (j) => (j === i ? 1 : 0.22), duration: 0.35 }, at);
        });
        tl.to("[data-focus]", { left: "0%", top: "0%", width: "100%", height: "100%", duration: 0.6 }, ">+0.3")
          .to("[data-focus]", { boxShadow: "0 0 0 9999px rgba(20,16,12,0)", duration: 0.5 }, "<")
          .to(paras, { opacity: 1, duration: 0.5 }, "<")
          .to("[data-focus]", { opacity: 0, duration: 0.3 }, ">");
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="muraqaa" aria-labelledby="muraqaa-title" className="relative bg-linen text-umber">
      <div className="gutter mx-auto max-w-[1600px] pb-12 pt-28 md:pt-36 lg:pb-0">
        <SectionHeading
          id="muraqaa-title"
          eyebrow={muraqaa.eyebrow}
          title={muraqaa.title}
          titleClassName="max-w-5xl text-[clamp(2.3rem,6vw,5.8rem)]"
        />
      </div>

      <div data-mq-stage className="gutter mx-auto grid max-w-[1600px] items-center gap-12 pb-24 lg:h-[100svh] lg:grid-cols-12 lg:gap-8 lg:pb-0 lg:pt-[var(--nav-h)]">
        <figure className="lg:col-span-6 lg:col-start-1">
          <div data-mq-frame className="relative mx-auto aspect-[4/5] w-full max-w-[min(560px,72svh)] lg:max-h-[78svh]">
            <div className="absolute inset-0 overflow-hidden">
              <div
                data-mq-grid
                role="img"
                aria-label={img.src ? img.alt : `${img.alt} — ${img.placeholder}`}
                className="grid h-full w-full"
                style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)`, gap: 0 }}
              >
                {pieces.map((p, i) => {
                  const c = i % COLS;
                  const r = Math.floor(i / COLS);
                  const style = img.src
                    ? {
                        backgroundImage: `url(${img.src})`,
                        backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
                        backgroundPosition: `${(c / (COLS - 1)) * 100}% ${(r / (ROWS - 1)) * 100}%`,
                      }
                    : patchStyle(p);
                  return <div key={p.id} data-piece className="will-change-transform" style={style} />;
                })}
              </div>
              <div
                data-focus
                aria-hidden="true"
                className="pointer-events-none absolute border-2 border-cream opacity-0"
                style={{ left: "0%", top: "0%", width: "100%", height: "100%", boxShadow: "0 0 0 9999px rgba(20,16,12,0)" }}
              >
                <div className="absolute left-0 top-0 h-6 overflow-hidden bg-cream px-2">
                  <div data-focus-label>
                    {muraqaa.highlights.map((h) => (
                      <span key={h} className="eyebrow block h-6 whitespace-nowrap text-[0.6rem] leading-6 text-umber">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {!img.src && site.showPlaceholderLabels && (
              <span className="ph-label absolute -bottom-7 left-0 text-umber/60">{img.placeholder}</span>
            )}
          </div>
          <figcaption className="sr-only">{muraqaa.legend}</figcaption>
        </figure>

        <div className="lg:col-span-5 lg:col-start-8">
          <div className="space-y-7 text-[clamp(1.1rem,1.5vw,1.45rem)] leading-relaxed">
            {muraqaa.text.map((t, i) => (
              <p key={t} data-para className={i === 2 ? "text-umber/85" : "font-serif text-[1.35em] italic leading-snug text-brown"}>
                {t}
              </p>
            ))}
          </div>
          <p className="mt-10 flex items-start gap-4 border-t border-umber/15 pt-6 text-sm text-umber/70">
            <span aria-hidden="true" className="mt-1 grid h-4 w-4 shrink-0 grid-cols-2 gap-px">
              <span className="bg-madder" />
              <span className="bg-saffron" />
              <span className="bg-indigo" />
              <span className="bg-moss" />
            </span>
            {muraqaa.legend}
          </p>
        </div>
      </div>
    </section>
  );
}
