import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { buttonClass } from "@/components/ui/Button";
import { formatCents } from "@/lib/format";
import { cn } from "@/lib/cn";
import { Reveal } from "./Reveal";
import { Section } from "./Section";

interface Offer {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  priceCents: number;
  priceLabel: string | null;
  features: string[];
  highlighted: boolean;
}

export function Offers({ offers, maintenance, options }: { offers: Offer[]; maintenance: Offer[]; options: { id: string; name: string; priceCents: number | null }[] }) {
  return (
    <Section id="offres" eyebrow="Les offres" title="Des formules claires, sans surprise" intro="Des prix indicatifs pour vous situer. Après notre échange, vous recevez un devis précis adapté à votre projet.">
      <ul className="grid gap-5 lg:grid-cols-3">
        {offers.map((o, i) => (
          <Reveal as="li" key={o.id} delay={i * 80} className={cn("relative flex flex-col rounded-3xl border p-6 sm:p-8", o.highlighted ? "border-ink bg-ink text-white shadow-lift" : "border-line bg-white")}>
            {o.highlighted && (
              <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-brand px-3 py-1 text-xs font-medium text-white">
                <Sparkles className="size-3" aria-hidden /> Le plus choisi
              </span>
            )}
            <h3 className="text-lg font-semibold">{o.name}</h3>
            {o.tagline && <p className={cn("mt-1 text-sm", o.highlighted ? "text-white/70" : "text-muted")}>{o.tagline}</p>}
            <p className="mt-6 flex items-baseline gap-2">
              {o.priceLabel && <span className={cn("text-sm", o.highlighted ? "text-white/60" : "text-muted")}>{o.priceLabel}</span>}
              <span className="text-4xl font-semibold tracking-tight">{formatCents(o.priceCents, { round: true })}</span>
            </p>
            <ul className="mt-6 flex-1 space-y-2.5 text-sm">
              {o.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <Check className={cn("mt-0.5 size-4 shrink-0", o.highlighted ? "text-indigo-300" : "text-brand")} aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
            <Link href={`/demande?offre=${o.slug}`} className={buttonClass(o.highlighted ? "brand" : "secondary", "lg", "mt-8 w-full")}>
              Choisir {o.name}
            </Link>
          </Reveal>
        ))}
      </ul>

      {(options.length > 0 || maintenance.length > 0) && (
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {options.length > 0 && (
            <Reveal className="rounded-3xl border border-line bg-canvas p-6 sm:p-8">
              <h3 className="font-semibold">Options à la carte</h3>
              <p className="mt-1 text-sm text-muted">À ajouter à n&apos;importe quelle formule.</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {options.map((o) => (
                  <li key={o.id} className="rounded-full border border-line bg-white px-3 py-1.5 text-sm">
                    {o.name}
                    {o.priceCents != null && <span className="text-muted"> · {formatCents(o.priceCents, { round: true })}</span>}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
          {maintenance.length > 0 && (
            <Reveal delay={80} className="rounded-3xl border border-line bg-canvas p-6 sm:p-8">
              <h3 className="font-semibold">Maintenance mensuelle</h3>
              <p className="mt-1 text-sm text-muted">Votre site reste à jour, sécurisé et sauvegardé.</p>
              <ul className="mt-5 grid gap-2 sm:grid-cols-3">
                {maintenance.map((m) => (
                  <li key={m.id} className="rounded-2xl border border-line bg-white p-4">
                    <p className="text-sm font-medium">{m.name}</p>
                    <p className="mt-1 text-xl font-semibold tracking-tight">
                      {formatCents(m.priceCents, { round: true })}
                      <span className="text-sm font-normal text-muted">/mois</span>
                    </p>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>
      )}
    </Section>
  );
}
