"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, MQ, SplitText, useGSAP } from "./gsap";

interface Props {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** lines : lignes masquées qui montent ; words : mots qui se déplient ; chars : lettres. */
  mode?: "lines" | "words" | "chars";
  delay?: number;
  stagger?: number;
  /** Lié au scroll (scrub) plutôt que joué une fois. */
  scrub?: boolean;
  start?: string;
  id?: string;
}

/**
 * Révélation typographique au scroll. Le texte est visible sans JS ;
 * le découpage n'a lieu qu'au montage côté client.
 */
export default function RevealText({
  as: Tag = "p",
  children,
  className,
  mode = "lines",
  delay = 0,
  stagger,
  scrub = false,
  start = "top 85%",
  id,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(`${MQ.desktop}, ${MQ.mobile}`, () => {
        const split = SplitText.create(el, {
          type: mode === "lines" ? "lines" : mode === "words" ? "words,lines" : "chars,words,lines",
          mask: mode === "chars" ? "words" : "lines",
          linesClass: "split-line",
          autoSplit: mode === "lines",
          onSplit(self) {
            const targets = mode === "lines" ? self.lines : mode === "words" ? self.words : self.chars;
            const vars: gsap.TweenVars =
              mode === "words"
                ? { yPercent: 110, rotate: 3, opacity: 0, filter: "blur(6px)" }
                : mode === "chars"
                  ? { yPercent: 115, opacity: 0 }
                  : { yPercent: 105 };
            return gsap.from(targets, {
              ...vars,
              duration: mode === "chars" ? 1 : 1.3,
              ease: "expo.out",
              delay,
              stagger: stagger ?? (mode === "lines" ? 0.1 : mode === "words" ? 0.05 : 0.025),
              scrollTrigger: scrub
                ? { trigger: el, start, end: "bottom 45%", scrub: 1 }
                : { trigger: el, start, once: true },
            });
          },
        });
        return () => split.revert();
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className} id={id}>
      {children}
    </Tag>
  );
}
