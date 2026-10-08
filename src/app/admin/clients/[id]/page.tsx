import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Plus } from "lucide-react";
import { requireAdminPage } from "@/server/auth/guards";
import { getClient } from "@/server/services/clients";
import { leadFinancials } from "@/server/services/leads";
import { getSettings } from "@/server/services/settings";
import { db } from "@/server/db";
import { AppError } from "@/server/errors";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProjectStatusBadge } from "@/components/admin/Badges";
import { ActivityTimeline } from "@/components/admin/ActivityTimeline";
import { AccessForm, ClientEditForm, DeleteClientButton, ToggleUserButton } from "@/components/admin/client/ClientForms";
import { DeletePaymentButton, PaymentForm, SubscriptionCreateForm, SubscriptionEditForm } from "@/components/admin/client/FinanceForms";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { buttonClass } from "@/components/ui/Button";
import { PAYMENT_KIND_LABELS, PAYMENT_METHOD_LABELS, SUBSCRIPTION_STATUS_LABELS, projectProgress } from "@/lib/constants";
import { formatCents, formatDate, formatDateTime } from "@/lib/format";

export const metadata: Metadata = { title: "Fiche client" };

export default async function ClientPage({ params }: { params: Promise<{ id: string }> }) {
  const actor = await requireAdminPage();
  const { id } = await params;
  const client = await getClient(actor, id).catch((e) => {
    if (e instanceof AppError && e.code === "NOT_FOUND") notFound();
    throw e;
  });
  const [settings, plans] = await Promise.all([getSettings(), db.offer.findMany({ where: { type: "MAINTENANCE", isActive: true }, orderBy: { sortOrder: "asc" } })]);
  const fin = leadFinancials({ dealAmountCents: client.lead?.dealAmountCents ?? (client.projects.reduce((s, p) => s + (p.priceCents ?? 0), 0) || null), client }, settings.depositPercent);
  const account = client.users[0];

  return (
    <>
      <PageHeader
        back={{ href: "/admin/clients", label: "Clients" }}
        title={
          <span className="flex flex-wrap items-center gap-3">
            {client.companyName} {client.isDemo && <Badge>Donnée fictive</Badge>}
          </span>
        }
        description={`${client.firstName} ${client.lastName} · client depuis le ${formatDate(client.createdAt)}`}
        actions={
          <>
            {client.lead && (
              <Link href={`/admin/prospects/${client.lead.id}`} className={buttonClass("secondary", "sm")}>
                Fiche prospect
              </Link>
            )}
            <Link href={`/admin/projets/nouveau?client=${client.id}`} className={buttonClass("primary", "sm")}>
              <Plus className="size-4" aria-hidden /> Nouveau projet
            </Link>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="flex min-w-0 flex-col gap-6">
          <Card>
            <CardHeader title="Projets" />
            {client.projects.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-muted">Aucun projet. Créez-en un pour démarrer la production.</p>
            ) : (
              <ul className="divide-y divide-line">
                {client.projects.map((p) => (
                  <li key={p.id}>
                    <Link href={`/admin/projets/${p.id}`} className="flex items-center gap-4 px-5 py-4 hover:bg-canvas">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{p.name}</p>
                        <p className="text-xs text-muted">
                          {p.offer?.name ?? "Sur mesure"} · {formatCents(p.priceCents)} · {projectProgress(p)} %
                        </p>
                      </div>
                      <ProjectStatusBadge status={p.status} />
                      <ArrowRight className="size-4 text-muted" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <CardHeader title="Paiements" description={`Acompte attendu (${settings.depositPercent} %) : ${formatCents(fin.depositExpected)} · reçu : ${formatCents(fin.depositReceived)} · solde : ${formatCents(fin.balance)}`} />
            <CardBody className="flex flex-col gap-5">
              {client.payments.length > 0 && (
                <ul className="divide-y divide-line rounded-xl border border-line">
                  {client.payments.map((p) => (
                    <li key={p.id} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                      <div className="min-w-0">
                        <p>
                          <span className="font-medium tabular-nums">{formatCents(p.amountCents)}</span> · {PAYMENT_KIND_LABELS[p.kind]}
                        </p>
                        <p className="truncate text-xs text-muted">
                          {formatDate(p.paidAt)} · {PAYMENT_METHOD_LABELS[p.method]}
                          {p.project && ` · ${p.project.name}`}
                          {p.reference && ` · ${p.reference}`}
                        </p>
                      </div>
                      <DeletePaymentButton paymentId={p.id} />
                    </li>
                  ))}
                </ul>
              )}
              <PaymentForm clientId={client.id} projects={client.projects.map((p) => ({ id: p.id, name: p.name }))} suggestedDeposit={fin.depositReceived === 0 && fin.depositExpected ? String(fin.depositExpected / 100) : undefined} />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Maintenance" />
            <CardBody className="flex flex-col gap-5">
              {client.subscriptions.map((s) => (
                <div key={s.id} className="rounded-xl border border-line p-4">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">
                      {s.planName} · depuis le {formatDate(s.startDate)}
                    </p>
                    <Badge tone={s.status === "ACTIVE" ? "success" : "neutral"}>{SUBSCRIPTION_STATUS_LABELS[s.status]}</Badge>
                  </div>
                  <SubscriptionEditForm sub={s} />
                </div>
              ))}
              {plans.length > 0 ? <SubscriptionCreateForm clientId={client.id} plans={plans} /> : <p className="text-sm text-muted">Aucune formule de maintenance active (voir Offres).</p>}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Informations" />
            <CardBody>
              <ClientEditForm
                clientId={client.id}
                values={{
                  firstName: client.firstName,
                  lastName: client.lastName,
                  email: client.email,
                  phone: client.phone ?? "",
                  companyName: client.companyName,
                  activity: client.activity ?? "",
                  address: client.address ?? "",
                  city: client.city ?? "",
                  country: client.country,
                  website: client.website ?? "",
                  notes: client.notes ?? "",
                }}
              />
            </CardBody>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader title="Espace client" />
            <CardBody className="flex flex-col gap-4">
              {client.users.map((u) => (
                <div key={u.id} className="flex items-center justify-between gap-2 rounded-xl bg-canvas px-3 py-2.5 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{u.email}</p>
                    <p className="text-xs text-muted">{!u.isActive ? "Désactivé" : u.passwordHash ? (u.lastLoginAt ? `Dernière connexion ${formatDateTime(u.lastLoginAt)}` : "Activé, jamais connecté") : "Invitation en attente"}</p>
                  </div>
                  <ToggleUserButton clientId={client.id} userId={u.id} isActive={u.isActive} />
                </div>
              ))}
              <AccessForm clientId={client.id} defaultEmail={account?.email ?? client.email} hasAccount={Boolean(account)} />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Historique" />
            <CardBody>
              <ActivityTimeline items={client.activities} />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Données personnelles" />
            <CardBody>
              <DeleteClientButton clientId={client.id} />
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
