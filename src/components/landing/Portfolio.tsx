import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { SECTOR_LABELS, type SectorCode } from "@/lib/constants";
import { Reveal } from "./Reveal";
import { Section } from "./Section";
import { SECTOR_MOCK_THEME, SiteMockup } from "./SiteMockup";
import { mediaUrl } from "@/lib/media";

export interface PortfolioItem {
  id: string;
  name: string;
  category: SectorCode;
  description: string;
  url: string | null;
  imageKey: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
  technologies: string[];
  date: Date | null;
}

export function Portfolio({ items }: { items: PortfolioItem[] }) {
  return (
    <Section id="realisations" tone="canvas" eyebrow="Réalisations" title="Des sites qui donnent confiance" intro="Quelques projets récents, pour des activités très différentes.">
      {items.length === 0 ? (
        <p className="mx-auto max-w-md rounded-2xl border border-dashed border-line bg-white px-6 py-10 text-center text-muted">Nos réalisations seront bientôt présentées ici.</p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p, i) => {
            const src = p.imageKey ? mediaUrl(p.imageKey) : p.imageUrl;
            return (
              <Reveal as="li" key={p.id} delay={(i % 3) * 70} className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-white transition-shadow duration-300 hover:shadow-lift">
                <div className="relative aspect-[4/3] overflow-hidden bg-canvas">
                  {src ? (
                    <Image src={src} alt={p.imageAlt || `Aperçu du site ${p.name}`} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" unoptimized={!p.imageKey} />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center p-6">
                      <SiteMockup theme={SECTOR_MOCK_THEME[p.category] ?? "neutral"} className="w-full transition-transform duration-500 group-hover:-translate-y-1" />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs font-medium uppercase tracking-wider text-brand">{SECTOR_LABELS[p.category]}</p>
                  <h3 className="mt-1.5 text-lg font-semibold">{p.name}</h3>
                  <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">{p.description}</p>
                  {p.url && (
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-ink hover:text-brand">
                      Voir le site <ArrowUpRight className="size-4" aria-hidden />
                      <span className="sr-only"> {p.name} (nouvel onglet)</span>
                    </a>
                  )}
                </div>
              </Reveal>
            );
          })}
        </ul>
      )}
    </Section>
  );
}
