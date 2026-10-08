import type { Metadata } from "next";
import Link from "next/link";
import { requireAdminPage } from "@/server/auth/guards";
import { listSubscriptions } from "@/server/services/subscriptions";
import { PageHeader } from "@/components/admin/PageHeader";
import { KpiCard } from "@/components/admin/KpiCard";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/States";
import { SUBSCRIPTION_STATUS_LABELS } from "@/lib/constants";
import { formatCents, formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Maintenance" };

export default async function MaintenancePage() {
  const actor = await requireAdminPage();
  const subs = await listSubscriptions(actor);
  const active = subs.filter((s) => s.status === "ACTIVE");
  const mrr = active.reduce((sum, s) => sum + s.priceCents, 0);
  const soon = active.filter((s) => s.nextDueDate && s.nextDueDate.getTime() < Date.now() + 7 * 86_400_000).length;
  return (
    <>
      <PageHeader title="Maintenance" description="Les abonnements se créent depuis la fiche client. Les prix des formules se modifient dans « Offres & options »." />
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-3">
        <KpiCard accent label="Revenus mensuels" value={formatCents(mrr, { round: true })} hint={`${formatCents(mrr * 12, { round: true })} / an`} />
        <KpiCard label="Abonnements actifs" value={active.length} />
        <KpiCard label="Échéances sous 7 jours" value={soon} />
      </div>
      {subs.length === 0 ? (
        <EmptyState title="Aucun abonnement de maintenance." />
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
          {subs.map((s) => (
            <li key={s.id}>
              <Link href={`/admin/clients/${s.client.id}`} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3.5 hover:bg-canvas">
                <span className="min-w-0 flex-1 truncate text-sm font-medium">{s.client.companyName}</span>
                <span className="text-sm">{s.planName}</span>
                <span className="text-sm tabular-nums">{formatCents(s.priceCents)}/mois</span>
                <span className="text-xs text-muted">prochaine échéance {formatDate(s.nextDueDate)}</span>
                <Badge tone={s.status === "ACTIVE" ? "success" : "neutral"}>{SUBSCRIPTION_STATUS_LABELS[s.status]}</Badge>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
