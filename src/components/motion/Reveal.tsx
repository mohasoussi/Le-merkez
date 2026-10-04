"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MQ, useGSAP } from "./gsap";

/**
 * Révèle son contenu au scroll : « clip » (volet qui s'ouvre, pour les images) ou « up » (montée douce).
 * Le contenu reste visible sans JavaScript.
 */
export default function Reveal({
  children,
  className,
  mode = "up",
  delay = 0,
  parallax = false,
}: {
  children: ReactNode;
  className?: string;
  mode?: "clip" | "up";
  delay?: number;
  /** Mode « clip » : fait aussi bouger légèrement l'image à l'intérieur au scroll. */
  parallax?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const el = ref.current!;
      const mm = gsap.matchMedia();
      mm.add(`${MQ.desktop}, ${MQ.mobile}`, () => {
        const trigger = { trigger: el, start: "top 88%", once: true };
        if (mode === "clip") {
          gsap.from(el, { clipPath: "inset(100% 0% 0% 0%)", duration: 1.5, ease: "expo.inOut", delay, scrollTrigger: trigger });
          if (parallax) {
            const img = el.querySelector("img");
            if (img) gsap.fromTo(img, { scale: 1.18 }, { scale: 1.02, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
          }
        } else {
          gsap.from(el, { y: 50, opacity: 0, duration: 1.3, ease: "expo.out", delay, scrollTrigger: trigger });
        }
      });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
