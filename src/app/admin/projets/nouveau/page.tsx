import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdminPage } from "@/server/auth/guards";
import { db } from "@/server/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { ProjectForm } from "@/components/admin/project/ProjectForms";
import { Card, CardBody } from "@/components/ui/Card";
import { toDateInput } from "@/lib/format";

export const metadata: Metadata = { title: "Nouveau projet" };

export default async function NewProjectPage({ searchParams }: { searchParams: Promise<{ client?: string }> }) {
  await requireAdminPage();
  const { client: clientId } = await searchParams;
  const client = clientId ? await db.client.findUnique({ where: { id: clientId }, include: { lead: { select: { offerId: true, dealAmountCents: true } } } }) : null;
  if (!client) notFound();
  const offers = await db.offer.findMany({ where: { type: "SITE" }, orderBy: { sortOrder: "asc" }, select: { id: true, name: true, priceCents: true } });
  const offer = offers.find((o) => o.id === client.lead?.offerId);
  return (
    <>
      <PageHeader back={{ href: `/admin/clients/${client.id}`, label: client.companyName }} title="Nouveau projet" />
      <Card className="max-w-3xl">
        <CardBody>
          <ProjectForm
            mode="create"
            targetId={client.id}
            offers={offers}
            values={{
              name: `Site ${client.companyName}`,
              offerId: offer?.id ?? "",
              price: client.lead?.dealAmountCents != null ? String(client.lead.dealAmountCents / 100) : offer ? String(offer.priceCents / 100) : "",
              startDate: toDateInput(new Date()),
              dueDate: "",
              previewUrl: "",
              liveUrl: "",
              notes: "",
              progressOverride: null,
              briefEnabled: false,
              contentReceived: false,
            }}
          />
        </CardBody>
      </Card>
    </>
  );
}
