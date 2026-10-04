"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "@/components/motion/gsap";

/**
 * Fil de lumière vertical : un point lumineux descend le long de la ligne au fil du défilement.
 * Performance : seules des transformations (GPU) sont modifiées à chaque image — pas de mise en page.
 */
export default function ScrollLine() {
  const root = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current!;
    let h = el.clientHeight;
    const apply = (p: number) => {
      if (dot.current) dot.current.style.transform = `translate3d(-50%, ${(p * h).toFixed(1)}px, 0)`;
      if (fill.current) fill.current.style.transform = `scaleY(${p.toFixed(4)})`;
    };
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => apply(self.progress),
      onRefresh: (self) => {
        h = el.clientHeight;
        apply(self.progress);
      },
    });
    apply(st.progress);
    return () => st.kill();
  }, []);

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="pointer-events-none fixed bottom-6 left-[6px] top-[calc(var(--nav-h)+1rem)] z-40 w-px md:left-[14px] lg:left-[20px]"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sand/35 to-transparent" />
      <div
        ref={fill}
        className="absolute inset-x-0 top-0 h-full origin-top bg-gradient-to-b from-saffron/0 via-saffron/70 to-saffron will-change-transform"
        style={{ transform: "scaleY(0)" }}
      />
      <div ref={dot} className="absolute left-1/2 top-0 will-change-transform" style={{ transform: "translate3d(-50%, 0, 0)" }}>
        <span className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-saffron/30" />
        <span className="relative block h-[7px] w-[7px] -translate-y-1/2 rounded-full bg-cream shadow-[0_0_0_1.5px_rgba(201,154,62,.9),0_0_10px_2px_rgba(201,154,62,.7)]" />
      </div>
    </div>
  );
}
