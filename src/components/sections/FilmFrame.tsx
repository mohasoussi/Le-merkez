"use client";

import { useRef, useState } from "react";
import { gsap, MQ, useGSAP } from "@/components/motion/gsap";
import { film } from "@/content/home";
import { makePatches, patchStyle } from "@/lib/patchwork";

const TOP = 26;
const SIDE = 13;
const patches = makePatches(TOP * 2 + SIDE * 2, 83);
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
      mm.add(`${MQ.desktop}, ${MQ.mobile}`, () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 80%", once: true } });
        tl.from("[data-film-tile]", {
          x: () => gsap.utils.random(-120, 120),
          y: () => gsap.utils.random(-90, 90),
          rotation: () => gsap.utils.random(-80, 80),
          scale: 0.2,
          opacity: 0,
          duration: 1.5,
          ease: "expo.out",
          stagger: { each: 0.012, from: "random" },
        }).from("[data-film-box]", { scale: 0.86, opacity: 0, duration: 1.3, ease: "expo.out" }, 0.25);
      });
    },
    { scope: root },
  );

  if (!film.youtubeId) return null;

  const tile = (p: (typeof patches)[number]) => <span key={p.id} data-film-tile className="block flex-1" style={patchStyle(p)} />;

  return (
    <section ref={root} aria-label={film.title} className="relative bg-night px-[var(--gutter)] py-16 text-cream md:py-24">
      <div className="mx-auto max-w-[1180px]">
        <p className="eyebrow mb-6 flex items-center gap-4 text-saffron">
          <span aria-hidden="true" className="stitch inline-block w-10" />
          {film.eyebrow}
        </p>

        {/* Cadre en patchwork */}
        <div className="relative [--t:clamp(16px,3vw,40px)]" style={{ filter: "drop-shadow(0 30px 50px rgba(0,0,0,.55))" }}>
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

        <p className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-cream/55">
          <span>{film.caption}</span>
          <a href={film.url} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:text-cream hover:underline">
            Voir sur YouTube ↗
          </a>
        </p>
      </div>
    </section>
  );
}
