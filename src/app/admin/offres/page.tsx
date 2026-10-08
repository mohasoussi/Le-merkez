import type { Metadata } from "next";
import { requireAdminPage } from "@/server/auth/guards";
import { db } from "@/server/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { OfferForm, OptionForm, type OfferValues } from "@/components/admin/content/OfferForms";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatCents } from "@/lib/format";

export const metadata: Metadata = { title: "Offres & options" };

function toValues(o: { id: string; name: string; tagline: string | null; priceCents: number; priceLabel: string | null; features: string[]; highlighted: boolean; isActive: boolean; sortOrder: number; type: "SITE" | "MAINTENANCE" }): OfferValues {
  return { id: o.id, name: o.name, tagline: o.tagline ?? "", price: String(o.priceCents / 100), priceLabel: o.priceLabel ?? "", features: o.features.join("\n"), highlighted: o.highlighted, isActive: o.isActive, sortOrder: o.sortOrder, type: o.type };
}
const blank = (type: "SITE" | "MAINTENANCE", sortOrder: number): OfferValues => ({ id: null, name: "", tagline: "", price: "", priceLabel: type === "SITE" ? "à partir de" : "", features: "", highlighted: false, isActive: true, sortOrder, type });

export default async function OffersPage() {
  await requireAdminPage();
  const [offers, options] = await Promise.all([db.offer.findMany({ orderBy: [{ type: "asc" }, { sortOrder: "asc" }] }), db.offerOption.findMany({ orderBy: { sortOrder: "asc" } })]);
  const groups = [
    { type: "SITE" as const, title: "Offres de création", description: "Affichées dans la section « Les offres » du site." },
    { type: "MAINTENANCE" as const, title: "Formules de maintenance", description: "Prix mensuels, utilisés pour les abonnements." },
  ];
  return (
    <>
      <PageHeader title="Offres & options" description="Les prix ne sont saisis qu'ici : le site, les devis et les abonnements les reprennent automatiquement." />
      <div className="flex flex-col gap-8">
        {groups.map((g) => {
          const list = offers.filter((o) => o.type === g.type);
          return (
            <section key={g.type}>
              <h2 className="text-lg font-semibold">{g.title}</h2>
              <p className="mb-3 text-sm text-muted">{g.description}</p>
              <div className="flex flex-col gap-3">
                {list.map((o) => (
                  <details key={o.id} className="group rounded-2xl border border-line bg-white shadow-soft">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
                      <span className="flex items-center gap-2 font-medium">
                        {o.name} {!o.isActive && <Badge>masquée</Badge>} {o.highlighted && <Badge tone="brand">mise en avant</Badge>}
                      </span>
                      <span className="text-sm tabular-nums text-ink-soft">
                        {formatCents(o.priceCents)}
                        {g.type === "MAINTENANCE" && "/mois"} <span className="ml-2 text-muted group-open:hidden">Modifier</span>
                      </span>
                    </summary>
                    <div className="border-t border-line p-5">
                      <OfferForm v={toValues(o)} />
                    </div>
                  </details>
                ))}
                <details className="rounded-2xl border border-dashed border-line">
                  <summary className="cursor-pointer list-none px-5 py-3 text-sm font-medium text-brand [&::-webkit-details-marker]:hidden">+ Ajouter</summary>
                  <div className="border-t border-line p-5">
                    <OfferForm v={blank(g.type, list.length)} />
                  </div>
                </details>
              </div>
            </section>
          );
        })}
        <Card>
          <CardHeader title="Options" description="Prestations complémentaires : affichées sur le site et ajoutables aux devis." />
          <CardBody className="flex flex-col gap-4 divide-y divide-line [&>*:not(:first-child)]:pt-4">
            {options.map((o) => (
              <OptionForm key={o.id} v={{ id: o.id, name: o.name, description: o.description ?? "", price: o.priceCents != null ? String(o.priceCents / 100) : "", isActive: o.isActive, sortOrder: o.sortOrder }} />
            ))}
            <OptionForm v={{ id: null, name: "", description: "", price: "", isActive: true, sortOrder: options.length }} />
          </CardBody>
        </Card>
      </div>
    </>
  );
}
