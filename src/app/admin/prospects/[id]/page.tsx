import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Mail, Phone } from "lucide-react";
import { requireAdminPage } from "@/server/auth/guards";
import { getLead, leadFinancials } from "@/server/services/leads";
import { getSettings } from "@/server/services/settings";
import { db } from "@/server/db";
import { AppError } from "@/server/errors";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProjectStatusBadge, QuoteStatusBadge, StageBadge } from "@/components/admin/Badges";
import { ActivityTimeline } from "@/components/admin/ActivityTimeline";
import { DefinitionList, ExternalLink } from "@/components/admin/DefinitionList";
import { ConvertForm, DeleteNoteButton, LeadDangerZone, LeadEditForm, NoteForm, StageForm } from "@/components/admin/lead/LeadForms";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { buttonClass } from "@/components/ui/Button";
import { BUDGET_LABELS, LEAD_SOURCE_LABELS, NEED_LABELS, PROJECT_TYPE_LABELS, SECTOR_LABELS, TIMELINE_LABELS, type NeedCode } from "@/lib/constants";
import { formatCents, formatDate, formatDateTime, toDateTimeInput } from "@/lib/format";

export const metadata: Metadata = { title: "Fiche prospect" };

async function load(id: string) {
  const actor = await requireAdminPage();
  try {
    return { actor, lead: await getLead(actor, id) };
  } catch (e) {
    if (e instanceof AppError && e.code === "NOT_FOUND") notFound();
    throw e;
  }
}

export default async function LeadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { lead } = await load(id);
  const [settings, offers] = await Promise.all([getSettings(), db.offer.findMany({ where: { type: "SITE" }, orderBy: { sortOrder: "asc" }, select: { id: true, name: true } })]);
  const fin = leadFinancials(lead, settings.depositPercent);

  return (
    <>
      <PageHeader
        back={{ href: "/admin/prospects", label: "Prospects" }}
        title={
          <span className="flex flex-wrap items-center gap-3">
            {lead.companyName} <StageBadge stage={lead.stage} />
            {lead.isDemo && <Badge>Donnée fictive</Badge>}
          </span>
        }
        description={`${lead.firstName} ${lead.lastName} · créé le ${formatDate(lead.createdAt)} · dernière interaction ${formatDateTime(lead.lastInteractionAt)}`}
        actions={
          <>
            <a href={`tel:${lead.phone.replace(/\s/g, "")}`} className={buttonClass("secondary", "sm")}>
              <Phone className="size-4" aria-hidden /> Appeler
            </a>
            <a href={`mailto:${lead.email}`} className={buttonClass("secondary", "sm")}>
              <Mail className="size-4" aria-hidden /> Email
            </a>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="flex min-w-0 flex-col gap-6">
          <Card>
            <CardHeader title="Le projet" description={`${PROJECT_TYPE_LABELS[lead.projectType]} · ${SECTOR_LABELS[lead.sector]}`} />
            <CardBody className="flex flex-col gap-5">
              <DefinitionList
                items={[
                  ["Budget", BUDGET_LABELS[lead.budget]],
                  ["Délai", TIMELINE_LABELS[lead.timeline]],
                  ["Activité", lead.activity],
                  ["Ville", `${lead.city}, ${lead.country}`],
                  ["Site actuel", <ExternalLink key="w" value={lead.currentWebsite} />],
                  ["Instagram", <ExternalLink key="i" value={lead.instagram} kind="instagram" />],
                  ["Facebook", <ExternalLink key="f" value={lead.facebook} />],
                  ["Autre réseau", lead.otherSocial],
                ]}
              />
              {lead.needs.length > 0 && (
                <div>
                  <p className="text-xs text-muted">Besoins</p>
                  <ul className="mt-1.5 flex flex-wrap gap-1.5">
                    {lead.needs.map((n) => (
                      <li key={n}>
                        <Badge tone="brand">{NEED_LABELS[n as NeedCode] ?? n}</Badge>
                      </li>
                    ))}
                    {lead.needsOther && <Badge>{lead.needsOther}</Badge>}
                  </ul>
                </div>
              )}
              <div>
                <p className="text-xs text-muted">Description</p>
                <p className="mt-1 whitespace-pre-line text-sm leading-relaxed">{lead.description || "—"}</p>
              </div>
              {lead.references && (
                <div>
                  <p className="text-xs text-muted">Sites de référence</p>
                  <p className="mt-1 whitespace-pre-line break-words text-sm leading-relaxed">{lead.references}</p>
                </div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Informations commerciales" description="Coordonnées, offre envisagée, montant du devis, appel." />
            <CardBody>
              <LeadEditForm
                leadId={lead.id}
                offers={offers}
                values={{
                  firstName: lead.firstName,
                  lastName: lead.lastName,
                  email: lead.email,
                  phone: lead.phone,
                  companyName: lead.companyName,
                  activity: lead.activity,
                  city: lead.city,
                  currentWebsite: lead.currentWebsite ?? "",
                  instagram: lead.instagram ?? "",
                  facebook: lead.facebook ?? "",
                  source: lead.source,
                  offerId: lead.offerId ?? "",
                  dealAmount: lead.dealAmountCents != null ? String(lead.dealAmountCents / 100) : "",
                  nextCallAt: toDateTimeInput(lead.nextCallAt),
                }}
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Historique" />
            <CardBody>
              <ActivityTimeline items={lead.activities} />
            </CardBody>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader title="Statut" />
            <CardBody className="flex flex-col gap-4">
              <StageForm key={lead.stage} leadId={lead.id} stage={lead.stage} />
              {lead.lostReason && lead.stage === "LOST" && <p className="text-sm text-muted">Raison : {lead.lostReason}</p>}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Client" />
            <CardBody>
              {lead.client ? (
                <div className="flex flex-col gap-3">
                  <Link href={`/admin/clients/${lead.client.id}`} className={buttonClass("secondary", "md")}>
                    Voir la fiche client <ArrowRight className="size-4" aria-hidden />
                  </Link>
                  {lead.client.projects.map((p) => (
                    <Link key={p.id} href={`/admin/projets/${p.id}`} className="flex items-center justify-between gap-2 rounded-xl border border-line px-3 py-2 text-sm hover:bg-canvas">
                      <span className="truncate">{p.name}</span>
                      <ProjectStatusBadge status={p.status} />
                    </Link>
                  ))}
                </div>
              ) : (
                <ConvertForm leadId={lead.id} />
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Finances" description={`Acompte de ${settings.depositPercent} % à la commande`} />
            <CardBody>
              <dl className="space-y-2 text-sm">
                {(
                  [
                    ["Montant du devis", formatCents(fin.quote)],
                    ["Acompte attendu", formatCents(fin.depositExpected)],
                    ["Acompte reçu", formatCents(fin.depositReceived)],
                    ["Total payé", formatCents(fin.paid)],
                  ] as const
                ).map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-2">
                    <dt className="text-muted">{k}</dt>
                    <dd className="tabular-nums">{v}</dd>
                  </div>
                ))}
                <div className="flex justify-between gap-2 border-t border-line pt-2 font-medium">
                  <dt>Solde restant</dt>
                  <dd className="tabular-nums">{formatCents(fin.balance)}</dd>
                </div>
              </dl>
              {lead.quotes.length > 0 && (
                <ul className="mt-4 space-y-1.5 border-t border-line pt-4">
                  {lead.quotes.map((q) => (
                    <li key={q.id}>
                      <Link href={`/admin/devis/${q.id}`} className="flex items-center justify-between gap-2 text-sm hover:text-brand">
                        <span>
                          {q.number} · {formatCents(q.totalTtcCents)}
                        </span>
                        <QuoteStatusBadge status={q.status} />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              <Link href={`/admin/devis/nouveau?prospect=${lead.id}`} className={buttonClass("secondary", "sm", "mt-4 w-full")}>
                Créer un devis
              </Link>
              {!lead.client && <p className="mt-3 text-xs text-muted">Les paiements s&apos;enregistrent une fois le prospect converti en client.</p>}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Notes internes" />
            <CardBody className="flex flex-col gap-4">
              <NoteForm leadId={lead.id} />
              {lead.notes.length > 0 && (
                <ul className="space-y-3">
                  {lead.notes.map((n) => (
                    <li key={n.id} className="rounded-xl bg-canvas p-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="whitespace-pre-line text-sm">{n.body}</p>
                        <DeleteNoteButton noteId={n.id} leadId={lead.id} />
                      </div>
                      <p className="mt-1.5 text-xs text-muted">
                        {n.author?.firstName ?? "—"} · {formatDateTime(n.createdAt)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Acquisition" />
            <CardBody>
              <DefinitionList
                items={[
                  ["Source", LEAD_SOURCE_LABELS[lead.source]],
                  ["utm_source", lead.utmSource],
                  ["utm_medium", lead.utmMedium],
                  ["utm_campaign", lead.utmCampaign],
                  ["Site référent", lead.referrer],
                  ["Page d'arrivée", lead.landingPath],
                  ["Consentement", `${formatDateTime(lead.consentAt)} (${lead.consentVersion})`],
                ]}
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Données personnelles" />
            <CardBody>
              <LeadDangerZone leadId={lead.id} canDelete={!lead.client} />
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
