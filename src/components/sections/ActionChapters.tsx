"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/components/motion/gsap";
import Conferences from "./chapters/Conferences";
import Humanitarian from "./chapters/Humanitarian";
import Interfaith from "./chapters/Interfaith";
import Retreats from "./chapters/Retreats";

/**
 * Les axes défilent de droite à gauche au fil du scroll (ordinateur et mobile).
 * Sans JS ou en mouvement réduit : panneaux empilés verticalement.
 * Les images traversent les grands titres.
 */
export default function ActionChapters() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ desktop: MQ.desktop, mobile: MQ.mobile }, (ctx) => {
        const { desktop } = ctx.conditions as { desktop: boolean };
        root.current!.classList.add("is-h");
        const track = root.current!.querySelector<HTMLElement>("[data-track]")!;
        const distance = () => track.scrollWidth - window.innerWidth;
        const scroll = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
          },
        });
        gsap.to("[data-progress]", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance()}`, scrub: true },
        });

        gsap.utils.toArray<HTMLElement>("[data-panel]").forEach((panel) => {
          const img = panel.querySelector("[data-traverse]");
          const word = panel.querySelector("[data-bigword]");
          const st = { containerAnimation: scroll, trigger: panel, start: "left right", end: "right left", scrub: true };
          if (img && desktop) gsap.fromTo(img, { xPercent: 90, rotation: 4 }, { xPercent: -260, rotation: -3, ease: "none", scrollTrigger: st });
          if (word) gsap.fromTo(word, { xPercent: 12 }, { xPercent: -22, ease: "none", scrollTrigger: st });
          const orbits = panel.querySelectorAll("[data-orbit]");
          if (orbits.length)
            gsap.fromTo(orbits, { x: (i) => (i ? 70 : -70) }, { x: 0, ease: "none", scrollTrigger: { ...st, end: "center center" } });
        });
        return () => root.current?.classList.remove("is-h");
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="actions" aria-label="Nos actions" className="group/h relative overflow-hidden bg-night">
      <div data-track className="flex flex-col group-[.is-h]/h:h-[100svh] group-[.is-h]/h:w-max group-[.is-h]/h:flex-row">
        <Interfaith />
        <Retreats />
        <Conferences />
        <Humanitarian />
      </div>
      <div aria-hidden="true" className="absolute bottom-8 left-[var(--gutter)] right-[var(--gutter)] hidden h-px bg-cream/20 group-[.is-h]/h:block">
        <div data-progress className="h-full origin-left scale-x-0 bg-saffron" />
      </div>
    </section>
  );
}
