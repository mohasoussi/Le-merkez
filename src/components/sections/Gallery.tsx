"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/components/motion/gsap";
import Photo from "@/components/ui/Photo";
import SectionHeading from "@/components/ui/SectionHeading";
import { gallery, galleryIntro, type GalleryFormat } from "@/content/gallery";
import { site } from "@/content/site";
import { makePatches, patchStyle, seeded } from "@/lib/patchwork";

const MC = 6;
const MR = 4;
const mosaic = makePatches(MC * MR, 63);
const rnd = seeded(5);
const mOffsets = mosaic.map(() => ({ x: (rnd() - 0.5) * 40, y: (rnd() - 0.5) * 50, r: (rnd() - 0.5) * 14, h: Math.round((rnd() - 0.5) * 120) }));

/** Placement éditorial de chaque format sur la grille 12 colonnes (desktop). */
const placement: Record<GalleryFormat, string[]> = {
  portrait: ["lg:col-start-1 lg:col-span-4", "lg:col-start-9 lg:col-span-4 lg:mt-[16vh]", "lg:col-start-2 lg:col-span-4"],
  landscape: ["lg:col-start-6 lg:col-span-7 lg:mt-[22vh]", "lg:col-start-1 lg:col-span-7"],
  square: ["lg:col-start-4 lg:col-span-4 lg:-mt-[14vh]", "lg:col-start-7 lg:col-span-5 lg:mt-[24vh]"],
  full: ["lg:col-span-12"],
};
const aspect: Record<GalleryFormat, string> = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[3/2]",
  square: "aspect-square",
  full: "aspect-[4/3] lg:aspect-auto lg:h-[88svh]",
};
const reveals = ["inset(100% 0% 0% 0%)", "inset(0% 0% 0% 100%)", "inset(0% 100% 0% 0%)", "inset(0% 0% 100% 0%)"];

export default function Gallery() {
  const root = useRef<HTMLElement>(null);
  const counters: Record<string, number> = {};
  const items = gallery.map((g) => {
    const n = (counters[g.format] = (counters[g.format] ?? -1) + 1);
    const slots = placement[g.format];
    return { ...g, place: slots[n % slots.length] };
  });
  const mImg = galleryIntro.mosaicImage;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ desktop: MQ.desktop, mobile: MQ.mobile }, (ctx) => {
        const { desktop } = ctx.conditions as { desktop: boolean };

        // Animation 6 — une mosaïque de personnes différentes forme une seule image.
        gsap
          .timeline({
            scrollTrigger: desktop
              ? { trigger: "[data-mosaic-pin]", start: "top top", end: "+=130%", scrub: 1, pin: true }
              : { trigger: "[data-mosaic-pin]", start: "top 80%", end: "bottom 60%", scrub: 1 },
          })
          .fromTo(
            "[data-m-tile]",
            {
              x: (i) => mOffsets[i].x * (desktop ? 1 : 0.5),
              y: (i) => mOffsets[i].y * (desktop ? 1 : 0.5),
              rotation: (i) => mOffsets[i].r,
              filter: (i) => `hue-rotate(${mOffsets[i].h}deg) saturate(0.7)`,
              scale: 0.78,
            },
            {
              x: 0,
              y: 0,
              rotation: 0,
              filter: "hue-rotate(0deg) saturate(1)",
              scale: 1,
              ease: "power3.inOut",
              stagger: { each: 0.015, from: "random" },
            },
          )
          .from("[data-m-grid]", { gap: desktop ? 18 : 8, ease: "power3.inOut" }, 0)
          .from("[data-m-unify]", { opacity: 0, ease: "none", duration: 0.4 }, ">-0.2")
          .from("[data-m-caption]", { opacity: 0, y: 20, duration: 0.3 }, "<");

        // Animation 5 — les photographies sortent de leurs cadres.
        gsap.utils.toArray<HTMLElement>("[data-g-item]").forEach((item, i) => {
          const frame = item.querySelector("[data-g-frame]");
          const inner = item.querySelector("[data-g-inner]");
          const outline = item.querySelector("[data-g-outline]");
          gsap.from(frame, {
            clipPath: reveals[i % reveals.length],
            duration: 1.6,
            ease: "expo.inOut",
            scrollTrigger: { trigger: item, start: "top 88%", once: true },
          });
          gsap.fromTo(
            inner,
            { scale: 1.35, yPercent: desktop ? -8 : -4 },
            { scale: 1.08, yPercent: desktop ? 8 : 4, ease: "none", scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: true } },
          );
          if (outline && desktop) {
            gsap.fromTo(outline, { y: 50 }, { y: -50, ease: "none", scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: true } });
          }
          const speed = Number(item.dataset.speed ?? 0);
          if (speed && desktop) {
            gsap.to(item, { yPercent: -speed, ease: "none", scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: true } });
          }
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="galerie" aria-labelledby="gallery-title" className="relative bg-cream text-umber">
      <div className="gutter mx-auto max-w-[1600px] pt-28 md:pt-40">
        <SectionHeading id="gallery-title" eyebrow={galleryIntro.eyebrow} title={galleryIntro.title} titleClassName="text-[clamp(2.3rem,6vw,5.8rem)]" />
      </div>

      {/* Mosaïque de personnes */}
      <div data-mosaic-pin className="relative flex items-center justify-center py-16 lg:h-[100svh] lg:py-0">
        <figure className="w-[min(90vw,1100px)]">
          <div className="relative">
            <div
              data-m-grid
              role="img"
              aria-label={mImg.src ? mImg.alt : `${mImg.alt} — ${mImg.placeholder}`}
              className="grid aspect-[3/2] w-full"
              style={{ gridTemplateColumns: `repeat(${MC}, 1fr)`, gap: 0 }}
            >
              {mosaic.map((p, i) => {
                const c = i % MC;
                const r = Math.floor(i / MC);
                return (
                  <div
                    key={p.id}
                    data-m-tile
                    className="will-change-transform"
                    style={
                      mImg.src
                        ? {
                            backgroundImage: `url(${mImg.src})`,
                            backgroundSize: `${MC * 100}% ${MR * 100}%`,
                            backgroundPosition: `${(c / (MC - 1)) * 100}% ${(r / (MR - 1)) * 100}%`,
                          }
                        : patchStyle(p)
                    }
                  />
                );
              })}
            </div>
            {!mImg.src && (
              <div
                data-m-unify
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(244,236,221,.35),rgba(20,16,12,.35))]"
              />
            )}
          </div>
          <figcaption data-m-caption className="mt-5 flex flex-wrap items-baseline justify-between gap-3">
            <span className="font-serif text-xl italic text-brown md:text-2xl">{galleryIntro.mosaicCaption}</span>
            {!mImg.src && site.showPlaceholderLabels && <span className="ph-label text-umber/55">{mImg.placeholder}</span>}
          </figcaption>
        </figure>
      </div>

      {/* Composition éditoriale */}
      <div className="gutter mx-auto grid max-w-[1600px] gap-y-14 pb-32 pt-10 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-[14vh]">
        {items.map((g, i) => (
          <figure
            key={`${g.category}-${i}`}
            data-g-item
            data-speed={g.format === "full" ? 0 : [12, 24, 8, 18][i % 4]}
            className={`relative ${g.format === "full" ? "-mx-[var(--gutter)] sm:col-span-2 lg:mx-[calc(var(--gutter)*-1)]" : ""} ${g.place}`}
          >
            {g.format !== "full" && (
              <span data-g-outline aria-hidden="true" className="absolute -inset-3 -z-0 hidden border border-umber/20 lg:block" style={{ translate: `${i % 2 ? 18 : -18}px 22px` }} />
            )}
            <div data-g-frame className={`relative overflow-hidden ${aspect[g.format]}`}>
              <div data-g-inner className="absolute inset-0">
                <Photo
                  media={g}
                  seed={i * 11 + 2}
                  sizes={g.format === "full" ? "100vw" : "(min-width:1024px) 45vw, (min-width:640px) 50vw, 100vw"}
                  className="h-full w-full"
                />
              </div>
            </div>
            <figcaption className={`mt-4 flex items-center gap-3 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-umber/60 ${g.format === "full" ? "gutter" : ""}`}>
              <span className="text-madder">{String(i + 1).padStart(2, "0")}</span>
              <span aria-hidden="true" className="stitch inline-block w-6" />
              {g.category}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
