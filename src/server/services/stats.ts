import "server-only";
import { db } from "@/server/db";
import { assertAdmin } from "@/server/auth/guards";
import type { Actor } from "@/server/auth/session";
import { OPEN_PIPELINE_STAGES, WON_PIPELINE_STAGES } from "@/lib/constants";

// Toutes les statistiques sont calculées depuis la base : aucune valeur inventée.
// Les données fictives (isDemo) sont incluses : elles sont supprimables via `npm run db:demo:clear`.

/** Valeur d'une affaire : montant du devis saisi, sinon prix de l'offre envisagée, sinon inconnue (0). */
function dealValue(l: { dealAmountCents: number | null; offer: { priceCents: number } | null; client?: { projects: { priceCents: number | null }[] } | null }) {
  if (l.dealAmountCents != null) return l.dealAmountCents;
  const projectsTotal = l.client?.projects.reduce((s, p) => s + (p.priceCents ?? 0), 0) ?? 0;
  if (projectsTotal > 0) return projectsTotal;
  return l.offer?.priceCents ?? 0;
}

export async function getDashboardKpis(actor: Actor) {
  assertAdmin(actor);
  const now = new Date();
  const [stageCounts, upcomingCalls, quotesSent, clients, projectGroups, openLeads, wonLeads, payments, subs] = await Promise.all([
    db.lead.groupBy({ by: ["stage"], _count: true }),
    db.lead.count({ where: { OR: [{ stage: "CALL_SCHEDULED" }, { nextCallAt: { gte: now } }] } }),
    db.quote.count({ where: { status: "SENT" } }),
    db.client.count(),
    db.project.groupBy({ by: ["status"], _count: true }),
    db.lead.findMany({ where: { stage: { in: OPEN_PIPELINE_STAGES } }, select: { dealAmountCents: true, offer: { select: { priceCents: true } } } }),
    db.lead.findMany({
      where: { stage: { in: WON_PIPELINE_STAGES } },
      select: { dealAmountCents: true, offer: { select: { priceCents: true } }, client: { select: { projects: { select: { priceCents: true } } } } },
    }),
    db.payment.groupBy({ by: ["kind"], _sum: { amountCents: true } }),
    db.maintenanceSubscription.aggregate({ where: { status: "ACTIVE" }, _sum: { priceCents: true }, _count: true }),
  ]);

  const byStage = Object.fromEntries(stageCounts.map((s) => [s.stage, s._count])) as Record<string, number>;
  const byStatus = Object.fromEntries(projectGroups.map((s) => [s.status, s._count])) as Record<string, number>;
  const paid = (k: string) => payments.find((p) => p.kind === k)?._sum.amountCents ?? 0;

  return {
    totalLeads: stageCounts.reduce((s, x) => s + x._count, 0),
    newLeads: byStage.NEW ?? 0,
    toContact: (byStage.NEW ?? 0) + (byStage.TO_QUALIFY ?? 0),
    callsScheduled: upcomingCalls,
    // Devis en attente de réponse : devis au statut « Envoyé », ou prospects à l'étape « Devis envoyé » (devis fait hors outil)
    quotesSent: Math.max(quotesSent, byStage.QUOTE_SENT ?? 0),
    clients,
    projectsInProduction: ["DESIGN", "DEVELOPMENT", "REVISION", "VALIDATION", "LAUNCH"].reduce((s, k) => s + (byStatus[k] ?? 0), 0),
    projectsWaitingBrief: byStatus.BRIEF ?? 0,
    projectsDone: byStatus.DONE ?? 0,
    potentialRevenueCents: openLeads.reduce((s, l) => s + dealValue(l), 0),
    signedRevenueCents: wonLeads.reduce((s, l) => s + dealValue(l), 0),
    collectedCents: paid("DEPOSIT") + paid("BALANCE") + paid("OTHER"),
    maintenanceMrrCents: subs._sum.priceCents ?? 0,
    activeSubscriptions: subs._count,
  };
}

export async function getDashboardLists(actor: Actor) {
  assertAdmin(actor);
  const now = new Date();
  const [recentLeads, upcomingCalls, activeProjects] = await Promise.all([
    db.lead.findMany({ orderBy: { createdAt: "desc" }, take: 6, select: { id: true, firstName: true, lastName: true, companyName: true, stage: true, source: true, createdAt: true } }),
    db.lead.findMany({ where: { nextCallAt: { gte: new Date(now.getTime() - 60 * 60 * 1000) } }, orderBy: { nextCallAt: "asc" }, take: 5, select: { id: true, firstName: true, lastName: true, companyName: true, phone: true, nextCallAt: true } }),
    db.project.findMany({ where: { status: { not: "DONE" } }, orderBy: { dueDate: { sort: "asc", nulls: "last" } }, take: 6, select: { id: true, name: true, status: true, progressOverride: true, dueDate: true, client: { select: { companyName: true } } } }),
  ]);
  return { recentLeads, upcomingCalls, activeProjects };
}

/** Statistiques détaillées (page Statistiques). */
export async function getStatistics(actor: Actor, months = 12) {
  assertAdmin(actor);
  const since = new Date();
  since.setMonth(since.getMonth() - (months - 1), 1);
  since.setHours(0, 0, 0, 0);

  const [bySource, bySector, leadsPerMonth, totalLeads, convertedLeads, quotesByStatus, pipelineLeads, doneProjects, activeProjects, kpis] = await Promise.all([
    db.lead.groupBy({ by: ["source"], _count: true, orderBy: { _count: { source: "desc" } } }),
    db.lead.groupBy({ by: ["sector"], _count: true, orderBy: { _count: { sector: "desc" } } }),
    db.$queryRaw<{ month: Date; count: bigint }[]>`
      SELECT date_trunc('month', "createdAt" AT TIME ZONE 'Europe/Paris') AS month, COUNT(*)::bigint AS count
      FROM "Lead" WHERE "createdAt" >= ${since} GROUP BY 1 ORDER BY 1`,
    db.lead.count(),
    db.client.count({ where: { leadId: { not: null } } }),
    db.quote.groupBy({ by: ["status"], _count: true, _sum: { totalTtcCents: true } }),
    db.lead.findMany({ where: { stage: { in: OPEN_PIPELINE_STAGES } }, select: { dealAmountCents: true, offer: { select: { priceCents: true } } } }),
    db.project.findMany({ where: { status: "DONE", completedAt: { not: null } }, select: { startDate: true, createdAt: true, completedAt: true } }),
    db.project.count({ where: { status: { notIn: ["DONE"] } } }),
    getDashboardKpis(actor),
  ]);

  // Série mensuelle complète (mois sans prospect = 0)
  const series: { month: string; count: number }[] = [];
  for (let i = 0; i < months; i++) {
    const d = new Date(since);
    d.setMonth(since.getMonth() + i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const row = leadsPerMonth.find((r) => {
      const m = new Date(r.month);
      return m.getUTCFullYear() === d.getFullYear() && m.getUTCMonth() === d.getMonth();
    });
    series.push({ month: key, count: Number(row?.count ?? 0) });
  }

  const q = (s: string) => quotesByStatus.find((x) => x.status === s);
  const sentQuotes = ["SENT", "ACCEPTED", "REFUSED", "EXPIRED"].reduce((s, k) => s + (q(k)?._count ?? 0), 0);
  const durations = doneProjects.map((p) => (p.completedAt!.getTime() - (p.startDate ?? p.createdAt).getTime()) / 86_400_000).filter((d) => d >= 0);

  return {
    acquisition: {
      totalLeads,
      bySource: bySource.map((s) => ({ key: s.source, count: s._count })),
      bySector: bySector.map((s) => ({ key: s.sector, count: s._count })),
      perMonth: series,
    },
    commercial: {
      conversionRate: totalLeads ? convertedLeads / totalLeads : null,
      convertedLeads,
      quotesSent: sentQuotes,
      quotesAccepted: q("ACCEPTED")?._count ?? 0,
      quoteAcceptanceRate: sentQuotes ? (q("ACCEPTED")?._count ?? 0) / sentQuotes : null,
      pipelineValueCents: pipelineLeads.reduce((s, l) => s + dealValue(l), 0),
    },
    production: {
      activeProjects,
      doneProjects: doneProjects.length,
      averageDays: durations.length ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : null,
    },
    finance: {
      signedCents: kpis.signedRevenueCents,
      collectedCents: kpis.collectedCents,
      potentialCents: kpis.potentialRevenueCents,
      mrrCents: kpis.maintenanceMrrCents,
    },
  };
}
