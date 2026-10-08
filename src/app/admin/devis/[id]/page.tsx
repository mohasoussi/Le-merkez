import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Printer } from "lucide-react";
import { requireAdminPage } from "@/server/auth/guards";
import { getQuote } from "@/server/services/quotes";
import { db } from "@/server/db";
import { PageHeader } from "@/components/admin/PageHeader";
import { QuoteStatusBadge } from "@/components/admin/Badges";
import { QuoteEditor } from "@/components/admin/quote/QuoteEditor";
import { QuoteActions } from "@/components/admin/quote/QuoteActions";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { buttonClass } from "@/components/ui/Button";
import { formatDate, toDateInput } from "@/lib/format";

export const metadata: Metadata = { title: "Devis" };

export default async function QuotePage({ params }: { params: Promise<{ id: string }> }) {
  const actor = await requireAdminPage();
  const { id } = await params;
  const q = await getQuote(actor, id).catch(() => notFound());
  const [offers, options] = await Promise.all([db.offer.findMany({ where: { type: "SITE" }, orderBy: { sortOrder: "asc" } }), db.offerOption.findMany({ orderBy: { sortOrder: "asc" } })]);
  return (
    <>
      <PageHeader
        back={{ href: `/admin/prospects/${q.leadId}`, label: q.lead.companyName }}
        title={
          <span className="flex flex-wrap items-center gap-3">
            Devis {q.number} <QuoteStatusBadge status={q.status} />
          </span>
        }
        description={`Émis le ${formatDate(q.issueDate)} · valable jusqu'au ${formatDate(q.validUntil)}${q.sentAt ? ` · envoyé le ${formatDate(q.sentAt)}` : ""}`}
        actions={
          <a href={`/imprimer/devis/${q.id}`} target="_blank" className={buttonClass("secondary", "sm")}>
            <Printer className="size-4" aria-hidden /> Imprimer / PDF
          </a>
        }
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
        <Card>
          <CardBody>
            <QuoteEditor
              target={{ quoteId: q.id }}
              readOnly={q.status === "ACCEPTED"}
              catalog={{ offers, options }}
              initial={{ validUntil: toDateInput(q.validUntil), vatRateBps: q.vatRateBps, notes: q.notes ?? "", items: q.items }}
            />
          </CardBody>
        </Card>
        <Card className="self-start">
          <CardHeader title="Statut" description="« Envoyé » et « Accepté » mettent à jour le montant et l'étape du prospect." />
          <CardBody>
            <QuoteActions quoteId={q.id} status={q.status} />
          </CardBody>
        </Card>
      </div>
    </>
  );
}
