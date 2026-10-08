import { X } from "lucide-react";
import { Reveal } from "./Reveal";

const PAINS = [
  "Pas de site du tout",
  "Un site vieillissant",
  "Tout repose sur Instagram",
  "Un site illisible sur mobile",
  "Pas assez de confiance",
  "Des clients perdus en route",
];

export function Problem({ quote }: { quote: string }) {
  return (
    <section className="bg-ink py-20 text-white sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16">
        <Reveal>
          <p className="mb-3 text-sm font-medium text-indigo-300">Le constat</p>
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-balance sm:text-[2.6rem] sm:leading-[1.1]">Aujourd&apos;hui, vos clients vous cherchent en ligne avant de vous appeler.</h2>
          <p className="mt-5 text-lg leading-relaxed text-white/70">
            Beaucoup de petites entreprises passent à côté de clients sans le savoir. Si vos visiteurs ne trouvent pas rapidement qui vous êtes, ce que vous proposez et comment vous contacter, ils vont voir ailleurs.
          </p>
          <ul className="mt-8 grid gap-2.5 sm:grid-cols-2">
            {PAINS.map((p) => (
              <li key={p} className="flex items-center gap-3 rounded-xl bg-white/[0.06] px-4 py-3 text-sm ring-1 ring-white/10">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-red-500/15 text-red-300">
                  <X className="size-3.5" aria-hidden />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={120}>
          <figure className="relative rounded-3xl bg-gradient-to-br from-indigo-500/20 via-white/[0.04] to-transparent p-8 ring-1 ring-white/10 sm:p-12">
            <span aria-hidden className="absolute -top-6 left-8 text-8xl leading-none text-indigo-300/40">“</span>
            <blockquote className="text-2xl font-medium leading-snug tracking-tight text-balance sm:text-3xl">{quote}</blockquote>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
