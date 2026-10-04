"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import PatchField from "@/components/ui/PatchField";
import { events, eventsIntro, type MerkezEvent } from "@/content/events";
import { site } from "@/content/site";

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
/** Événements pas encore terminés, du plus proche au plus lointain. */
const upcoming = (list: MerkezEvent[]) =>
  [...list].sort((a, b) => a.date.localeCompare(b.date)).filter((e) => (e.endDate ?? e.date) >= today());

const day = (iso: string, opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("fr-FR", opts).format(new Date(`${iso}T12:00:00`));
const when = (e: MerkezEvent) => {
  if (e.endDate && e.endDate !== e.date) {
    const a = new Date(`${e.date}T12:00:00`);
    const b = new Date(`${e.endDate}T12:00:00`);
    const sameMonth = a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
    return sameMonth
      ? `Du ${a.getDate()} au ${day(e.endDate, { day: "numeric", month: "long", year: "numeric" })}`
      : `Du ${day(e.date, { day: "numeric", month: "long" })} au ${day(e.endDate, { day: "numeric", month: "long", year: "numeric" })}`;
  }
  return day(e.date, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
};
const articleHref = (e: MerkezEvent) => (e.article ? `/actions/${e.article.category}/${e.article.slug}` : null);

/**
 * Encart « Prochain événement » : l'événement à venir le plus proche, puis les suivants.
 * Recalculé au chargement dans le navigateur : un événement terminé disparaît sans republier le site.
 */
export default function NextEvent() {
  const [list, setList] = useState<MerkezEvent[]>(() => upcoming(events));
  useEffect(() => setList(upcoming(events)), []);
  const [event, ...following] = list;

  if (!event) {
    if (!site.showPlaceholderLabels) return null;
    return (
      <section aria-labelledby="next-event" className="relative overflow-hidden bg-umber text-cream">
        <div className="gutter mx-auto max-w-[1600px] py-14 md:py-20">
          <p className="eyebrow mb-4 text-saffron">{eventsIntro.eyebrow}</p>
          <h2 id="next-event" className="ph-label text-base text-cream/70">
            {eventsIntro.empty}
          </h2>
          <p className="mt-3 max-w-xl text-sm text-cream/55">{eventsIntro.emptyNote}</p>
        </div>
      </section>
    );
  }

  const href = articleHref(event);
  return (
    <section aria-labelledby="next-event" className="grain relative overflow-hidden bg-madder text-cream">
      <div aria-hidden="true" className="absolute inset-y-0 right-0 w-1/3 opacity-25 max-md:hidden" style={{ maskImage: "linear-gradient(to left, black, transparent)", WebkitMaskImage: "linear-gradient(to left, black, transparent)" }}>
        <PatchField cols={5} rows={6} seed={61} gap={3} />
      </div>
      <div className="gutter relative z-[2] mx-auto grid max-w-[1600px] gap-10 py-14 md:grid-cols-12 md:py-20">
        <div className={event.image?.src ? "md:col-span-7" : "md:col-span-9"}>
          <p className="eyebrow mb-5 flex items-center gap-4 text-saffron">
            <span aria-hidden="true" className="stitch inline-block w-10" />
            {eventsIntro.eyebrow}
          </p>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-cream/80">
            <time dateTime={event.date}>{when(event)}</time>
            {event.time ? ` · ${event.time}` : ""}
          </p>
          <h2 id="next-event" className="display mt-4 text-[clamp(2rem,4.4vw,4.2rem)]">
            {event.title}
          </h2>
          {event.location && <p className="mt-4 text-sm uppercase tracking-[0.16em] text-cream/75">{event.location}</p>}
          {event.description && <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream/85">{event.description}</p>}
          <div className="mt-8 flex flex-wrap gap-4">
            {href && (
              <Button href={href} variant="solid">
                Voir le programme
              </Button>
            )}
            {event.link && (
              <a
                href={event.link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 self-center border-b border-cream/60 pb-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] transition-colors hover:border-saffron hover:text-saffron"
              >
                {event.link.label} <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
        </div>
        {event.image?.src && (
          <div className="md:col-span-4 md:col-start-9">
            <div className="relative mx-auto aspect-[1061/1500] w-full max-w-[340px] overflow-hidden shadow-[0_30px_60px_-20px_rgba(0,0,0,.6)] md:max-w-none" style={{ aspectRatio: `${event.image.width ?? 3} / ${event.image.height ?? 4}` }}>
              <Image src={event.image.src} alt={event.image.alt} fill sizes="(min-width:768px) 30vw, 80vw" className="object-cover" />
            </div>
          </div>
        )}

        {following.length > 0 && (
          <div className="border-t border-cream/20 pt-8 md:col-span-12">
            <p className="eyebrow mb-5 text-cream/70">{eventsIntro.followingEyebrow}</p>
            <ul className="grid gap-4 md:grid-cols-2">
              {following.map((e) => {
                const h = articleHref(e);
                return (
                  <li key={e.slug} className="group relative flex gap-4 border border-cream/20 bg-night/20 p-4 transition-colors hover:bg-night/35">
                    {e.image?.src && (
                      <div className="relative h-24 w-[4.2rem] shrink-0 overflow-hidden">
                        <Image src={e.image.src} alt="" fill sizes="70px" className="object-cover" />
                      </div>
                    )}
                    <div>
                      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-saffron">
                        <time dateTime={e.date}>{when(e)}</time>
                        {e.location ? ` · ${e.location}` : ""}
                      </p>
                      <p className="mt-1.5 text-lg font-light leading-snug">
                        {h ? (
                          <Link href={h} className="after:absolute after:inset-0">
                            {e.title}
                          </Link>
                        ) : (
                          e.title
                        )}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
