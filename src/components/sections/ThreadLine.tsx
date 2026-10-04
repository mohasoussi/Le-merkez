"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/components/motion/gsap";
import { threadIcons } from "@/content/home";
import { seeded } from "@/lib/patchwork";

type IconId = (typeof threadIcons)[number]["id"];

/** Icônes tracées au trait, centrées en x = 0, posées sur le fil (y = 0 = niveau du fil). */
const icons: Record<IconId, string[]> = {
  spiritualite: ["M-24 0 V-42 Q-24 -66 0 -70 Q24 -66 24 -42 V0", "M0 -30 l6 7 l-6 7 l-6 -7 z"],
  rencontre: [
    "M-14 -57 m-9 0 a9 9 0 1 0 18 0 a9 9 0 1 0 -18 0",
    "M14 -57 m-9 0 a9 9 0 1 0 18 0 a9 9 0 1 0 -18 0",
    "M-30 0 V-24 Q-30 -40 -14 -40 Q-2 -40 -2 -28 V0",
    "M2 0 V-28 Q2 -40 14 -40 Q30 -40 30 -24 V0",
    "M-8 -24 Q0 -16 8 -24",
  ],
  transmission: ["M0 0 V-34", "M0 -34 C-6 -58 -38 -56 -40 -42 C-34 -28 -8 -30 0 -34", "M0 -44 C8 -68 38 -64 38 -50 C32 -36 8 -38 0 -44"],
  retraite: ["M-36 -28 A36 36 0 0 1 36 -28", "M-44 -28 H44", "M-26 -14 Q-13 -6 0 -14 T26 -14", "M-14 -2 Q0 6 14 -2"],
  livres: ["M0 -10 C-12 -20 -30 -22 -46 -16 V-64 C-30 -70 -12 -68 0 -58 Z", "M0 -10 C12 -20 30 -22 46 -16 V-64 C30 -70 12 -68 0 -58 Z"],
  nature: [
    "M0 0 V-70",
    "M0 -18 Q-16 -22 -20 -36 Q-6 -34 0 -18",
    "M0 -18 Q16 -22 20 -36 Q6 -34 0 -18",
    "M0 -38 Q-16 -42 -20 -56 Q-6 -54 0 -38",
    "M0 -38 Q16 -42 20 -56 Q6 -54 0 -38",
    "M0 -70 Q-7 -80 0 -88 Q7 -80 0 -70",
  ],
  solidaires: ["M0 -38 C-26 -58 -12 -84 0 -70 C12 -84 26 -58 0 -38 Z", "M-34 -8 Q-34 16 0 16 Q34 16 34 -8", "M-34 -8 L-46 -14", "M34 -8 L46 -14", "M-18 2 Q0 9 18 2"],
};

const THREAD = "#f0dfba"; // fil de jute clair (lisible sur les photos du hero)
const TWIST = "#fffaf0";

/** Fil principal : une longue ondulation douce qui traverse tout l'écran (gauche → droite). */
function wavePath() {
  const r = seeded(17);
  const base = 92;
  let d = `M-20 ${base + 3}`;
  const n = 14;
  for (let i = 1; i <= n; i++) {
    const x = (1240 * i) / n - 20;
    const prev = (1240 * (i - 0.5)) / n - 20;
    d += ` Q${prev} ${base + (i % 2 ? -6 : 6) + (r() - 0.5) * 3} ${x} ${base + (r() - 0.5) * 2}`;
  }
  return d;
}
const WAVE = wavePath();

/**
 * LE FIL — en haut du hero, juste sous la barre de navigation : un fil de jute traverse l'écran de gauche
 * à droite et dessine sept icônes (spiritualité, rencontre, transmission, retraite, livres, nature,
 * actions solidaires). Sans fond ; s'adapte à la largeur (ordinateur comme téléphone).
 */
export default function ThreadLine() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MQ.desktop}, ${MQ.mobile}`, () => {
        const tl = gsap.timeline({ delay: 0.9 });
        tl.fromTo("[data-wave]", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2.8, ease: "power1.inOut" }, 0).fromTo(
          "[data-twist]",
          { opacity: 0 },
          { opacity: 0.8, duration: 1.4, ease: "none" },
          1.8,
        );
        threadIcons.forEach((_, i) => {
          const at = 0.35 + i * 0.32;
          tl.fromTo(`[data-icon="${i}"] [data-stroke]`, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut", stagger: 0.1 }, at).fromTo(
            `[data-label="${i}"]`,
            { opacity: 0, y: 8 },
            { opacity: 1, y: 0, duration: 0.9, ease: "expo.out" },
            at + 0.5,
          );
        });
        // le fil s'efface quand le hero s'éloigne
        gsap.to(root.current, { opacity: 0, ease: "none", scrollTrigger: { trigger: root.current, start: "top top+=20", end: "+=240", scrub: true } });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} data-thread-root className="pointer-events-none absolute inset-x-0 top-[calc(var(--nav-h)+0.25rem)] z-[3] [--h:clamp(40px,5.4vw,78px)]" aria-label={`Les fils du Merkez : ${threadIcons.map((t) => t.label).join(", ")}`} role="img">
      {/* grain de jute : filtre partagé par tous les tracés */}
      <svg width="0" height="0" aria-hidden="true" className="absolute">
        <defs>
          <filter id="rope" x="-5%" y="-20%" width="110%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="4" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="3.2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <div className="relative [filter:drop-shadow(0_2px_6px_rgba(10,8,6,.55))]">
        {/* le fil : toute la largeur de l'écran */}
        <svg viewBox="0 0 1200 112" preserveAspectRatio="none" aria-hidden="true" className="absolute inset-x-0 top-0 block h-[var(--h)] w-full overflow-visible">
          <g filter="url(#rope)" fill="none" strokeLinecap="round">
            <path data-wave d={WAVE} pathLength={1} stroke={THREAD} strokeWidth="5" strokeDasharray="1" />
            <path data-twist d={WAVE} stroke={TWIST} strokeWidth="1.6" strokeDasharray="2 6" opacity="0.8" />
          </g>
        </svg>

        {/* icônes + libellés : 7 colonnes égales, centrées sur la largeur (au plus 1000 px) */}
        <ul className="relative mx-auto grid max-w-[1000px] grid-cols-7 px-1">
          {threadIcons.map((t, i) => (
            <li key={t.id} className="flex flex-col items-center">
              <svg viewBox="-52 -92 104 112" aria-hidden="true" data-icon={i} className="block h-[var(--h)] w-auto overflow-visible">
                <g filter="url(#rope)" fill="none" strokeLinecap="round" strokeLinejoin="round" stroke={THREAD} strokeWidth="4.8">
                  {icons[t.id].map((d, k) => (
                    <path key={k} data-stroke d={d} pathLength={1} strokeDasharray="1" />
                  ))}
                </g>
              </svg>
              <span data-label={i} className="mt-1 text-center text-[clamp(0.48rem,1.25vw,1.05rem)] font-light leading-[1.1] tracking-[-0.02em] sm:tracking-[0.01em] text-cream/90 [text-shadow:0_1px_8px_rgba(10,8,6,.8)]">
                {t.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
