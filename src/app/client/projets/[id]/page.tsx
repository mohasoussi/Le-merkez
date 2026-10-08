import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { requireClientPage } from "@/server/auth/guards";
import { getProjectForClient } from "@/server/services/projects";
import { AppError } from "@/server/errors";
import { env } from "@/server/env";
import { ACCEPT_ATTRIBUTE } from "@/server/storage/file-types";
import { ProjectOverview } from "@/components/client/ProjectOverview";
import { FileManager } from "@/components/project/FileManager";
import { MessageThread } from "@/components/project/MessageThread";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

const TABS = [
  ["suivi", "Suivi"],
  ["fichiers", "Fichiers"],
  ["messages", "Messages"],
] as const;

export default async function ClientProjectPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ onglet?: string }> }) {
  const actor = await requireClientPage();
  const [{ id }, { onglet }] = await Promise.all([params, searchParams]);
  const project = await getProjectForClient(actor, id).catch((e) => {
    if (e instanceof AppError && e.code === "NOT_FOUND") notFound();
    throw e;
  });
  const tab = TABS.some(([k]) => k === onglet) ? onglet! : "suivi";

  return (
    <>
      <Link href="/client" className="mb-3 inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
        <ChevronLeft className="size-4" aria-hidden /> Mes projets
      </Link>
      <h1 className="mb-5 text-2xl font-semibold tracking-tight">{project.name}</h1>
      <nav aria-label="Sections du projet" className="mb-6 flex gap-1 border-b border-line">
        {TABS.map(([key, label]) => (
          <Link key={key} href={`?onglet=${key}`} aria-current={tab === key ? "page" : undefined} className={cn("-mb-px border-b-2 px-3 py-2.5 text-sm", tab === key ? "border-ink font-medium" : "border-transparent text-muted hover:text-ink")}>
            {label}
          </Link>
        ))}
        <Link href={`/client/projets/${id}/brief`} className="-mb-px border-b-2 border-transparent px-3 py-2.5 text-sm text-muted hover:text-ink">
          Brief
        </Link>
      </nav>

      {tab === "suivi" && <ProjectOverview project={project} counts={{ files: project.files.length, messages: project.messages.length }} />}

      {tab === "fichiers" && (
        <Card>
          <CardHeader title="Mes fichiers" description="Logo, photos, textes, charte graphique, documents… Nous les retrouvons immédiatement de notre côté." />
          <CardBody>
            <FileManager
              projectId={project.id}
              accept={ACCEPT_ATTRIBUTE}
              maxMb={env().UPLOAD_MAX_MB}
              files={project.files.map((f) => ({
                id: f.id,
                originalName: f.originalName,
                category: f.category,
                sizeBytes: f.sizeBytes,
                mimeType: f.mimeType,
                createdAt: f.createdAt.toISOString(),
                uploadedBy: f.uploadedBy,
                canDelete: f.uploadedBy?.role === "CLIENT",
              }))}
            />
          </CardBody>
        </Card>
      )}

      {tab === "messages" && (
        <Card>
          <CardHeader title="Messages" description="Échangez avec nous au sujet de votre projet." />
          <CardBody>
            <MessageThread projectId={project.id} currentUserId={actor.id} teamLabel="équipe" messages={project.messages.map((m) => ({ id: m.id, body: m.body, createdAt: m.createdAt.toISOString(), author: m.author }))} />
          </CardBody>
        </Card>
      )}
    </>
  );
}
