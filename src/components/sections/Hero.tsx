"use client";

import { useRef, type CSSProperties } from "react";
import { gsap, MQ, SplitText, useGSAP } from "@/components/motion/gsap";
import Button from "@/components/ui/Button";
import { emblemColors } from "@/components/ui/Emblem";
import PatchField from "@/components/ui/PatchField";
import { hero, verse } from "@/content/home";
import { site } from "@/content/site";
import { makePatches, patchStyle } from "@/lib/patchwork";
import { textile } from "@/lib/palette";

const core = makePatches(9, 11).map((p, i) => ({ ...p, color: emblemColors[i], pattern: i === 4 ? ("plain" as const) : p.pattern }));
const shards = makePatches(18, 29);
const glows = [
  { c: textile.madder, x: "12%", y: "22%", s: "48vmax", d: "22s" },
  { c: textile.indigo, x: "82%", y: "18%", s: "52vmax", d: "26s" },
  { c: textile.saffron, x: "70%", y: "86%", s: "42vmax", d: "20s" },
  { c: textile.moss, x: "18%", y: "82%", s: "46vmax", d: "24s" },
  { c: textile.terracotta, x: "50%", y: "50%", s: "36vmax", d: "30s" },
];

/**
 * HERO — diversité → rencontre → unité.
 * Des fragments de tissu dispersés dérivent lentement, se rapprochent puis se cousent
 * en un seul emblème ; « Le Merkez » apparaît alors au centre.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add({ desktop: MQ.desktop, mobile: MQ.mobile }, (ctx) => {
        const { desktop } = ctx.conditions as { desktop: boolean };
        const spreadX = desktop ? 46 : 42;
        const spreadY = desktop ? 40 : 34;
        const pieces = gsap.utils.toArray<HTMLElement>("[data-core], [data-shard]");
        const vw = window.innerWidth / 100;
        const vh = window.innerHeight / 100;

        const scatter = pieces.map(() => ({
          x: gsap.utils.random(-spreadX, spreadX) * vw,
          y: gsap.utils.random(-spreadY, spreadY) * vh,
          r: gsap.utils.random(-50, 50),
          s: gsap.utils.random(desktop ? 1.4 : 1.1, desktop ? 3.2 : 2),
        }));

        const title = root.current!.querySelector<HTMLElement>("[data-title]")!;
        const split = SplitText.create(title, { type: "chars", mask: "chars" });
        const verseSplit = SplitText.create(root.current!.querySelector<HTMLElement>("[data-verse]")!, { type: "words" });

        gsap.set(pieces, {
          x: (i) => scatter[i].x,
          y: (i) => scatter[i].y,
          rotation: (i) => scatter[i].r,
          scale: (i) => scatter[i].s,
          opacity: 0,
        });

        const tl = gsap.timeline({ delay: 0.15, defaults: { ease: "expo.out" } });
        tl.set("[data-hero-hide]", { opacity: 1 })
          // 1. la diversité : des fragments épars apparaissent
          .to(pieces, { opacity: 1, duration: 1.2, ease: "power2.out", stagger: { each: 0.04, from: "random" } }, 0)
          // 2. ils dérivent lentement et se rapprochent
          .to(
            pieces,
            {
              x: (i) => scatter[i].x * 0.38,
              y: (i) => scatter[i].y * 0.38,
              rotation: (i) => scatter[i].r * 0.4,
              scale: (i) => 1 + (scatter[i].s - 1) * 0.4,
              duration: 1.8,
              ease: "sine.inOut",
              stagger: { each: 0.02, from: "random" },
            },
            0.2,
          )
          // 3. la rencontre : ils s'assemblent
          .to(
            "[data-core]",
            { x: 0, y: 0, rotation: 0, scale: 1, duration: 1.3, ease: "expo.inOut", stagger: { each: 0.035, from: "center" } },
            1.85,
          )
          .to(
            "[data-shard]",
            { x: 0, y: 0, rotation: 0, scale: 0.2, opacity: 0, duration: 1.2, ease: "expo.inOut", stagger: { each: 0.02, from: "random" } },
            1.8,
          )
          // 4. l'unité : l'emblème respire, une couture se trace
          .fromTo("[data-emblem]", { scale: 1.12 }, { scale: 1, duration: 1.4, ease: "elastic.out(1, 0.6)" }, 3.05)
          .from("[data-seam]", { scaleX: 0, duration: 1.6, ease: "expo.inOut" }, 3.0)
          .from(split.chars, { yPercent: 115, duration: 1.4, stagger: 0.06 }, 3.15)
          .from(title, { letterSpacing: "0.65em", duration: 2.4, ease: "expo.out" }, 3.15)
          .from(verseSplit.words, { opacity: 0, y: 14, filter: "blur(8px)", duration: 1.2, stagger: 0.035, ease: "power2.out" }, 3.9)
          .from("[data-arabic]", { opacity: 0, y: 10, duration: 1.4, ease: "power2.out" }, 4.5)
          .from("[data-tag]", { opacity: 0, yPercent: 60, duration: 1, stagger: 0.14 }, 4.7)
          .from("[data-cta] > *", { opacity: 0, y: 24, duration: 1.1, stagger: 0.12 }, 5.1)
          .from("[data-cue]", { opacity: 0, duration: 1 }, 5.5)
          .from("[data-glow]", { opacity: 0, duration: 3, ease: "power1.out" }, 0);

        // En quittant le hero : les fragments se décousent légèrement, le texte s'éloigne.
        const out = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.8 },
        });
        out
          .to("[data-content]", { yPercent: -18, opacity: 0, ease: "none" }, 0)
          .to("[data-emblem-wrap]", { scale: desktop ? 2.2 : 1.6, yPercent: -40, ease: "none" }, 0)
          .to("[data-core-wrap]", { x: (i) => ((i % 3) - 1) * 14, y: (i) => (Math.floor(i / 3) - 1) * 14, rotation: (i) => (i - 4) * 3, ease: "none" }, 0)
          .to("[data-backdrop]", { scale: 1.15, opacity: 0.4, ease: "none" }, 0);

        return () => {
          split.revert();
          verseSplit.revert();
        };
      });

      mm.add(MQ.reduce, () => {
        gsap.set("[data-hero-hide]", { opacity: 1 });
        gsap.set("[data-shard]", { opacity: 0 });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="top"
      aria-labelledby="hero-title"
      className="grain relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden bg-night text-cream"
    >
      {/* Fond : vidéo si fournie, sinon composition textile animée */}
      <div data-backdrop className="absolute inset-0 -z-10">
        {hero.video.src ? (
          <>
            <video
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={hero.video.poster ?? undefined}
              aria-hidden="true"
            >
              {hero.video.srcWebm && <source src={hero.video.srcWebm} type="video/webm" />}
              <source src={hero.video.src} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-night/60" />
          </>
        ) : (
          <>
            {glows.map((g, i) => (
              <div
                key={i}
                data-glow
                aria-hidden="true"
                className={`animate-drift absolute rounded-full opacity-45 ${i > 2 ? "max-md:hidden" : ""}`}
                style={
                  {
                    left: g.x,
                    top: g.y,
                    width: g.s,
                    height: g.s,
                    marginLeft: `calc(${g.s} / -2)`,
                    marginTop: `calc(${g.s} / -2)`,
                    background: `radial-gradient(circle, ${g.c} 0%, transparent 68%)`,
                    "--dur": g.d,
                    "--dx": `${(i % 2 ? -1 : 1) * 40}px`,
                    "--dy": `${(i % 3) * 20 - 20}px`,
                  } as CSSProperties
                }
              />
            ))}
            <div
              aria-hidden="true"
              className="absolute -inset-[10%] rotate-[-8deg] opacity-[0.07]"
              style={{ maskImage: "radial-gradient(ellipse at center, black 10%, transparent 65%)", WebkitMaskImage: "radial-gradient(ellipse at center, black 10%, transparent 65%)" }}
            >
              <PatchField cols={14} rows={9} seed={17} gap={3} />
            </div>
            {site.showPlaceholderLabels && (
              <span className="ph-label absolute bottom-6 left-[var(--gutter)] z-[2] text-cream/40 max-md:hidden">{hero.video.placeholder}</span>
            )}
          </>
        )}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(20,16,12,.85)_100%)]" />
      </div>

      <div data-hero-hide className="gutter relative z-[2] flex w-full flex-col items-center pb-28 pt-[calc(var(--nav-h)+1.5rem)] text-center">
        {/* Fragments + emblème */}
        <div className="relative mb-8 grid place-items-center md:mb-10" style={{ "--em": "clamp(58px, 7vw, 96px)" } as CSSProperties}>
          <div aria-hidden="true" className="absolute left-1/2 top-1/2 h-0 w-0">
            {shards.map((p, i) => (
              <span
                key={p.id}
                data-shard
                className={`absolute -left-[calc(var(--em)/6)] -top-[calc(var(--em)/6)] block h-[calc(var(--em)/3)] w-[calc(var(--em)/3)] opacity-0 ${i > 9 ? "max-md:hidden" : ""}`}
                style={patchStyle(p)}
              />
            ))}
          </div>
          <div data-emblem-wrap aria-hidden="true">
            <div data-emblem className="relative grid h-[var(--em)] w-[var(--em)] grid-cols-3 gap-[2px]">
              {core.map((p) => (
                <span key={p.id} data-core-wrap className="block">
                  <span data-core className="block h-full w-full shadow-[0_8px_30px_rgba(0,0,0,.35)]" style={patchStyle(p)} />
                </span>
              ))}
            </div>
          </div>
        </div>

        <div data-content className="flex flex-col items-center">
          <h1
            id="hero-title"
            data-title
            className="pl-[0.3em] text-[clamp(2.4rem,9vw,7.6rem)] font-extralight uppercase leading-none tracking-[0.3em]"
          >
            {hero.title}
          </h1>
          <span data-seam aria-hidden="true" className="stitch mt-7 block w-[min(420px,70vw)] text-saffron/70" />

          <blockquote className="mt-7 max-w-3xl">
            <p data-verse className="font-serif text-[clamp(1.25rem,2.4vw,2rem)] font-light italic leading-snug text-cream/90">
              « {verse.short} »
            </p>
            <footer className="mt-4 flex flex-col items-center gap-2">
              <span data-arabic lang="ar" dir="rtl" className="font-arabic text-lg text-saffron/90 md:text-xl">
                {verse.ar}
              </span>
              <cite data-arabic className="eyebrow not-italic text-cream/45">
                {verse.reference}
              </cite>
            </footer>
          </blockquote>

          <p className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-1 text-[0.72rem] font-medium uppercase tracking-[0.28em] text-cream/85 md:text-xs">
            {hero.tagline.map((t) => (
              <span key={t} data-tag className="inline-block">
                {t}
              </span>
            ))}
          </p>

          <div data-cta className="mt-9 flex flex-col items-center gap-4 sm:flex-row">
            <Button href={hero.primaryCta.href} variant="glass">
              {hero.primaryCta.label}
            </Button>
            <Button href={hero.secondaryCta.href} variant="solid">
              {hero.secondaryCta.label}
            </Button>
          </div>
        </div>
      </div>

      <a
        href="#vision"
        data-hero-hide
        aria-label="Faire défiler vers la vision"
        className="absolute bottom-6 left-1/2 z-[2] flex -translate-x-1/2 flex-col items-center gap-3 text-cream/60"
      >
        <span data-cue className="flex flex-col items-center gap-3">
          <span className="eyebrow text-[0.6rem]">Défiler</span>
          <span className="relative block h-12 w-px overflow-hidden bg-cream/15">
            <span className="animate-scroll-cue absolute inset-0 bg-saffron" />
          </span>
        </span>
      </a>
    </section>
  );
}
