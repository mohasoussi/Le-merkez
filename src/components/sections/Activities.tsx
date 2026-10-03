"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/components/motion/gsap";
import RevealText from "@/components/motion/RevealText";
import Photo from "@/components/ui/Photo";
import { actions, type ActionAxis } from "@/content/actions";
import { site } from "@/content/site";

/** Carte d'axe : inclinaison et reflet qui suivent la souris, déploiement au survol. */
function ActionCard({ action, index }: { action: ActionAxis; index: number }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const el = ref.current;
      if (!el || !matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
      const inner = el.querySelector<HTMLElement>("[data-tilt]")!;
      const media = el.querySelector<HTMLElement>("[data-card-media]")!;
      const rx = gsap.quickTo(inner, "rotationX", { duration: 0.8, ease: "power3.out" });
      const ry = gsap.quickTo(inner, "rotationY", { duration: 0.8, ease: "power3.out" });
      const mx = gsap.quickTo(media, "x", { duration: 1, ease: "power3.out" });
      const my = gsap.quickTo(media, "y", { duration: 1, ease: "power3.out" });
      const move = contextSafe!((e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        rx(-py * 7);
        ry(px * 7);
        mx(-px * 24);
        my(-py * 24);
        el.style.setProperty("--mx", `${(px + 0.5) * 100}%`);
        el.style.setProperty("--my", `${(py + 0.5) * 100}%`);
      });
      const leave = contextSafe!(() => {
        rx(0);
        ry(0);
        mx(0);
        my(0);
      });
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    },
    { scope: ref },
  );

  return (
    <article
      ref={ref}
      data-card
      className="group relative min-h-[420px] min-w-0 [perspective:1200px] lg:min-h-0 lg:flex-1 lg:transition-[flex-grow] lg:duration-700 lg:ease-[var(--ease-silk)] lg:hover:flex-[2.4] lg:focus-within:flex-[2.4]"
    >
      <div data-tilt className="relative h-full overflow-hidden text-cream [transform-style:preserve-3d]" style={{ backgroundColor: action.color }}>
        <div data-card-media className="absolute inset-0 scale-110">
          <Photo media={action.image} showLabel={false} seed={index * 7 + 3} sizes="(min-width:1024px) 40vw, 100vw" className="h-full w-full" />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-90 mix-blend-multiply transition-opacity duration-700 group-hover:opacity-60"
          style={{ background: `linear-gradient(to top, ${action.color} 15%, transparent 85%)` }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: "radial-gradient(500px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,.16), transparent 45%)" }}
        />
        <div className="relative flex h-full flex-col justify-between p-6 md:p-8 lg:p-5 xl:p-7 [transform:translateZ(40px)]">
          <div className="flex items-start justify-between">
            <span className="text-[0.7rem] font-semibold tracking-[0.3em]" style={{ color: action.accent }}>
              {action.number}
            </span>
            {!action.image.src && site.showPlaceholderLabels ? (
              <span className="ph-label max-w-[60%] text-right text-[0.55rem] text-cream/50">{action.image.placeholder}</span>
            ) : (
              <span aria-hidden="true" className="h-3 w-3 rotate-45 border" style={{ borderColor: action.accent }} />
            )}
          </div>
          <div>
            <h3 className="break-words text-[clamp(1.1rem,1.25vw,1.6rem)] font-light uppercase leading-[1.08] tracking-[0.03em] [hyphens:auto]" lang="fr">
              {action.title}
            </h3>
            <div className="grid transition-[grid-template-rows,opacity] duration-700 ease-[var(--ease-silk)] lg:grid-rows-[0fr] lg:opacity-0 lg:group-hover:grid-rows-[1fr] lg:group-hover:opacity-100 lg:group-focus-within:grid-rows-[1fr] lg:group-focus-within:opacity-100">
              <div className="overflow-hidden">
                <p className="mt-4 max-w-md text-sm leading-relaxed text-cream/85">{action.summary}</p>
              </div>
            </div>
            <Link
              href={action.slug === "librairie" ? "/librairie" : `/actions/${action.slug}`}
              className="mt-6 inline-flex items-center gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.24em] after:absolute after:inset-0"
            >
              <span className="stitch inline-block w-8" aria-hidden="true" />
              {action.slug === "librairie" ? "Découvrir les livres" : "Voir les actions"}
              <span className="sr-only"> — {action.title}</span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

/**
 * NOS ACTIONS — les 5 grands axes du Merkez.
 */
export default function Activities() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MQ.desktop}, ${MQ.mobile}`, () => {
        gsap.from("[data-card]", {
          clipPath: "inset(100% 0% 0% 0%)",
          y: 80,
          duration: 1.4,
          ease: "expo.out",
          stagger: 0.09,
          scrollTrigger: { trigger: "[data-cards]", start: "top 80%", once: true },
        });
        gsap.to("[data-big-title]", {
          xPercent: -18,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="actions" aria-labelledby="actions-title" className="relative overflow-hidden bg-night pb-24 pt-28 text-cream md:pt-40">
      <div aria-hidden="true" className="pointer-events-none select-none overflow-hidden whitespace-nowrap">
        <span data-big-title className="block pl-[var(--gutter)] text-[clamp(5rem,17vw,17rem)] font-extralight uppercase leading-[0.85] tracking-tight text-cream/[0.06]">
          Nos actions · Nos actions
        </span>
      </div>
      <div className="gutter mx-auto -mt-[clamp(2.5rem,8vw,8rem)] max-w-[1600px]">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="eyebrow mb-6 flex items-center gap-4 text-saffron">
              <span aria-hidden="true" className="stitch inline-block w-10" />
              Cinq axes
            </p>
            <RevealText as="h2" id="actions-title" className="display text-[clamp(2.4rem,5.6vw,5.4rem)] uppercase">
              Nos actions
            </RevealText>
          </div>
          <RevealText className="self-end text-lg leading-relaxed text-cream/70 md:col-span-4 md:col-start-9">
            Se rencontrer, dialoguer, se retirer, réfléchir, servir et transmettre : cinq chemins pour une même intention.
          </RevealText>
        </div>

        <div data-cards className="mt-16 flex flex-col gap-3 lg:h-[72svh] lg:min-h-[520px] lg:flex-row">
          {actions.map((a, i) => (
            <ActionCard key={a.slug} action={a} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
