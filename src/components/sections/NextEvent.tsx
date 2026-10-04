"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import PatchField from "@/components/ui/PatchField";
import { events, eventsIntro, type MerkezEvent } from "@/content/events";
import { site } from "@/content/site";

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const nextOf = (list: MerkezEvent[]) => [...list].sort((a, b) => a.date.localeCompare(b.date)).find((e) => e.date >= today()) ?? null;
const fmt = (iso: string) =>
  new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date(`${iso}T12:00:00`));

/**
 * Encart « Prochain événement » : choisit l'événement à venir le plus proche, recalculé au chargement
 * dans le navigateur (un événement passé disparaît sans republier le site).
 */
export default function NextEvent() {
  const [event, setEvent] = useState<MerkezEvent | null>(() => nextOf(events));
  useEffect(() => setEvent(nextOf(events)), []);

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
            <time dateTime={event.date}>{fmt(event.date)}</time>
            {event.time ? ` · ${event.time}` : ""}
          </p>
          <h2 id="next-event" className="display mt-4 text-[clamp(2rem,4.4vw,4.2rem)]">
            {event.title}
          </h2>
          {event.location && <p className="mt-4 text-sm uppercase tracking-[0.16em] text-cream/75">{event.location}</p>}
          {event.description && <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream/85">{event.description}</p>}
          {event.link && (
            <div className="mt-8">
              <Button href={event.link.href} variant="solid">
                {event.link.label}
              </Button>
            </div>
          )}
        </div>
        {event.image?.src && (
          <div className="md:col-span-4 md:col-start-9">
            <div className="relative aspect-[3/4] overflow-hidden shadow-[0_30px_60px_-20px_rgba(0,0,0,.6)]">
              <Image src={event.image.src} alt={event.image.alt} fill sizes="(min-width:768px) 30vw, 100vw" className="object-cover" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
