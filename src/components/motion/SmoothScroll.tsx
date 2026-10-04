"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "./gsap";

let lenis: Lenis | null = null;

/** Défilement vers une ancre, fluide si Lenis est actif. */
export function scrollToTarget(target: string | HTMLElement) {
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return false;
  if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.6 });
  else el.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  return true;
}

/**
 * Lenis + ScrollTrigger synchronisés sur le ticker GSAP.
 * Désactivé si l'utilisateur préfère réduire les animations ; sur tactile, le défilement natif est conservé.
 */
export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, anchors: false });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  // Liens d'ancre internes (#vision, /#soutenir…) : défilement fluide.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as HTMLElement).closest("a");
      if (!a) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
      if (scrollToTarget(decodeURIComponent(url.hash))) {
        e.preventDefault();
        history.replaceState(null, "", url.hash);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Changement de page : remonter / suivre l'ancre puis recalculer les déclencheurs.
  useEffect(() => {
    const hash = location.hash;
    lenis?.scrollTo(0, { immediate: true });
    const id = window.setTimeout(() => {
      ScrollTrigger.refresh();
      if (hash) {
        const el = document.querySelector<HTMLElement>(decodeURIComponent(hash));
        if (el) lenis ? lenis.scrollTo(el, { immediate: true }) : el.scrollIntoView();
      }
    }, 120);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}
