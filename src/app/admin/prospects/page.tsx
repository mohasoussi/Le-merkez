import type { Metadata } from "next";
import Link from "next/link";
import { Download } from "lucide-react";
import { requireAdminPage } from "@/server/auth/guards";
import { listLeads, parseLeadFilters } from "@/server/services/leads";
import { db } from "@/server/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { LeadFiltersForm } from "@/components/admin/LeadFiltersForm";
import { StageBadge } from "@/components/admin/Badges";
import { buttonClass } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/States";
import { BUDGET_LABELS, LEAD_SOURCE_LABELS, PROJECT_TYPE_LABELS, SECTOR_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Prospects" };

export default async function LeadsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const actor = await requireAdminPage();
  const params = await searchParams;
  const filters = parseLeadFilters(params);
  const [{ items, total, pageCount }, offers] = await Promise.all([listLeads(actor, filters), db.offer.findMany({ where: { type: "SITE" }, select: { id: true, name: true }, orderBy: { sortOrder: "asc" } })]);

  const qs = new URLSearchParams(Object.entries(params).filter(([k, v]) => typeof v === "string" && v && k !== "page") as [string, string][]);
  const pageHref = (p: number) => `?${new URLSearchParams([...qs, ["page", String(p)]])}`;
  const exportHref = (format: string) => `/api/admin/leads/export?${new URLSearchParams([...qs, ["format", format]])}`;

  return (
    <>
      <PageHeader
        title="Prospects"
        description={`${total} prospect${total > 1 ? "s" : ""}`}
        actions={
          <>
            <a href={exportHref("csv")} className={buttonClass("secondary", "sm")}>
              <Download className="size-4" aria-hidden /> CSV
            </a>
            <a href={exportHref("xlsx")} className={buttonClass("secondary", "sm")}>
              <Download className="size-4" aria-hidden /> Excel
            </a>
            <Link href="/admin/prospects/nouveau" className={buttonClass("primary", "sm")}>
              Ajouter
            </Link>
          </>
        }
      />
      <LeadFiltersForm filters={filters} offers={offers} />

      {items.length === 0 ? (
        <EmptyState title={total === 0 && !qs.toString() ? "Aucun prospect pour le moment." : "Aucun prospect ne correspond à ces critères."} />
      ) : (
        <>
          {/* Mobile : cartes */}
          <ul className="space-y-2 md:hidden">
            {items.map((l) => (
              <li key={l.id}>
                <Link href={`/admin/prospects/${l.id}`} className="block rounded-2xl border border-line bg-white p-4 shadow-soft">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{l.companyName}</p>
                      <p className="truncate text-sm text-muted">
                        {l.firstName} {l.lastName}
                      </p>
                    </div>
                    <StageBadge stage={l.stage} />
                  </div>
                  <p className="mt-2 text-xs text-muted">
                    {SECTOR_LABELS[l.sector]} · {BUDGET_LABELS[l.budget]} · {formatDate(l.createdAt)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop : tableau */}
          <div className="hidden overflow-hidden rounded-2xl border border-line bg-white shadow-soft md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-canvas/60 text-xs text-muted">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">Prospect</th>
                  <th scope="col" className="px-4 py-3 font-medium">Projet</th>
                  <th scope="col" className="px-4 py-3 font-medium">Budget</th>
                  <th scope="col" className="hidden px-4 py-3 font-medium xl:table-cell">Source</th>
                  <th scope="col" className="px-4 py-3 font-medium">Statut</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">Créé le</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {items.map((l) => (
                  <tr key={l.id} className="group relative hover:bg-canvas/60">
                    <td className="px-4 py-3">
                      <Link href={`/admin/prospects/${l.id}`} className="font-medium after:absolute after:inset-0 group-hover:text-brand">
                        {l.companyName}
                      </Link>
                      <p className="text-xs text-muted">
                        {l.firstName} {l.lastName} · {l.email}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-ink-soft">
                      {PROJECT_TYPE_LABELS[l.projectType]}
                      <p className="text-xs text-muted">{SECTOR_LABELS[l.sector]}</p>
                    </td>
                    <td className="px-4 py-3 text-ink-soft">{BUDGET_LABELS[l.budget]}</td>
                    <td className="hidden px-4 py-3 text-ink-soft xl:table-cell">{LEAD_SOURCE_LABELS[l.source]}</td>
                    <td className="px-4 py-3">
                      <StageBadge stage={l.stage} />
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-muted">{formatDate(l.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pageCount > 1 && (
            <nav aria-label="Pagination" className="mt-5 flex items-center justify-between text-sm">
              {filters.page > 1 ? (
                <Link href={pageHref(filters.page - 1)} className={buttonClass("secondary", "sm")}>
                  Précédent
                </Link>
              ) : (
                <span />
              )}
              <span className="text-muted">
                Page {filters.page} / {pageCount}
              </span>
              {filters.page < pageCount ? (
                <Link href={pageHref(filters.page + 1)} className={buttonClass("secondary", "sm")}>
                  Suivant
                </Link>
              ) : (
                <span />
              )}
            </nav>
          )}
        </>
      )}
    </>
  );
}
