"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/components/motion/gsap";
import Emblem from "@/components/ui/Emblem";
import { story } from "@/content/home";
import { contact, footerLinks, site, socials } from "@/content/site";
import { makePatches, patchStyle } from "@/lib/patchwork";

const seam = makePatches(32, 97);

/** Pied de page : le récit du Merkez se recompose une dernière fois, puis les liens. */
export default function Footer() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MQ.desktop}, ${MQ.mobile}`, () => {
        gsap.from("[data-story]", {
          opacity: 0.12,
          yPercent: 30,
          ease: "power2.out",
          stagger: 0.25,
          scrollTrigger: { trigger: "[data-story-list]", start: "top 80%", end: "bottom 60%", scrub: 1 },
        });
        gsap.from("[data-seam] > span", {
          scaleY: 0,
          transformOrigin: "bottom",
          stagger: { each: 0.02, from: "center" },
          scrollTrigger: { trigger: "[data-seam]", start: "top bottom", end: "top 75%", scrub: 1 },
        });
      });
    },
    { scope: root },
  );

  const year = new Date().getFullYear();
  const linkCls = "text-cream/70 transition-colors hover:text-cream";

  return (
    <footer ref={root} id="contact" className="relative overflow-hidden bg-night text-cream">
      <div data-seam aria-hidden="true" className="flex h-3">
        {seam.map((p) => (
          <span key={p.id} className="flex-1" style={patchStyle(p)} />
        ))}
      </div>

      <div className="gutter mx-auto max-w-[1600px] py-24 md:py-32">
        <ol data-story-list aria-label="Le récit du Merkez" className="flex flex-col items-center text-center">
          {story.map((s, i) => {
            const last = i === story.length - 1;
            return (
              <li key={s} data-story className="flex flex-col items-center">
                {last ? (
                  <span className="mt-4 flex flex-col items-center gap-6">
                    <Emblem size={56} gap={2} />
                    <span className="pl-[0.3em] text-[clamp(2.4rem,9vw,8rem)] font-extralight uppercase leading-none tracking-[0.3em]">{s}</span>
                  </span>
                ) : (
                  <span className="text-[clamp(1rem,2.2vw,1.8rem)] font-light uppercase tracking-[0.2em] text-cream/80">{s}</span>
                )}
                {!last && (
                  <span aria-hidden="true" className="my-2 text-saffron/70">
                    ↓
                  </span>
                )}
              </li>
            );
          })}
        </ol>
        <p className="mt-10 text-center font-serif text-2xl italic text-sand md:text-3xl">« {site.tagline} »</p>
      </div>

      <div className="gutter mx-auto grid max-w-[1600px] gap-12 border-t border-cream/10 py-16 md:grid-cols-12">
        <div className="md:col-span-4">
          <Link href="/" className="flex items-center gap-3" aria-label="Le Merkez — accueil">
            <Emblem size={30} />
            <span className="text-sm font-semibold uppercase tracking-[0.38em]">Le Merkez</span>
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream/60">{site.description}</p>
          <p className="mt-4 text-xs text-cream/45">Sous la direction du {site.director}.</p>
        </div>

        <nav aria-label="Plan du site" className="md:col-span-4 lg:col-span-3 lg:col-start-6">
          <h2 className="eyebrow mb-5 text-saffron">Explorer</h2>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            {footerLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkCls}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4 lg:col-span-2">
          <h2 className="eyebrow mb-5 text-saffron">Suivre</h2>
          <ul className="space-y-3 text-sm">
            {socials.map((s) => (
              <li key={s.label}>
                {s.href ? (
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className={linkCls}>
                    {s.label}
                  </a>
                ) : (
                  <span className="flex flex-col">
                    <span className="text-cream/70">{s.label}</span>
                    {site.showPlaceholderLabels && <span className="ph-label text-[0.55rem] text-cream/35">{s.placeholder}</span>}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <address className="not-italic md:col-span-12 lg:col-span-2">
          <h2 className="eyebrow mb-5 text-saffron">Contact</h2>
          <ul className="space-y-3 text-sm text-cream/70">
            <li>{contact.email ? <a href={`mailto:${contact.email}`} className={linkCls}>{contact.email}</a> : <span className="ph-label text-cream/45">{contact.emailPlaceholder}</span>}</li>
            <li>{contact.phone ? <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className={linkCls}>{contact.phone}</a> : <span className="ph-label text-cream/45">{contact.phonePlaceholder}</span>}</li>
            <li>{contact.address ?? <span className="ph-label text-cream/45">{contact.addressPlaceholder}</span>}</li>
          </ul>
        </address>
      </div>

      <div className="gutter mx-auto flex max-w-[1600px] flex-col justify-between gap-3 border-t border-cream/10 py-6 text-xs text-cream/40 md:flex-row">
        <p>© {year} Le Merkez</p>
        <p>
          <a href="#main" className="transition-colors hover:text-cream">
            Retour en haut ↑
          </a>
        </p>
      </div>
    </footer>
  );
}
