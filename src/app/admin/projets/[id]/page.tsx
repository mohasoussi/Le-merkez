import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { requireAdminPage } from "@/server/auth/guards";
import { getProjectForAdmin } from "@/server/services/projects";
import { db } from "@/server/db";
import { AppError } from "@/server/errors";
import { env } from "@/server/env";
import { ACCEPT_ATTRIBUTE } from "@/server/storage/file-types";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProjectStatusBadge } from "@/components/admin/Badges";
import { ActivityTimeline } from "@/components/admin/ActivityTimeline";
import { DeleteProjectButton, ProjectForm, ProjectStatusForm } from "@/components/admin/project/ProjectForms";
import { ReopenBriefButton } from "@/components/admin/project/ReopenBriefButton";
import { FileManager } from "@/components/project/FileManager";
import { MessageThread } from "@/components/project/MessageThread";
import { BriefView } from "@/components/project/BriefView";
import { BriefEditor } from "@/components/project/BriefEditor";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { buttonClass } from "@/components/ui/Button";
import { briefDataSchema } from "@/lib/validation/brief";
import { projectProgress } from "@/lib/constants";
import { formatDateTime, toDateInput } from "@/lib/format";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Projet" };

const TABS = [
  ["apercu", "Aperçu"],
  ["brief", "Brief"],
  ["fichiers", "Fichiers"],
  ["messages", "Messages"],
  ["historique", "Historique"],
] as const;

export default async function AdminProjectPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ onglet?: string; modifier?: string }> }) {
  const actor = await requireAdminPage();
  const [{ id }, { onglet, modifier }] = await Promise.all([params, searchParams]);
  const project = await getProjectForAdmin(actor, id).catch((e) => {
    if (e instanceof AppError && e.code === "NOT_FOUND") notFound();
    throw e;
  });
  const tab = TABS.some(([k]) => k === onglet) ? onglet! : "apercu";
  const progress = projectProgress(project);
  const hasAccount = project.client.users.some((u) => u.passwordHash);
  const briefData = briefDataSchema.parse(project.brief?.data ?? {});

  return (
    <>
      <PageHeader
        back={{ href: `/admin/clients/${project.clientId}`, label: project.client.companyName }}
        title={
          <span className="flex flex-wrap items-center gap-3">
            {project.name} <ProjectStatusBadge status={project.status} />
          </span>
        }
        description={`${project.offer?.name ?? "Sur mesure"} · ${progress} % · brief ${project.brief?.status === "SUBMITTED" ? "reçu" : project.briefEnabled ? "en cours côté client" : "pas encore ouvert"}`}
        actions={
          <>
            {project.previewUrl && (
              <a href={project.previewUrl} target="_blank" rel="noopener noreferrer" className={buttonClass("secondary", "sm")}>
                Preview <ExternalLink className="size-3.5" aria-hidden />
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={buttonClass("secondary", "sm")}>
                Site en ligne <ExternalLink className="size-3.5" aria-hidden />
              </a>
            )}
          </>
        }
      />

      <nav aria-label="Sections du projet" className="-mx-1 mb-6 flex gap-1 overflow-x-auto border-b border-line px-1">
        {TABS.map(([key, label]) => {
          const count = key === "fichiers" ? project.files.length : key === "messages" ? project.messages.length : null;
          return (
            <Link key={key} href={`?onglet=${key}`} aria-current={tab === key ? "page" : undefined} className={cn("-mb-px whitespace-nowrap border-b-2 px-3 py-2.5 text-sm", tab === key ? "border-ink font-medium text-ink" : "border-transparent text-muted hover:text-ink")}>
              {label}
              {count ? <span className="ml-1.5 rounded-full bg-canvas px-1.5 text-xs">{count}</span> : null}
            </Link>
          );
        })}
      </nav>

      {tab === "apercu" && (
        <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
          <Card>
            <CardHeader title="Détails du projet" />
            <CardBody>
              <ProjectForm
                mode="edit"
                targetId={project.id}
                status={project.status}
                offers={await db.offer.findMany({ where: { type: "SITE" }, orderBy: { sortOrder: "asc" }, select: { id: true, name: true, priceCents: true } })}
                values={{
                  name: project.name,
                  offerId: project.offerId ?? "",
                  price: project.priceCents != null ? String(project.priceCents / 100) : "",
                  startDate: toDateInput(project.startDate),
                  dueDate: toDateInput(project.dueDate),
                  previewUrl: project.previewUrl ?? "",
                  liveUrl: project.liveUrl ?? "",
                  notes: project.notes ?? "",
                  progressOverride: project.progressOverride,
                  briefEnabled: project.briefEnabled,
                  contentReceived: Boolean(project.contentReceivedAt),
                }}
              />
            </CardBody>
          </Card>
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader title="Statut" description="Visible par le client dans sa timeline." />
              <CardBody>
                <ProjectStatusForm projectId={project.id} status={project.status} hasClientAccount={hasAccount} />
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <DeleteProjectButton projectId={project.id} clientId={project.clientId} />
              </CardBody>
            </Card>
          </div>
        </div>
      )}

      {tab === "brief" && (
        <Card>
          <CardHeader
            title="Brief client"
            description={project.brief?.status === "SUBMITTED" ? `Envoyé le ${formatDateTime(project.brief.submittedAt)}` : `Brouillon — dernière modification ${formatDateTime(project.brief?.updatedAt)}`}
            action={project.brief?.status === "SUBMITTED" ? <ReopenBriefButton projectId={project.id} /> : <Badge tone="warning">Brouillon</Badge>}
          />
          <CardBody>
            {modifier === "1" ? (
              <BriefEditor projectId={project.id} initial={briefData} />
            ) : (
              <>
                <BriefView data={briefData} />
                <Link href="?onglet=brief&modifier=1" className={buttonClass("secondary", "sm", "mt-6")}>
                  Compléter le brief (par l&apos;équipe)
                </Link>
              </>
            )}
          </CardBody>
        </Card>
      )}

      {tab === "fichiers" && (
        <Card>
          <CardHeader title="Fichiers" description="Fichiers déposés par le client et par l'équipe." />
          <CardBody>
            <FileManager
              projectId={project.id}
              accept={ACCEPT_ATTRIBUTE}
              maxMb={env().UPLOAD_MAX_MB}
              files={project.files.map((f) => ({ id: f.id, originalName: f.originalName, category: f.category, sizeBytes: f.sizeBytes, mimeType: f.mimeType, createdAt: f.createdAt.toISOString(), uploadedBy: f.uploadedBy, canDelete: true }))}
            />
          </CardBody>
        </Card>
      )}

      {tab === "messages" && (
        <Card>
          <CardHeader title="Messages" description={hasAccount ? "Le client est prévenu par email à chaque nouveau message." : "Le client n'a pas encore activé son espace."} />
          <CardBody>
            <MessageThread
              projectId={project.id}
              currentUserId={actor.id}
              teamLabel="équipe"
              messages={project.messages.map((m) => ({ id: m.id, body: m.body, createdAt: m.createdAt.toISOString(), author: m.author }))}
            />
          </CardBody>
        </Card>
      )}

      {tab === "historique" && (
        <Card>
          <CardHeader title="Historique du projet" />
          <CardBody>
            <ActivityTimeline items={project.activities} />
          </CardBody>
        </Card>
      )}
    </>
  );
}
