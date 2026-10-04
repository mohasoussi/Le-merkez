"use client";

import { useRef, useState } from "react";
import { gsap, MQ, setImmersive, useGSAP } from "@/components/motion/gsap";
import { film } from "@/content/home";
import { makePatches, patchStyle, seeded } from "@/lib/patchwork";

const TOP = 20;
const SIDE = 10;
const patches = makePatches(TOP * 2 + SIDE * 2, 83);

/** Bord de pièce de tissu : quatre côtés légèrement irréguliers (coupe aux ciseaux, fils qui dépassent). */
function rough(seed: number) {
  const r = seeded(seed);
  const j = (n: number) => `${(r() * n).toFixed(2)}%`;
  const k = (n: number) => `${(100 - r() * n).toFixed(2)}%`;
  const mid = () => `${(40 + r() * 20).toFixed(1)}%`;
  return `polygon(${j(1.4)} ${j(3.6)}, ${mid()} ${j(1.8)}, ${k(1.4)} ${j(3)}, ${k(1.8)} ${mid()}, ${k(1.2)} ${k(3.6)}, ${mid()} ${k(1.8)}, ${j(1.4)} ${k(3)}, ${j(1.8)} ${mid()})`;
}
const roughs = patches.map((p) => rough(p.id * 7 + 5));
const tilts = patches.map((p) => ((seeded(p.id * 3 + 1)() - 0.5) * 2.2).toFixed(2));
const stitches = ["rgba(255,244,214,.62)", "rgba(40,24,12,.45)", "rgba(255,226,170,.6)"];
const top = patches.slice(0, TOP);
const bottom = patches.slice(TOP, TOP * 2);
const left = patches.slice(TOP * 2, TOP * 2 + SIDE);
const right = patches.slice(TOP * 2 + SIDE);

/**
 * VIDÉO — un lecteur YouTube serti dans un cadre en patchwork. Les morceaux de tissu se recousent
 * autour de la vidéo à l'arrivée dans l'écran. Le lecteur ne se charge qu'au clic (rapidité, vie privée).
 */
export default function FilmFrame() {
  const root = useRef<HTMLElement>(null);
  const [playing, setPlaying] = useState(false);
  const [thumb, setThumb] = useState<string | null>(`https://i.ytimg.com/vi/${film.youtubeId}/maxresdefault.jpg`);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ desktop: MQ.desktop, mobile: MQ.mobile }, (ctx) => {
        const { desktop } = ctx.conditions as { desktop: boolean };
        const k = desktop ? 1 : 0.55;
        const rnd = seeded(31);
        const tiles = gsap.utils.toArray<HTMLElement>("[data-film-tile]");
        const scatter = tiles.map(() => ({ x: (rnd() - 0.5) * 120, y: (rnd() - 0.5) * 100, r: (rnd() - 0.5) * 150, s: 0.4 + rnd() * 0.9 }));
        const section = root.current!;
        section.classList.add("is-pinned");

        // Même effet que la mosaïque de la vision : des fragments épars se rapprochent et se cousent
        // autour de la vidéo, puis le lecteur s'ouvre au centre.
        const tl = gsap.timeline({
          // épinglée aussi sur téléphone : l'assemblage reste visible pendant que l'on fait défiler
          scrollTrigger: { trigger: section, start: "top top", end: desktop ? "+=140%" : "+=120%", scrub: 1, pin: true, onToggle: (self) => setImmersive(self.isActive) },
        });
        tl.from(tiles, {
          x: (i) => `${scatter[i].x * k}vw`,
          y: (i) => `${scatter[i].y * k}vh`,
          rotation: (i) => scatter[i].r,
          scale: (i) => scatter[i].s,
          opacity: 0.3,
          ease: "power3.inOut",
          stagger: { each: 0.012, from: "random" },
        })
          .from("[data-film-bg]", { opacity: 0, ease: "none", duration: 0.4 }, 0.6)
          .from("[data-film-box]", { clipPath: "inset(50% 50% 50% 50%)", ease: "expo.inOut", duration: 0.6 }, ">-0.2")
          .from("[data-film-text]", { opacity: 0, y: 16, stagger: 0.1, duration: 0.3 }, ">-0.3")
          .to({}, { duration: desktop ? 0.4 : 0.05 });

        return () => {
          setImmersive(false);
          section.classList.remove("is-pinned");
        };
      });
    },
    { scope: root },
  );

  if (!film.youtubeId) return null;

  // Chaque pièce : un enveloppe qui porte l'ombre (relief) + la pièce découpée, grainée et surpiquée.
  const tile = (p: (typeof patches)[number]) => (
    <span key={p.id} data-film-tile className="block flex-1" style={{ filter: "drop-shadow(0 2px 2.5px rgba(0,0,0,.55))", margin: "-1.5px" }}>
      <span
        className="fabric block h-full w-full"
        style={{ ...patchStyle(p), clipPath: roughs[p.id], rotate: `${tilts[p.id]}deg`, ["--stitch" as string]: stitches[p.id % stitches.length] }}
      />
    </span>
  );

  return (
    <section ref={root} aria-label={film.title} className="group/film relative overflow-hidden bg-night px-[var(--gutter)] py-16 text-cream md:py-24 group-[.is-pinned]/film:py-0">
      <div className="mx-auto flex max-w-[min(1180px,calc(1.6*(100svh-10rem)))] flex-col justify-center group-[.is-pinned]/film:h-[100svh] max-md:max-w-[1180px]">
        <p data-film-text className="eyebrow mb-6 flex items-center gap-4 text-saffron">
          <span aria-hidden="true" className="stitch inline-block w-10" />
          {film.eyebrow}
        </p>

        {/* Cadre en patchwork */}
        <div data-film-frame className="relative p-[3px] [--t:clamp(22px,4.6vw,60px)]" style={{ filter: "drop-shadow(0 30px 50px rgba(0,0,0,.6))" }}>
          {/* toile de fond sur laquelle les pièces se cousent */}
          <span data-film-bg aria-hidden="true" className="linen absolute inset-0" style={{ backgroundColor: "#4a3626" }} />
          <div aria-hidden="true" className="flex h-[var(--t)]">
            {top.map(tile)}
          </div>
          <div className="flex">
            <div aria-hidden="true" className="flex w-[var(--t)] flex-col">
              {left.map(tile)}
            </div>
            <div data-film-box className="relative aspect-video flex-1 overflow-hidden bg-black">
              {playing ? (
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${film.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                  title={film.title}
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              ) : (
                <button type="button" onClick={() => setPlaying(true)} aria-label={`Lire la vidéo : ${film.title}`} className="group absolute inset-0 grid place-items-center">
                  {/* Repli si la miniature est indisponible : fond en patchwork sombre */}
                  <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(135deg,#2a1d14,#14100c_60%,#283d5b)]" />
                  {thumb && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={thumb}
                      alt=""
                      loading="lazy"
                      onError={() => setThumb((t) => (t?.includes("maxresdefault") ? `https://i.ytimg.com/vi/${film.youtubeId}/hqdefault.jpg` : null))}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-[var(--ease-silk)] group-hover:scale-[1.04]"
                    />
                  )}
                  <span aria-hidden="true" className="absolute inset-0 bg-night/30 transition-colors duration-500 group-hover:bg-night/10" />
                  <span className="glass relative grid h-20 w-20 place-items-center rounded-full transition-transform duration-500 ease-[var(--ease-silk)] group-hover:scale-110 md:h-24 md:w-24">
                    <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="ml-1">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </button>
              )}
            </div>
            <div aria-hidden="true" className="flex w-[var(--t)] flex-col">
              {right.map(tile)}
            </div>
          </div>
          <div aria-hidden="true" className="flex h-[var(--t)]">
            {bottom.map(tile)}
          </div>
        </div>

        <p data-film-text className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-cream/55">
          <span>{film.caption}</span>
          <a href={film.url} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:text-cream hover:underline">
            Voir sur YouTube ↗
          </a>
        </p>
      </div>
    </section>
  );
}
