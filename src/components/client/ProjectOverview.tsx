import Link from "next/link";
import { ArrowRight, ExternalLink, FileText, MessageCircle, Upload } from "lucide-react";
import { clientTimeline, projectProgress, PROJECT_STATUS_LABELS, type ProjectStatusCode } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { buttonClass } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { ProgressBar, ProjectTimeline } from "./ProjectTimeline";

interface Props {
  project: {
    id: string;
    name: string;
    status: ProjectStatusCode;
    progressOverride: number | null;
    dueDate: Date | null;
    previewUrl: string | null;
    liveUrl: string | null;
    briefEnabled: boolean;
    contentReceivedAt: Date | null;
    brief: { status: string } | null;
  };
  counts?: { files: number; messages: number };
}

/** Résumé de l'avancement d'un projet, tel que vu par le client. */
export function ProjectOverview({ project: p, counts }: Props) {
  const progress = projectProgress(p);
  const briefSubmitted = p.brief?.status === "SUBMITTED";
  const steps = clientTimeline({ status: p.status, briefSubmitted, contentReceived: Boolean(p.contentReceivedAt) });
  const briefTodo = p.briefEnabled && !briefSubmitted;

  return (
    <div className="flex flex-col gap-4">
      {briefTodo && (
        <div className="flex flex-col gap-3 rounded-2xl bg-ink p-5 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium">Votre brief vous attend</p>
            <p className="text-sm text-white/70">Quelques questions pour que votre site vous ressemble. Sauvegarde automatique.</p>
          </div>
          <Link href={`/client/projets/${p.id}/brief`} className={buttonClass("secondary", "md", "bg-white text-ink ring-0 hover:bg-white/90")}>
            Remplir mon brief <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      )}
      {!p.briefEnabled && p.status === "BRIEF" && (
        <p className="rounded-2xl border border-line bg-white p-4 text-sm text-muted">Le brief détaillé sera disponible dès réception de l&apos;acompte. Vous pouvez déjà nous envoyer vos fichiers (logo, photos…).</p>
      )}

      <Card>
        <CardBody className="flex flex-col gap-6 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">{p.name}</h2>
              <p className="text-sm text-muted">
                Étape actuelle : <span className="font-medium text-ink">{PROJECT_STATUS_LABELS[p.status]}</span>
                {p.dueDate && p.status !== "DONE" && ` · livraison prévue le ${formatDate(p.dueDate)}`}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {p.previewUrl && (
                <a href={p.previewUrl} target="_blank" rel="noopener noreferrer" className={buttonClass("secondary", "sm")}>
                  Voir la preview <ExternalLink className="size-3.5" aria-hidden />
                </a>
              )}
              {p.liveUrl && (
                <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className={buttonClass("brand", "sm")}>
                  Voir mon site <ExternalLink className="size-3.5" aria-hidden />
                </a>
              )}
            </div>
          </div>
          <ProgressBar value={progress} />
          <ProjectTimeline steps={steps} />
        </CardBody>
      </Card>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {[
          { href: `/client/projets/${p.id}/brief`, label: "Brief", icon: FileText, hint: briefSubmitted ? "Envoyé" : p.briefEnabled ? "À compléter" : "Bientôt" },
          { href: `/client/projets/${p.id}?onglet=fichiers`, label: "Fichiers", icon: Upload, hint: counts ? `${counts.files} fichier${counts.files > 1 ? "s" : ""}` : "Déposer" },
          { href: `/client/projets/${p.id}?onglet=messages`, label: "Messages", icon: MessageCircle, hint: counts ? `${counts.messages}` : "Écrire" },
        ].map((l) => (
          <Link key={l.label} href={l.href} className="flex flex-col items-center gap-1 rounded-2xl border border-line bg-white p-3 text-center shadow-soft transition-shadow hover:shadow-lift sm:flex-row sm:gap-3 sm:p-4 sm:text-left">
            <span className="grid size-9 place-items-center rounded-xl bg-brand-soft text-brand">
              <l.icon className="size-4" aria-hidden />
            </span>
            <span>
              <span className="block text-sm font-medium">{l.label}</span>
              <span className="block text-xs text-muted">{l.hint}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
