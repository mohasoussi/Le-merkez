import Link from "next/link";
import { Search } from "lucide-react";
import { Input, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { BUDGETS, BUDGET_LABELS, LEAD_SOURCES, LEAD_SOURCE_LABELS, PIPELINE_STAGES, PIPELINE_STAGE_LABELS, PROJECT_TYPES, PROJECT_TYPE_LABELS, SECTORS, SECTOR_LABELS } from "@/lib/constants";
import type { LeadFilters } from "@/server/services/leads";
import { toDateInput } from "@/lib/format";

/** Filtres en GET : l'URL est partageable et le bouton « retour » du navigateur fonctionne. Aucun JS requis. */
export function LeadFiltersForm({ filters, offers }: { filters: LeadFilters; offers: { id: string; name: string }[] }) {
  const sel = "h-10 py-2 text-sm";
  return (
    <form method="get" className="mb-5 rounded-2xl border border-line bg-white p-3 shadow-soft">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <label htmlFor="q" className="sr-only">
            Rechercher
          </label>
          <Input id="q" name="q" defaultValue={filters.q} placeholder="Nom, entreprise, email, téléphone…" className="h-10 py-2 pl-9 text-sm" />
        </div>
        <Button type="submit" size="md" className="h-10">
          Filtrer
        </Button>
      </div>
      <details className="group mt-2" open={Boolean(filters.stage || filters.sector || filters.budget || filters.projectType || filters.source || filters.offerId || filters.from || filters.to)}>
        <summary className="cursor-pointer list-none px-1 py-1 text-xs font-medium text-muted hover:text-ink [&::-webkit-details-marker]:hidden">
          <span className="group-open:hidden">+ Plus de filtres</span>
          <span className="hidden group-open:inline">− Moins de filtres</span>
        </summary>
        <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-8">
          <Select name="stage" defaultValue={filters.stage ?? ""} aria-label="Statut" className={sel}>
            <option value="">Tous statuts</option>
            {PIPELINE_STAGES.map((s) => (
              <option key={s} value={s}>
                {PIPELINE_STAGE_LABELS[s]}
              </option>
            ))}
          </Select>
          <Select name="sector" defaultValue={filters.sector ?? ""} aria-label="Secteur" className={sel}>
            <option value="">Tous secteurs</option>
            {SECTORS.map((s) => (
              <option key={s} value={s}>
                {SECTOR_LABELS[s]}
              </option>
            ))}
          </Select>
          <Select name="budget" defaultValue={filters.budget ?? ""} aria-label="Budget" className={sel}>
            <option value="">Tous budgets</option>
            {BUDGETS.map((s) => (
              <option key={s} value={s}>
                {BUDGET_LABELS[s]}
              </option>
            ))}
          </Select>
          <Select name="projectType" defaultValue={filters.projectType ?? ""} aria-label="Type de projet" className={sel}>
            <option value="">Tous projets</option>
            {PROJECT_TYPES.map((s) => (
              <option key={s} value={s}>
                {PROJECT_TYPE_LABELS[s]}
              </option>
            ))}
          </Select>
          <Select name="source" defaultValue={filters.source ?? ""} aria-label="Source" className={sel}>
            <option value="">Toutes sources</option>
            {LEAD_SOURCES.map((s) => (
              <option key={s} value={s}>
                {LEAD_SOURCE_LABELS[s]}
              </option>
            ))}
          </Select>
          <Select name="offerId" defaultValue={filters.offerId ?? ""} aria-label="Offre" className={sel}>
            <option value="">Toutes offres</option>
            {offers.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </Select>
          <Input type="date" name="from" defaultValue={toDateInput(filters.from)} aria-label="Créé à partir du" className={sel} />
          <Input type="date" name="to" defaultValue={toDateInput(filters.to)} aria-label="Créé jusqu'au" className={sel} />
        </div>
        <div className="mt-2 flex items-center justify-between gap-2">
          <Select name="sort" defaultValue={filters.sort} aria-label="Trier par" className={`${sel} max-w-56`}>
            <option value="recent">Plus récents</option>
            <option value="oldest">Plus anciens</option>
            <option value="name">Nom (A → Z)</option>
            <option value="budget">Budget (décroissant)</option>
            <option value="stage">Statut</option>
          </Select>
          <Link href="?" className="text-xs font-medium text-muted hover:text-ink">
            Réinitialiser
          </Link>
        </div>
      </details>
    </form>
  );
}
