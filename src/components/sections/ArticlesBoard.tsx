"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/components/motion/gsap";
import ArticleCard from "@/components/ui/ArticleCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { actions, getArticles } from "@/content/actions";

/** Les actions menées, filtrables par catégorie. */
export default function ArticlesBoard({
  limit = 6,
  heading = true,
  tone = "light",
}: {
  limit?: number;
  heading?: boolean;
  tone?: "light" | "dark";
}) {
  const [cat, setCat] = useState<string | null>(null);
  const list = useRef<HTMLDivElement>(null);
  const items = getArticles(cat ?? undefined).slice(0, limit);
  const dark = tone === "dark";

  useGSAP(
    () => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from("[data-article]", { opacity: 0, y: 40, duration: 1, stagger: 0.07, ease: "expo.out" });
    },
    { scope: list, dependencies: [cat], revertOnUpdate: true },
  );

  return (
    <div className={dark ? "text-cream" : "text-umber"}>
      {heading && (
        <div className="mb-12 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading eyebrow="Journal" title="Les actions menées" titleClassName="text-[clamp(2rem,4.4vw,4rem)]" />
          <Link href="/actualites" className="eyebrow shrink-0 border-b border-current pb-1 transition-opacity hover:opacity-70">
            Toutes les actualités →
          </Link>
        </div>
      )}
      <div role="group" aria-label="Filtrer par catégorie" className="mb-10 flex flex-wrap gap-2">
        {[{ slug: null as string | null, short: "Toutes" }, ...actions].map((a) => (
          <button
            key={a.slug ?? "all"}
            type="button"
            aria-pressed={cat === a.slug}
            onClick={() => setCat(a.slug)}
            className={`rounded-full border px-4 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.2em] transition-colors duration-300 ${
              cat === a.slug
                ? dark
                  ? "border-cream bg-cream text-night"
                  : "border-umber bg-umber text-cream"
                : dark
                  ? "border-cream/25 hover:border-cream"
                  : "border-umber/25 hover:border-umber"
            }`}
          >
            {a.short}
          </button>
        ))}
      </div>
      <div ref={list} aria-live="polite" className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {items.length ? (
          items.map((a, i) => (
            <div key={`${a.category}/${a.slug}`} data-article className="relative">
              <ArticleCard article={a} tone={tone} index={i} />
            </div>
          ))
        ) : (
          <p className="col-span-full opacity-70">Aucune action publiée pour le moment dans cette catégorie.</p>
        )}
      </div>
    </div>
  );
}
