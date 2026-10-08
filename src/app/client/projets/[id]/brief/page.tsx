import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Lock } from "lucide-react";
import { requireClientPage } from "@/server/auth/guards";
import { getBrief } from "@/server/services/briefs";
import { AppError } from "@/server/errors";
import { BriefEditor } from "@/components/project/BriefEditor";
import { BriefView } from "@/components/project/BriefView";
import { Card, CardBody } from "@/components/ui/Card";
import { Alert } from "@/components/ui/States";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = { title: "Mon brief" };

export default async function ClientBriefPage({ params }: { params: Promise<{ id: string }> }) {
  const actor = await requireClientPage();
  const { id } = await params;
  const { project, brief, data } = await getBrief(actor, id).catch((e) => {
    if (e instanceof AppError && e.code === "NOT_FOUND") notFound();
    throw e;
  });

  return (
    <>
      <Link href={`/client/projets/${id}`} className="mb-3 inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
        <ChevronLeft className="size-4" aria-hidden /> {project.name}
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">Mon brief</h1>
      <p className="mb-6 mt-1 text-muted">Ces informations nous permettent de créer un site qui vous ressemble.</p>

      {!project.briefEnabled ? (
        <Card>
          <CardBody className="flex flex-col items-center gap-3 py-12 text-center">
            <Lock className="size-6 text-muted" aria-hidden />
            <p className="font-medium">Le brief sera disponible après la réception de l&apos;acompte.</p>
            <Link href={`/client/projets/${id}?onglet=fichiers`} className="text-sm font-medium text-brand">
              En attendant, déposez vos fichiers
            </Link>
          </CardBody>
        </Card>
      ) : brief.status === "SUBMITTED" ? (
        <div className="flex flex-col gap-4">
          <Alert tone="success">Brief envoyé le {formatDateTime(brief.submittedAt)}. Merci ! Pour le modifier, écrivez-nous un message.</Alert>
          <Card>
            <CardBody>
              <BriefView data={data} />
            </CardBody>
          </Card>
        </div>
      ) : (
        <BriefEditor projectId={id} initial={data} onSubmittedHref={`/client/projets/${id}`} />
      )}
    </>
  );
}
