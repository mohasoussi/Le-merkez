import type { Metadata } from "next";
import Link from "next/link";
import { requireAdminPage } from "@/server/auth/guards";
import { listQuotes } from "@/server/services/quotes";
import { PageHeader } from "@/components/admin/PageHeader";
import { QuoteStatusBadge } from "@/components/admin/Badges";
import { EmptyState } from "@/components/ui/States";
import { formatCents, formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Devis" };

export default async function QuotesPage() {
  const actor = await requireAdminPage();
  const quotes = await listQuotes(actor);
  return (
    <>
      <PageHeader title="Devis" description="Pour créer un devis, ouvrez la fiche du prospect (bouton « Créer un devis »)." />
      {quotes.length === 0 ? (
        <EmptyState title="Aucun devis pour le moment." />
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
          {quotes.map((q) => (
            <li key={q.id}>
              <Link href={`/admin/devis/${q.id}`} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3.5 hover:bg-canvas">
                <span className="w-32 font-mono text-sm">{q.number}</span>
                <span className="min-w-0 flex-1 truncate text-sm">{q.lead.companyName}</span>
                <span className="text-sm tabular-nums">{formatCents(q.totalTtcCents)}</span>
                <span className="w-24 text-xs text-muted">{formatDate(q.issueDate)}</span>
                <QuoteStatusBadge status={q.status} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
