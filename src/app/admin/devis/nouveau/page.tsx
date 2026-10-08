import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdminPage } from "@/server/auth/guards";
import { quoteDefaults } from "@/server/services/quotes";
import { db } from "@/server/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { QuoteEditor } from "@/components/admin/quote/QuoteEditor";
import { Card, CardBody } from "@/components/ui/Card";
import { toDateInput } from "@/lib/format";

export const metadata: Metadata = { title: "Nouveau devis" };

export default async function NewQuotePage({ searchParams }: { searchParams: Promise<{ prospect?: string }> }) {
  await requireAdminPage();
  const { prospect } = await searchParams;
  if (!prospect) notFound();
  const d = await quoteDefaults(prospect).catch(() => notFound());
  const [offers, options] = await Promise.all([db.offer.findMany({ where: { type: "SITE" }, orderBy: { sortOrder: "asc" } }), db.offerOption.findMany({ orderBy: { sortOrder: "asc" } })]);
  return (
    <>
      <PageHeader back={{ href: `/admin/prospects/${d.lead.id}`, label: d.lead.companyName }} title="Nouveau devis" description={`Pour ${d.lead.firstName} ${d.lead.lastName} — ${d.lead.companyName}`} />
      <Card className="max-w-4xl">
        <CardBody>
          <QuoteEditor target={{ leadId: d.lead.id }} catalog={{ offers, options }} initial={{ validUntil: toDateInput(d.validUntil), vatRateBps: d.vatRateBps, notes: "", items: d.items }} />
        </CardBody>
      </Card>
    </>
  );
}
