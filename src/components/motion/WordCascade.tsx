"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "./gsap";

/**
 * Suite de phrases courtes qui se révèlent l'une après l'autre au scroll (chaque ligne monte dans son masque).
 * La dernière phrase est mise en valeur. Visible sans JavaScript.
 */
export default function WordCascade({
  lines,
  className = "",
  lineClassName = "",
  accentClassName = "text-saffron",
  accentLast = true,
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
  accentClassName?: string;
  accentLast?: boolean;
}) {
  const ref = useRef<HTMLUListElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MQ.desktop}, ${MQ.mobile}`, () => {
        gsap.from("[data-cascade]", {
          yPercent: 115,
          opacity: 0,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.16,
          scrollTrigger: { trigger: ref.current, start: "top 82%", once: true },
        });
      });
    },
    { scope: ref },
  );
  return (
    <ul ref={ref} className={className}>
      {lines.map((l, i) => (
        <li key={l} className="line-mask">
          <span data-cascade className={`block ${lineClassName} ${accentLast && i === lines.length - 1 ? accentClassName : ""}`}>
            {l}
          </span>
        </li>
      ))}
    </ul>
  );
}
