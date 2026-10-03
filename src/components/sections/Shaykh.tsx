"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { gsap, MQ, useGSAP } from "@/components/motion/gsap";
import RevealText from "@/components/motion/RevealText";
import Photo from "@/components/ui/Photo";
import { shaykh } from "@/content/shaykh";
import { formatDate } from "@/lib/format";

type TabKey = keyof typeof shaykh.tabs;
const tabKeys = Object.keys(shaykh.tabs) as TabKey[];

/**
 * SOUS LA DIRECTION DU SHAYKH — portrait, biographie, enseignements, conférences, vidéos, publications.
 * Aucune information n'est inventée : tout provient de src/content/shaykh.ts.
 */
export default function Shaykh() {
  const root = useRef<HTMLElement>(null);
  const [tab, setTab] = useState<TabKey>(tabKeys[0]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MQ.desktop}, ${MQ.mobile}`, () => {
        gsap.from("[data-portrait]", {
          clipPath: "inset(12% 12% 12% 12%)",
          duration: 1.8,
          ease: "expo.inOut",
          scrollTrigger: { trigger: "[data-portrait]", start: "top 80%", once: true },
        });
        gsap.fromTo(
          "[data-portrait-inner]",
          { yPercent: -6, scale: 1.15 },
          { yPercent: 6, scale: 1.05, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
    },
    { scope: root },
  );

  const onKey = (e: KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const next = (i + (e.key === "ArrowRight" ? 1 : -1) + tabKeys.length) % tabKeys.length;
    setTab(tabKeys[next]);
    document.getElementById(`tab-${tabKeys[next]}`)?.focus();
  };

  return (
    <section ref={root} id="shaykh" aria-labelledby="shaykh-title" className="relative bg-linen py-28 text-umber md:py-40">
      <div className="gutter mx-auto grid max-w-[1600px] gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div data-portrait className="relative aspect-[4/5] overflow-hidden lg:sticky lg:top-28">
            <div data-portrait-inner className="absolute inset-0">
              <Photo media={shaykh.portrait} seed={88} sizes="(min-width:1024px) 40vw, 100vw" className="h-full w-full" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <p className="eyebrow mb-6 flex items-center gap-4 text-madder">
            <span aria-hidden="true" className="stitch inline-block w-10" />
            {shaykh.eyebrow}
          </p>
          <RevealText as="h2" id="shaykh-title" className="display text-[clamp(2.1rem,4.4vw,4.2rem)]">
            {shaykh.title}
          </RevealText>

          <div className="mt-10 space-y-5 text-lg leading-relaxed text-umber/80">
            <h3 className="eyebrow text-umber/60">Biographie</h3>
            {shaykh.biography.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          <div className="mt-14">
            <div role="tablist" aria-label="Ressources" className="flex flex-wrap gap-x-6 gap-y-2 border-b border-umber/15">
              {tabKeys.map((k, i) => (
                <button
                  key={k}
                  id={`tab-${k}`}
                  role="tab"
                  type="button"
                  aria-selected={tab === k}
                  aria-controls={`panel-${k}`}
                  tabIndex={tab === k ? 0 : -1}
                  onClick={() => setTab(k)}
                  onKeyDown={(e) => onKey(e, i)}
                  className="relative -mb-px py-3 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-umber/55 transition-colors aria-selected:text-umber"
                >
                  {shaykh.tabs[k].label}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 bottom-0 h-0.5 origin-left bg-madder transition-transform duration-500 ease-[var(--ease-silk)] ${tab === k ? "scale-x-100" : "scale-x-0"}`}
                  />
                </button>
              ))}
            </div>
            {tabKeys.map((k) => (
              <div key={k} id={`panel-${k}`} role="tabpanel" aria-labelledby={`tab-${k}`} hidden={tab !== k} tabIndex={0}>
                <ul className="divide-y divide-umber/10">
                  {shaykh.tabs[k].items.map((it, i) => (
                    <li key={`${it.title}-${i}`} className="flex flex-wrap items-baseline justify-between gap-3 py-5">
                      {it.href ? (
                        <a href={it.href} target="_blank" rel="noopener noreferrer" className="text-xl font-light underline-offset-4 hover:underline">
                          {it.title}
                        </a>
                      ) : (
                        <span className="text-xl font-light">{it.title}</span>
                      )}
                      <span className="ph-label text-umber/50">
                        {formatDate(it.date)}
                        {it.meta ? ` · ${it.meta}` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
