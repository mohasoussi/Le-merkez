"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/components/motion/gsap";
import { makePatches, patchStyle, seeded } from "@/lib/patchwork";

/**
 * Transition entre deux sections par fragments textiles :
 * une lisière de morceaux de tissu qui se coud au fil du scroll.
 */
export default function FragmentDivider({
  from = "var(--color-night)",
  to = "var(--color-cream)",
  seed = 5,
  count = 18,
}: {
  from?: string;
  to?: string;
  seed?: number;
  count?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const patches = makePatches(count, seed);
  const rnd = seeded(seed * 13);
  const heights = patches.map(() => 30 + Math.round(rnd() * 70));

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MQ.desktop}, ${MQ.mobile}`, () => {
        gsap.from("[data-frag]", {
          yPercent: 100,
          ease: "none",
          stagger: { each: 0.04, from: "random" },
          scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom 60%", scrub: 1 },
        });
        gsap.from("[data-frag-inner]", {
          rotate: (i) => (i % 2 ? 6 : -6),
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom 60%", scrub: 1 },
        });
      });
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="relative flex h-[clamp(48px,7vw,110px)] items-end overflow-hidden"
      style={{ background: `linear-gradient(${from} 0 50%, ${to} 50% 100%)` }}
    >
      {patches.map((p, i) => (
        <div key={p.id} data-frag className="relative flex-1" style={{ height: `${heights[i]}%` }}>
          <div data-frag-inner className="absolute inset-0 origin-bottom" style={patchStyle(p)} />
        </div>
      ))}
    </div>
  );
}
