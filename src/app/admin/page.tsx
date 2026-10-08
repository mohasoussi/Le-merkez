import Link from "next/link";
import { Banknote, CalendarClock, FileText, FolderKanban, Repeat, TrendingUp, UserPlus, Users } from "lucide-react";
import { requireAdminPage } from "@/server/auth/guards";
import { getDashboardKpis, getDashboardLists } from "@/server/services/stats";
import { PageHeader } from "@/components/admin/PageHeader";
import { KpiCard } from "@/components/admin/KpiCard";
import { ProjectStatusBadge, StageBadge } from "@/components/admin/Badges";
import { Card, CardHeader } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/States";
import { buttonClass } from "@/components/ui/Button";
import { formatCents, formatDate, formatDateTime, relativeTime } from "@/lib/format";
import { LEAD_SOURCE_LABELS, projectProgress } from "@/lib/constants";

export default async function AdminDashboard() {
  const actor = await requireAdminPage();
  const [k, lists] = await Promise.all([getDashboardKpis(actor), getDashboardLists(actor)]);
  const hour = Number(new Intl.DateTimeFormat("fr-FR", { hour: "numeric", timeZone: "Europe/Paris" }).format(new Date()));

  return (
    <>
      <PageHeader
        title={`${hour < 18 ? "Bonjour" : "Bonsoir"} ${actor.firstName}`}
        description="Voici l'état de votre activité."
        actions={
          <Link href="/admin/prospects/nouveau" className={buttonClass("primary", "sm")}>
            <UserPlus className="size-4" aria-hidden /> Ajouter un prospect
          </Link>
        }
      />

      <section aria-label="Indicateurs commerciaux" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Prospects" value={k.totalLeads} hint={`${k.newLeads} nouveau${k.newLeads > 1 ? "x" : ""}`} href="/admin/prospects" icon={<Users className="size-4" />} />
        <KpiCard label="À contacter" value={k.toContact} hint="Nouveaux + à qualifier" href="/admin/pipeline" icon={<UserPlus className="size-4" />} />
        <KpiCard label="Appels programmés" value={k.callsScheduled} href="/admin/prospects?stage=CALL_SCHEDULED" icon={<CalendarClock className="size-4" />} />
        <KpiCard label="Devis envoyés" value={k.quotesSent} hint="En attente de réponse" href="/admin/devis" icon={<FileText className="size-4" />} />
        <KpiCard label="Clients" value={k.clients} href="/admin/clients" icon={<Users className="size-4" />} />
        <KpiCard label="Projets en production" value={k.projectsInProduction} hint={k.projectsWaitingBrief ? `+ ${k.projectsWaitingBrief} en attente de brief` : undefined} href="/admin/projets" icon={<FolderKanban className="size-4" />} />
        <KpiCard label="Projets terminés" value={k.projectsDone} href="/admin/projets?status=DONE" icon={<FolderKanban className="size-4" />} />
        <KpiCard label="Maintenance" value={formatCents(k.maintenanceMrrCents, { round: true })} hint={`${k.activeSubscriptions} abonnement${k.activeSubscriptions > 1 ? "s" : ""} actif${k.activeSubscriptions > 1 ? "s" : ""} / mois`} href="/admin/maintenance" icon={<Repeat className="size-4" />} />
      </section>

      <section aria-label="Chiffre d'affaires" className="mt-3 grid gap-3 sm:grid-cols-3">
        <KpiCard accent label="CA potentiel" value={formatCents(k.potentialRevenueCents, { round: true })} hint="Affaires en cours (devis ou offre envisagée)" icon={<TrendingUp className="size-4" />} />
        <KpiCard label="CA signé" value={formatCents(k.signedRevenueCents, { round: true })} hint="Acompte reçu et au-delà" icon={<Banknote className="size-4" />} />
        <KpiCard label="CA encaissé" value={formatCents(k.collectedCents, { round: true })} hint="Paiements enregistrés (hors maintenance)" icon={<Banknote className="size-4" />} />
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Derniers prospects" action={<Link href="/admin/prospects" className="text-sm font-medium text-brand">Tout voir</Link>} />
          {lists.recentLeads.length === 0 ? (
            <EmptyState className="m-5" title="Aucun prospect pour le moment." description="Les demandes envoyées depuis le formulaire apparaîtront ici." />
          ) : (
            <ul className="divide-y divide-line">
              {lists.recentLeads.map((l) => (
                <li key={l.id}>
                  <Link href={`/admin/prospects/${l.id}`} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-canvas">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{l.companyName}</p>
                      <p className="truncate text-xs text-muted">
                        {l.firstName} {l.lastName} · {LEAD_SOURCE_LABELS[l.source]} · {relativeTime(l.createdAt)}
                      </p>
                    </div>
                    <StageBadge stage={l.stage} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader title="Prochains appels" />
          {lists.upcomingCalls.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-muted">Aucun appel programmé.</p>
          ) : (
            <ul className="divide-y divide-line">
              {lists.upcomingCalls.map((c) => (
                <li key={c.id} className="px-5 py-3">
                  <Link href={`/admin/prospects/${c.id}`} className="text-sm font-medium hover:text-brand">
                    {c.companyName}
                  </Link>
                  <p className="text-xs text-muted">
                    {formatDateTime(c.nextCallAt)} ·{" "}
                    <a href={`tel:${c.phone.replace(/\s/g, "")}`} className="hover:text-ink">
                      {c.phone}
                    </a>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="xl:col-span-3">
          <CardHeader title="Projets en cours" action={<Link href="/admin/projets" className="text-sm font-medium text-brand">Tous les projets</Link>} />
          {lists.activeProjects.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-muted">Aucun projet en cours.</p>
          ) : (
            <ul className="grid divide-y divide-line md:grid-cols-2 md:divide-y-0">
              {lists.activeProjects.map((p) => {
                const progress = projectProgress(p);
                return (
                  <li key={p.id} className="md:border-b md:border-line md:odd:border-r">
                    <Link href={`/admin/projets/${p.id}`} className="block px-5 py-4 hover:bg-canvas">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-medium">{p.name}</p>
                        <ProjectStatusBadge status={p.status} />
                      </div>
                      <p className="mt-0.5 text-xs text-muted">
                        {p.client.companyName} {p.dueDate && `· livraison ${formatDate(p.dueDate)}`}
                      </p>
                      <div className="mt-2.5 flex items-center gap-2">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-canvas">
                          <div className="h-full rounded-full bg-brand" style={{ width: `${progress}%` }} />
                        </div>
                        <span className="text-xs tabular-nums text-muted">{progress} %</span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
