import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { requireClientPage } from "@/server/auth/guards";
import { listProjectsForClient } from "@/server/services/projects";
import { ProjectOverview } from "@/components/client/ProjectOverview";
import { ProjectStatusBadge } from "@/components/admin/Badges";
import { EmptyState } from "@/components/ui/States";
import { projectProgress } from "@/lib/constants";

export default async function ClientHome() {
  const actor = await requireClientPage();
  const projects = await listProjectsForClient(actor);
  return (
    <>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Bonjour {actor.firstName}</h1>
        <p className="mt-1 text-muted">{projects.length > 1 ? "Voici l'état d'avancement de vos projets." : "Voici l'état d'avancement de votre projet."}</p>
      </div>
      {projects.length === 0 ? (
        <EmptyState title="Votre projet sera bientôt visible ici." description="Dès qu'il sera créé, vous pourrez suivre son avancement, remplir votre brief et nous envoyer vos fichiers." />
      ) : projects.length === 1 ? (
        <ProjectOverview project={projects[0]!} />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {projects.map((p) => (
            <li key={p.id} className="min-w-0">
              <Link href={`/client/projets/${p.id}`} className="block rounded-2xl border border-line bg-white p-5 shadow-soft hover:shadow-lift">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium">{p.name}</p>
                  <ProjectStatusBadge status={p.status} />
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-canvas">
                  <div className="h-full rounded-full bg-brand" style={{ width: `${projectProgress(p)}%` }} />
                </div>
                <p className="mt-3 flex items-center gap-1 text-sm font-medium text-brand">
                  Suivre le projet <ArrowRight className="size-4" aria-hidden />
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
