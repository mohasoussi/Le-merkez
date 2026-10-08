import type { Metadata } from "next";
import Link from "next/link";
import { requireAdminPage } from "@/server/auth/guards";
import { listPipeline } from "@/server/services/leads";
import { PageHeader } from "@/components/admin/PageHeader";
import { PipelineBoard } from "@/components/admin/PipelineBoard";
import { buttonClass } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/States";

export const metadata: Metadata = { title: "Pipeline" };

export default async function PipelinePage() {
  const actor = await requireAdminPage();
  const leads = await listPipeline(actor);
  return (
    <>
      <PageHeader
        title="Pipeline"
        description="Glissez-déposez les prospects d'une étape à l'autre (appui long sur mobile)."
        actions={
          <Link href="/admin/prospects/nouveau" className={buttonClass("primary", "sm")}>
            Ajouter un prospect
          </Link>
        }
      />
      {leads.length === 0 ? (
        <EmptyState title="Aucun prospect pour le moment." description="Partagez le lien de votre formulaire sur vos réseaux : chaque demande arrivera ici." />
      ) : (
        <PipelineBoard
          initial={leads.map((l) => ({
            id: l.id,
            firstName: l.firstName,
            lastName: l.lastName,
            companyName: l.companyName,
            stage: l.stage,
            budget: l.budget,
            sector: l.sector,
            dealAmountCents: l.dealAmountCents,
            nextCallAt: l.nextCallAt?.toISOString() ?? null,
            isDemo: l.isDemo,
            offerName: l.offer?.name ?? null,
          }))}
        />
      )}
    </>
  );
}
