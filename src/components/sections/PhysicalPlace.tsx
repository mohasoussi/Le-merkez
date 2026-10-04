"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap, MQ, useGSAP } from "@/components/motion/gsap";
import RevealText from "@/components/motion/RevealText";
import SectionHeading from "@/components/ui/SectionHeading";
import { place } from "@/content/place";

const O = 30; // marge
const C = 180; // taille d'une case
const cells = [0, 1, 2, 3, 5, 6, 7, 8]; // 3×3 sans le centre (4)
const patterns = ["stripes", "dots", "diag", "check", "stripes", "diag", "dots", "check"];

/** Petite arcade (série d'arcs) le long d'un côté de la cour. */
function arcade(x: number, y: number, w: number, n: number) {
  const step = w / n;
  let d = "";
  for (let i = 0; i < n; i++) {
    const sx = x + i * step;
    d += `M${sx + 4} ${y} L${sx + 4} ${y - 10} A${step / 2 - 4} ${step / 2 - 4} 0 0 1 ${sx + step - 4} ${y - 10} L${sx + step - 4} ${y} `;
  }
  return d;
}

/**
 * UN LIEU POUR SE RENCONTRER — plan conceptuel : huit espaces cousus autour d'un centre,
 * comme les carrés d'une muraqaa. Le tracé se dessine au scroll puis chaque espace se colore.
 */
export default function PhysicalPlace() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ desktop: MQ.desktop, mobile: MQ.mobile }, (ctx) => {
        const { desktop } = ctx.conditions as { desktop: boolean };
        const tl = gsap.timeline({
          scrollTrigger: desktop
            ? { trigger: "[data-place-stage]", start: "top top", end: "+=180%", scrub: 1, pin: true }
            : { trigger: "[data-plan]", start: "top 80%", end: "bottom 50%", scrub: 1 },
        });
        tl.fromTo("[data-draw]", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1, ease: "power1.inOut", stagger: 0.04 })
          .from("[data-room]", { opacity: 0, scale: 0.6, transformOrigin: "50% 50%", duration: 0.5, ease: "back.out(1.4)", stagger: { each: 0.12, from: "random" } }, 0.7)
          .from("[data-room-num]", { opacity: 0, duration: 0.3, stagger: 0.06 }, ">-0.4")
          .from("[data-core-glow]", { opacity: 0, scale: 0.4, transformOrigin: "50% 50%", duration: 0.6, ease: "expo.out" }, ">-0.1")
          .from("[data-space]", { opacity: 0, x: 24, duration: 0.3, stagger: 0.05 }, desktop ? 0.9 : 0.6)
          .to({}, { duration: 0.4 });
        gsap.utils.toArray<HTMLElement>("[data-maq]").forEach((el, i) => {
          gsap.from(el, {
            clipPath: i % 2 ? "inset(0% 0% 100% 0%)" : "inset(100% 0% 0% 0%)",
            duration: 1.6,
            ease: "expo.inOut",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
          gsap.fromTo(el.querySelector("img"), { scale: 1.2 }, { scale: 1.02, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="lieu" aria-labelledby="place-title" className="grain relative overflow-hidden bg-night text-cream">
      <div className="gutter mx-auto max-w-[1600px] pt-28 md:pt-40">
        <SectionHeading
          id="place-title"
          eyebrow={place.eyebrow}
          title={place.title}
          className="[&_.eyebrow]:text-saffron"
          titleClassName="text-[clamp(2.4rem,6.4vw,6.4rem)] uppercase"
        />
        <div className="mt-8 grid gap-6 md:grid-cols-12">
          <RevealText className="font-serif text-[clamp(1.5rem,2.6vw,2.4rem)] italic text-sand md:col-span-5">{place.subtitle}</RevealText>
          <RevealText className="text-lg leading-relaxed text-cream/75 md:col-span-5 md:col-start-8">{place.text}</RevealText>
        </div>
      </div>

      <div data-place-stage className="gutter mx-auto grid max-w-[1600px] items-center gap-12 py-20 lg:h-[100svh] lg:grid-cols-12 lg:py-0">
        <figure className="lg:col-span-6 lg:col-start-1">
          <svg
            data-plan
            viewBox="0 0 600 600"
            role="img"
            aria-labelledby="plan-title plan-desc"
            className="mx-auto w-full max-w-[min(600px,76svh)]"
          >
            <title id="plan-title">Visualisation conceptuelle du futur lieu du Merkez</title>
            <desc id="plan-desc">
              Huit espaces disposés autour d’une cour centrale : {place.spaces.map((s) => s.label).join(", ")}.
            </desc>
            <defs>
              <pattern id="p-stripes" width="10" height="10" patternUnits="userSpaceOnUse">
                <rect width="3" height="10" fill="rgba(244,236,221,.22)" />
              </pattern>
              <pattern id="p-dots" width="12" height="12" patternUnits="userSpaceOnUse">
                <circle cx="6" cy="6" r="1.6" fill="rgba(244,236,221,.28)" />
              </pattern>
              <pattern id="p-diag" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width="2.5" height="12" fill="rgba(0,0,0,.18)" />
              </pattern>
              <pattern id="p-check" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect width="10" height="10" fill="rgba(0,0,0,.14)" />
                <rect x="10" y="10" width="10" height="10" fill="rgba(0,0,0,.14)" />
              </pattern>
              <radialGradient id="core-glow">
                <stop offset="0%" stopColor="#c99a3e" stopOpacity=".55" />
                <stop offset="100%" stopColor="#c99a3e" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Espaces colorés */}
            {cells.map((cell, i) => {
              const x = O + (cell % 3) * C;
              const y = O + Math.floor(cell / 3) * C;
              const s = place.spaces[i];
              const dim = active !== null && active !== i;
              return (
                <g key={s.label} data-room>
                  <g style={{ opacity: dim ? 0.35 : 1, transition: "opacity .4s" }}>
                  <rect x={x + 7} y={y + 7} width={C - 14} height={C - 14} fill={s.color} />
                  <rect x={x + 7} y={y + 7} width={C - 14} height={C - 14} fill={`url(#p-${patterns[i]})`} />
                  {active === i && <rect x={x + 7} y={y + 7} width={C - 14} height={C - 14} fill="none" stroke="#f4ecdd" strokeWidth="3" />}
                  <text data-room-num x={x + 22} y={y + 44} fill="#f4ecdd" fontSize="22" fontWeight="300" letterSpacing="2" fontFamily="inherit">
                    {String(i + 1).padStart(2, "0")}
                  </text>
                  </g>
                </g>
              );
            })}

            {/* Cour centrale */}
            <circle data-core-glow cx="300" cy="300" r="120" fill="url(#core-glow)" />

            {/* Tracé architectural (se dessine au scroll) */}
            <g fill="none" stroke="#f4ecdd" strokeLinecap="round" strokeLinejoin="round">
              <path data-draw pathLength={1} strokeDasharray="1" strokeWidth="2.5" d={`M${O} ${O} H${600 - O} V${600 - O} H${O} Z`} />
              <path data-draw pathLength={1} strokeDasharray="1" strokeWidth="1.2" d={`M${O + C} ${O} V${600 - O} M${O + 2 * C} ${O} V${600 - O}`} />
              <path data-draw pathLength={1} strokeDasharray="1" strokeWidth="1.2" d={`M${O} ${O + C} H${600 - O} M${O} ${O + 2 * C} H${600 - O}`} />
              <path data-draw pathLength={1} strokeDasharray="1" strokeWidth="1" opacity=".7" d={`M${O + C + 18} ${O + C + 18} H${O + 2 * C - 18} V${O + 2 * C - 18} H${O + C + 18} Z`} />
              <path data-draw pathLength={1} strokeDasharray="1" strokeWidth="1" opacity=".8" d="M300 262 A38 38 0 1 1 299.9 262 Z" />
              <path data-draw pathLength={1} strokeDasharray="1" strokeWidth="1" opacity=".6" d={arcade(O + C + 18, O + C + 46, C - 36, 5)} />
              <path data-draw pathLength={1} strokeDasharray="1" strokeWidth="1" opacity=".5" d="M300 210 V262 M300 338 V390 M210 300 H262 M338 300 H390" />
            </g>
            {/* Ouvertures vers le centre */}
            <g fill="#14100c">
              <rect x="288" y={O + C - 3} width="24" height="6" />
              <rect x="288" y={O + 2 * C - 3} width="24" height="6" />
              <rect x={O + C - 3} y="288" width="6" height="24" />
              <rect x={O + 2 * C - 3} y="288" width="6" height="24" />
            </g>
            <text x="300" y="306" textAnchor="middle" fill="#d8c3a0" fontSize="11" fontWeight="600" letterSpacing="3" fontFamily="inherit">
              {place.centerLabel.toUpperCase()}
            </text>
          </svg>
          <figcaption className="mx-auto mt-4 max-w-[600px] text-xs text-cream/55">{place.disclaimer}</figcaption>
        </figure>

        <div className="lg:col-span-5 lg:col-start-8">
          <p className="eyebrow mb-6 text-saffron">Le lieu accueillera</p>
          <ol className="divide-y divide-cream/15 border-y border-cream/15" onMouseLeave={() => setActive(null)}>
            {place.spaces.map((s, i) => (
              <li key={s.label} data-space>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  className="group flex w-full items-center gap-5 py-3.5 text-left"
                >
                  <span className="text-[0.62rem] font-semibold tracking-[0.2em] text-cream/50">{String(i + 1).padStart(2, "0")}</span>
                  <span aria-hidden="true" className="h-3 w-3 shrink-0 transition-transform duration-500 group-hover:scale-150" style={{ backgroundColor: s.color }} />
                  <span className="text-lg font-light transition-transform duration-500 ease-[var(--ease-silk)] group-hover:translate-x-2 md:text-xl">{s.label}</span>
                </button>
              </li>
            ))}
          </ol>
          <p className="mt-8 font-serif text-xl italic text-sand/90">{place.centerNote}</p>
        </div>
      </div>

      {place.images.length > 0 && (
        <div data-maquette className="gutter mx-auto max-w-[1600px] pb-28 pt-8 md:pb-40">
          <div className="grid gap-6 md:grid-cols-12">
            <h3 className="display text-[clamp(1.8rem,3.6vw,3.4rem)] md:col-span-6">{place.maquetteTitle}</h3>
            <p className="text-base leading-relaxed text-cream/75 md:col-span-5 md:col-start-8 md:text-lg">{place.maquetteText}</p>
          </div>
          <div className="mt-10 grid gap-3 md:mt-14 md:grid-cols-12 md:gap-5">
            {place.images.map((img, i) => (
              <figure
                key={img.src}
                data-maq
                className={`group relative overflow-hidden ${
                  i === 0 ? "md:col-span-8 md:row-span-2" : i === 4 ? "md:col-span-12" : "md:col-span-4"
                }`}
              >
                <div className={`relative ${i === 0 ? "aspect-[16/10] md:aspect-auto md:h-full md:min-h-[420px]" : i === 4 ? "aspect-[16/7]" : "aspect-[4/3]"}`}>
                  <Image
                    src={img.src!}
                    alt={img.alt}
                    fill
                    sizes={i === 0 ? "(min-width:768px) 66vw, 100vw" : i === 4 ? "100vw" : "(min-width:768px) 33vw, 100vw"}
                    className="object-cover transition-transform duration-[1.6s] ease-[var(--ease-silk)] group-hover:scale-[1.05]"
                  />
                </div>
              </figure>
            ))}
          </div>
          <p className="mt-5 text-xs text-cream/55">{place.maquetteNote}</p>
        </div>
      )}
    </section>
  );
}
