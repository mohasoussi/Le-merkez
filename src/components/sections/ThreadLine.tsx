"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/components/motion/gsap";
import { threadIcons } from "@/content/home";
import { seeded } from "@/lib/patchwork";

const W = 1200;
const BASE = 128; // hauteur du fil
const COLS = threadIcons.length;
const cx = (i: number) => ((i + 0.5) * W) / COLS;

/** Icônes tracées au trait, centrées en x = 0, posées sur le fil (y = 0 = niveau du fil). */
const icons: Record<(typeof threadIcons)[number]["id"], string[]> = {
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
  solidaires: [
    "M0 -38 C-26 -58 -12 -84 0 -70 C12 -84 26 -58 0 -38 Z",
    "M-34 -8 Q-34 16 0 16 Q34 16 34 -8",
    "M-34 -8 L-46 -14",
    "M34 -8 L46 -14",
    "M-18 2 Q0 9 18 2",
  ],
};

/** Fil principal : ondule doucement et passe par la base de chaque icône. */
function wavePath() {
  const r = seeded(17);
  let d = `M-10 ${BASE + 2}`;
  for (let i = 0; i <= COLS; i++) {
    const x1 = i === 0 ? 0 : cx(i - 1);
    const x2 = i === COLS ? W + 10 : cx(i);
    const mid = (x1 + x2) / 2;
    d += ` Q${mid} ${BASE + (i % 2 ? -9 : 9) + (r() - 0.5) * 4} ${x2} ${BASE}`;
  }
  return d;
}

/** Bord de bande de tissu cousue : haut et bas effilochés. */
function hem(seed: number, side: "top" | "bottom") {
  const r = seeded(seed);
  const pts: string[] = [];
  for (let x = 0; x <= 100; x += 1.4) pts.push(`${x.toFixed(1)}% ${(r() * 2.6 + 0.6).toFixed(2)}${"%"}`);
  const edge = pts.map((p) => p);
  return edge;
}
const topEdge = hem(2, "top");
const bottomEdge = (() => {
  const r = seeded(9);
  const pts: string[] = [];
  for (let x = 100; x >= 0; x -= 1.4) pts.push(`${x.toFixed(1)}% ${(100 - (r() * 2.6 + 0.6)).toFixed(2)}%`);
  return pts;
})();
const clip = `polygon(${[...topEdge, ...bottomEdge].join(", ")})`;

/**
 * LE FIL — une bande de lin cousue sous le hero ; un fil de jute ondule et dessine, au passage,
 * sept icônes : spiritualité, rencontre, transmission, retraite, livres, nature, actions solidaires.
 */
export default function ThreadLine() {
  const root = useRef<HTMLElement>(null);
  const path = wavePath();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MQ.desktop}, ${MQ.mobile}`, () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 80%", once: true } });
        tl.fromTo("[data-wave]", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2.6, ease: "power1.inOut" }, 0)
          .fromTo("[data-twist]", { opacity: 0 }, { opacity: 0.75, duration: 1.4, ease: "none" }, 1.6);
        threadIcons.forEach((_, i) => {
          const at = 0.25 + i * 0.3;
          tl.fromTo(`[data-icon="${i}"] [data-stroke]`, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut", stagger: 0.12 }, at)
            .fromTo(`[data-label="${i}"]`, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.9, ease: "expo.out" }, at + 0.5);
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="fil" aria-labelledby="fil-title" className="relative bg-night py-10 md:py-14">
      <h2 id="fil-title" className="sr-only">
        Les fils du Merkez : {threadIcons.map((t) => t.label).join(", ")}
      </h2>

      {/* bande de lin cousue (haut et bas effilochés) */}
      <div className="linen relative" style={{ clipPath: clip }}>
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-30 mix-blend-multiply" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .4  0 0 0 0 .3  0 0 0 0 .2  0 0 0 .8 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")" }} />
        {/* coutures du haut et du bas */}
        <span aria-hidden="true" className="stitch pointer-events-none absolute inset-x-0 top-3 text-[#a98a5c]/70" />
        <span aria-hidden="true" className="stitch pointer-events-none absolute inset-x-0 bottom-3 text-[#a98a5c]/70" />

        <div className="relative mx-auto max-w-[1240px] overflow-x-auto px-[var(--gutter)] py-12 md:overflow-visible md:py-16 [scrollbar-width:none]">
          <div className="min-w-[820px]">
            <svg viewBox={`0 0 ${W} ${BASE + 18}`} role="presentation" aria-hidden="true" className="block h-auto w-full overflow-visible">
              <defs>
                {/* bord irrégulier : le trait ressemble à un fil, pas à une ligne vectorielle */}
                <filter id="rope" x="-5%" y="-20%" width="110%" height="140%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="4" result="n" />
                  <feDisplacementMap in="SourceGraphic" in2="n" scale="3.4" xChannelSelector="R" yChannelSelector="G" />
                </filter>
              </defs>
              <g filter="url(#rope)" fill="none" strokeLinecap="round" strokeLinejoin="round">
                {/* fil de jute : trait épais + brins plus clairs torsadés */}
                <path data-wave d={path} pathLength={1} stroke="#a9885c" strokeWidth="4.6" strokeDasharray="1" />
                <path data-twist d={path} stroke="#e6d2ab" strokeWidth="1.5" strokeDasharray="2 5" opacity="0.75" />
                {threadIcons.map((t, i) => (
                  <g key={t.id} data-icon={i} transform={`translate(${cx(i)} ${BASE})`}>
                    {icons[t.id].map((d, k) => (
                      <path key={k} data-stroke d={d} pathLength={1} stroke="#a9885c" strokeWidth="3.6" strokeDasharray="1" />
                    ))}
                  </g>
                ))}
              </g>
            </svg>
            <ul className="mt-5 grid grid-cols-7 text-center">
              {threadIcons.map((t, i) => (
                <li key={t.id} data-label={i} className="px-1 text-[clamp(0.78rem,1.35vw,1.2rem)] leading-tight text-[#7d6240]">
                  {t.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p aria-hidden="true" className="eyebrow pb-5 text-center text-[0.58rem] text-[#a98a5c] md:hidden">
          Faites glisser le fil →
        </p>
      </div>
    </section>
  );
}
