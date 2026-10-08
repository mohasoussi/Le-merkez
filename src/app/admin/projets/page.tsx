import type { Metadata } from "next";
import Link from "next/link";
import { requireAdminPage } from "@/server/auth/guards";
import { listProjects } from "@/server/services/projects";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProjectStatusBadge } from "@/components/admin/Badges";
import { EmptyState } from "@/components/ui/States";
import { PROJECT_STATUSES, PROJECT_STATUS_LABELS, projectProgress, type ProjectStatusCode } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Projets" };

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const actor = await requireAdminPage();
  const { status: raw } = await searchParams;
  const status = PROJECT_STATUSES.includes(raw as ProjectStatusCode) ? (raw as ProjectStatusCode) : undefined;
  const projects = await listProjects(actor, { status });
  return (
    <>
      <PageHeader title="Projets" description="Pour créer un projet, ouvrez la fiche du client." />
      <nav aria-label="Filtrer par statut" className="relative -mx-1 mb-5 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {[undefined, ...PROJECT_STATUSES].map((s) => (
          <Link key={s ?? "all"} href={s ? `?status=${s}` : "?"} aria-current={s === status ? "page" : undefined} className={cn("whitespace-nowrap rounded-full border px-3 py-1.5 text-sm", s === status ? "border-ink bg-ink text-white" : "border-line bg-white text-ink-soft hover:border-ink/20")}>
            {s ? PROJECT_STATUS_LABELS[s] : "Tous"}
          </Link>
        ))}
      </nav>
      {projects.length === 0 ? (
        <EmptyState title="Aucun projet." description="Convertissez un prospect en client puis créez son projet." />
      ) : (
        <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((p) => {
            const progress = projectProgress(p);
            return (
              <li key={p.id} className="min-w-0">
                <Link href={`/admin/projets/${p.id}`} className="block h-full rounded-2xl border border-line bg-white p-5 shadow-soft transition-shadow hover:shadow-lift">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{p.name}</p>
                      <p className="truncate text-sm text-muted">{p.client.companyName}</p>
                    </div>
                    <ProjectStatusBadge status={p.status} />
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-canvas">
                      <div className="h-full rounded-full bg-brand" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="text-xs tabular-nums text-muted">{progress} %</span>
                  </div>
                  <p className="mt-3 text-xs text-muted">
                    {p.offer?.name ?? "Sur mesure"} · brief {p.brief?.status === "SUBMITTED" ? "reçu" : "en attente"} · {p._count.files} fichier{p._count.files > 1 ? "s" : ""} · {p._count.messages} message{p._count.messages > 1 ? "s" : ""}
                    {p.dueDate && ` · livraison ${formatDate(p.dueDate)}`}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
