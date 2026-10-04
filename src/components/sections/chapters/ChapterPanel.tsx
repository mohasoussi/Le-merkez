import Link from "next/link";
import type { ReactNode } from "react";
import type { ActionAxis } from "@/content/actions";
import Photo from "@/components/ui/Photo";

/**
 * Panneau d'un axe dans le défilement horizontal.
 * - `[data-traverse]` : l'image qui traverse le grand titre (animée par ActionChapters).
 * - `aside` : contenu propre à chaque axe.
 */
export default function ChapterPanel({
  action,
  bigWord,
  aside,
  tone = "dark",
}: {
  action: ActionAxis;
  bigWord: string;
  aside?: ReactNode;
  tone?: "dark" | "light";
}) {
  const light = tone === "light";
  return (
    <article
      data-panel
      aria-labelledby={`chapter-${action.slug}`}
      className={`relative flex w-full shrink-0 flex-col justify-center overflow-hidden py-20 md:py-28 group-[.is-h]/h:h-[100svh] group-[.is-h]/h:w-screen group-[.is-h]/h:pb-12 group-[.is-h]/h:pt-[var(--nav-h)] lg:group-[.is-h]/h:py-0 ${
        light ? "bg-cream text-umber" : "text-cream"
      }`}
      style={light ? undefined : { backgroundColor: action.color }}
    >
      {/* Grand mot traversé par l'image */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1/2 z-[2] -translate-y-1/2 select-none mix-blend-overlay">
        <p
          data-bigword
          className={`whitespace-nowrap pl-[var(--gutter)] text-[clamp(5rem,19vw,20rem)] font-extralight uppercase leading-none tracking-tight ${
            light ? "text-umber/[0.12]" : "text-cream/[0.22]"
          }`}
        >
          {bigWord}
        </p>
      </div>
      <div
        data-traverse
        aria-hidden="true"
        className="pointer-events-none absolute right-[8%] top-1/2 z-[1] hidden aspect-[3/4] w-[min(20vw,320px)] -translate-y-1/2 opacity-80 shadow-[0_40px_80px_-20px_rgba(0,0,0,.5)] lg:block"
      >
        <Photo media={action.image} seed={Number(action.number) * 5} sizes="22vw" className="h-full w-full" />
      </div>

      <div className="gutter relative z-[3] grid w-full gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow mb-6" style={{ color: light ? action.color : action.accent }}>
            {action.number} — Nos actions
          </p>
          <h3 id={`chapter-${action.slug}`} className="text-[clamp(2.2rem,4.4vw,4.4rem)] font-light uppercase leading-[0.98] tracking-tight">
            {action.title}
          </h3>
          <div className={`mt-8 max-w-xl space-y-4 text-[clamp(1rem,1.2vw,1.2rem)] leading-relaxed ${light ? "text-umber/80" : "text-cream/85"}`}>
            {action.description.map((d, i) => (
              <p key={d} className={i ? "max-md:group-[.is-h]/h:hidden" : ""}>
                {d}
              </p>
            ))}
          </div>
          {action.objective && (
            <p className={`mt-8 max-w-lg border-l-2 pl-5 font-serif text-xl italic leading-snug md:text-2xl`} style={{ borderColor: action.accent }}>
              <span className="eyebrow mb-2 block font-sans not-italic opacity-70">Objectif</span>
              {action.objective}
            </p>
          )}
          <Link
            href={`/actions/${action.slug}`}
            className="mt-10 inline-flex items-center gap-3 border-b border-current pb-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em] transition-opacity hover:opacity-70"
          >
            Articles &amp; actions menées <span aria-hidden="true">→</span>
          </Link>
        </div>
        {aside && <div className="max-md:group-[.is-h]/h:hidden lg:col-span-4 lg:col-start-7">{aside}</div>}
      </div>
    </article>
  );
}
