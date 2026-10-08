import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdminPage } from "@/server/auth/guards";
import { getQuote } from "@/server/services/quotes";
import { getSettings } from "@/server/services/settings";
import { PrintButton } from "./PrintButton";
import { formatCents, formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Devis", robots: { index: false } };
export const dynamic = "force-dynamic";

/** Version imprimable A4 : « Imprimer → Enregistrer en PDF » depuis le navigateur. */
export default async function PrintQuotePage({ params }: { params: Promise<{ id: string }> }) {
  const actor = await requireAdminPage();
  const { id } = await params;
  const [q, s] = await Promise.all([getQuote(actor, id).catch(() => notFound()), getSettings()]);
  const c = q.lead.client ?? q.lead;
  return (
    <div className="min-h-dvh bg-canvas py-8 print:bg-white print:py-0">
      <div className="mx-auto mb-4 flex max-w-[210mm] justify-end px-4 print:hidden">
        <PrintButton />
      </div>
      <article className="mx-auto max-w-[210mm] bg-white p-10 text-sm text-ink shadow-soft print:max-w-none print:p-0 print:shadow-none">
        <header className="flex justify-between gap-8">
          <div>
            <p className="text-xl font-semibold">{s.legalName || s.brandName}</p>
            <p className="mt-1 whitespace-pre-line text-muted">
              {[s.legalForm, s.address, s.contactEmail, s.phone, s.siret && `SIRET ${s.siret}`, s.vatNumber && `TVA ${s.vatNumber}`].filter(Boolean).join("\n")}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-semibold">DEVIS</p>
            <p className="font-mono">{q.number}</p>
            <p className="mt-2 text-muted">Date : {formatDate(q.issueDate)}</p>
            <p className="text-muted">Valable jusqu&apos;au : {formatDate(q.validUntil)}</p>
          </div>
        </header>
        <section className="mt-10 ml-auto w-1/2 rounded-lg border border-line p-4">
          <p className="font-medium">{c.companyName}</p>
          <p>
            {c.firstName} {c.lastName}
          </p>
          <p className="text-muted">{c.email}</p>
          {c.phone && <p className="text-muted">{c.phone}</p>}
          {c.city && <p className="text-muted">{c.city}</p>}
        </section>
        <table className="mt-10 w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-ink text-left">
              <th className="py-2">Prestation</th>
              <th className="py-2 text-right">Qté</th>
              <th className="py-2 text-right">Prix unitaire HT</th>
              <th className="py-2 text-right">Total HT</th>
            </tr>
          </thead>
          <tbody>
            {q.items.map((i) => (
              <tr key={i.id} className="border-b border-line align-top">
                <td className="py-3 pr-4">
                  <p className="font-medium">{i.label}</p>
                  {i.description && <p className="mt-0.5 text-xs text-muted">{i.description}</p>}
                </td>
                <td className="py-3 text-right tabular-nums">{i.quantity}</td>
                <td className="py-3 text-right tabular-nums">{formatCents(i.unitPriceCents)}</td>
                <td className="py-3 text-right tabular-nums">{formatCents(i.unitPriceCents * i.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <dl className="mt-6 ml-auto w-64 space-y-1">
          <div className="flex justify-between">
            <dt>Total HT</dt>
            <dd className="tabular-nums">{formatCents(q.totalHtCents)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>TVA ({(q.vatRateBps / 100).toLocaleString("fr-FR")} %)</dt>
            <dd className="tabular-nums">{formatCents(q.totalVatCents)}</dd>
          </div>
          <div className="flex justify-between border-t-2 border-ink pt-1 text-base font-semibold">
            <dt>Total TTC</dt>
            <dd className="tabular-nums">{formatCents(q.totalTtcCents)}</dd>
          </div>
        </dl>
        {q.vatRateBps === 0 && s.vatMention && <p className="mt-2 text-right text-xs text-muted">{s.vatMention}</p>}
        {q.notes && <p className="mt-10 whitespace-pre-line">{q.notes}</p>}
        <p className="mt-6 text-xs text-muted">
          Acompte de {s.depositPercent} % à la commande ({formatCents(Math.round((q.totalTtcCents * s.depositPercent) / 100))}), solde à la livraison.
        </p>
        <div className="mt-12 grid grid-cols-2 gap-8 text-xs text-muted">
          <p>Bon pour accord — date et signature du client :</p>
        </div>
      </article>
    </div>
  );
}
