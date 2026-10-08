import type { Metadata } from "next";
import { requireAdminPage } from "@/server/auth/guards";
import { getStatistics } from "@/server/services/stats";
import { PageHeader } from "@/components/admin/PageHeader";
import { KpiCard } from "@/components/admin/KpiCard";
import { BarList, ColumnChart } from "@/components/admin/Charts";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { LEAD_SOURCE_LABELS, SECTOR_LABELS } from "@/lib/constants";
import { formatCents } from "@/lib/format";

export const metadata: Metadata = { title: "Statistiques" };

const pct = (v: number | null) => (v == null ? "—" : `${Math.round(v * 100)} %`);
const monthFmt = new Intl.DateTimeFormat("fr-FR", { month: "short" });

export default async function StatsPage() {
  const actor = await requireAdminPage();
  const s = await getStatistics(actor);
  return (
    <>
      <PageHeader title="Statistiques" description="Calculées en temps réel depuis vos données (les données fictives de démonstration sont incluses tant qu'elles ne sont pas supprimées)." />

      <h2 className="mb-3 text-sm font-semibold text-muted">Acquisition</h2>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-3">
          <CardHeader title="Prospects par mois" description={`${s.acquisition.totalLeads} prospects au total`} />
          <CardBody>
            <ColumnChart title="Prospects par mois" data={s.acquisition.perMonth.map((m) => ({ label: monthFmt.format(new Date(`${m.month}-01T12:00:00`)).replace(".", ""), value: m.count }))} />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Par source" />
          <CardBody>
            <BarList title="Prospects par source" data={s.acquisition.bySource.map((d) => ({ label: LEAD_SOURCE_LABELS[d.key], value: d.count }))} />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Par secteur" />
          <CardBody>
            <BarList title="Prospects par secteur" data={s.acquisition.bySector.map((d) => ({ label: SECTOR_LABELS[d.key], value: d.count }))} />
          </CardBody>
        </Card>
        <div className="grid content-start gap-3">
          <KpiCard label="Taux de conversion" value={pct(s.commercial.conversionRate)} hint={`${s.commercial.convertedLeads} prospect(s) devenu(s) client(s)`} />
          <KpiCard label="Valeur du pipeline" value={formatCents(s.commercial.pipelineValueCents, { round: true })} hint="Affaires ouvertes" />
        </div>
      </div>

      <h2 className="mb-3 mt-8 text-sm font-semibold text-muted">Commercial & production</h2>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <KpiCard label="Devis envoyés" value={s.commercial.quotesSent} />
        <KpiCard label="Devis acceptés" value={s.commercial.quotesAccepted} hint={`Taux : ${pct(s.commercial.quoteAcceptanceRate)}`} />
        <KpiCard label="Projets actifs" value={s.production.activeProjects} />
        <KpiCard label="Projets terminés" value={s.production.doneProjects} />
        <KpiCard label="Délai moyen" value={s.production.averageDays == null ? "—" : `${s.production.averageDays} j`} hint="Du début à la livraison" />
      </div>

      <h2 className="mb-3 mt-8 text-sm font-semibold text-muted">Finance</h2>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard accent label="CA signé" value={formatCents(s.finance.signedCents, { round: true })} />
        <KpiCard label="CA encaissé" value={formatCents(s.finance.collectedCents, { round: true })} />
        <KpiCard label="CA potentiel" value={formatCents(s.finance.potentialCents, { round: true })} />
        <KpiCard label="Revenus récurrents" value={`${formatCents(s.finance.mrrCents, { round: true })}/mois`} hint={`soit ${formatCents(s.finance.mrrCents * 12, { round: true })}/an`} />
      </div>
    </>
  );
}
