"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/components/motion/gsap";

/**
 * Fil de lumière vertical : un point lumineux descend le long de la ligne
 * au fur et à mesure du défilement de la page.
 */
export default function ScrollLine() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const setP = gsap.quickSetter(el, "--p");
      const st = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => setP(self.progress),
        onRefresh: (self) => setP(self.progress),
      });
      return () => st.kill();
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="pointer-events-none fixed bottom-6 left-[6px] top-[calc(var(--nav-h)+1rem)] z-40 w-px md:left-[14px] lg:left-[20px]"
      style={{ ["--p" as string]: 0 }}
    >
      {/* rail */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sand/35 to-transparent" />
      {/* lumière parcourue */}
      <div
        className="absolute inset-x-0 top-0 h-full origin-top bg-gradient-to-b from-saffron/0 via-saffron/70 to-saffron shadow-[0_0_8px_rgba(201,154,62,.7)]"
        style={{ transform: "scaleY(var(--p))" }}
      />
      {/* point */}
      <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ top: "calc(var(--p) * 100%)" }}>
        <span className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-saffron/25 blur-[6px]" />
        <span className="relative block h-[7px] w-[7px] rounded-full bg-cream shadow-[0_0_0_1.5px_rgba(201,154,62,.9),0_0_14px_3px_rgba(201,154,62,.75)]" />
      </div>
    </div>
  );
}
