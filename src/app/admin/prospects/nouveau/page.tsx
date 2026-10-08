import type { Metadata } from "next";
import { requireAdminPage } from "@/server/auth/guards";
import { PageHeader } from "@/components/admin/PageHeader";
import { NewLeadForm } from "@/components/admin/lead/LeadForms";
import { Card, CardBody } from "@/components/ui/Card";

export const metadata: Metadata = { title: "Nouveau prospect" };

export default async function NewLeadPage() {
  await requireAdminPage();
  return (
    <>
      <PageHeader back={{ href: "/admin/prospects", label: "Prospects" }} title="Ajouter un prospect" description="Pour un contact reçu par téléphone, recommandation, message privé…" />
      <Card className="max-w-3xl">
        <CardBody>
          <NewLeadForm />
        </CardBody>
      </Card>
    </>
  );
}
