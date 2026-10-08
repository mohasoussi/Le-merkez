"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import { saveQuoteAction } from "@/server/actions/admin-quotes";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { Alert } from "@/components/ui/States";
import { quoteTotals } from "@/lib/quote-math";
import { formatCents, parseEuroToCents } from "@/lib/format";

interface Item {
  key: string;
  label: string;
  description: string;
  quantity: string;
  unitPrice: string;
  offerId?: string | null;
  optionId?: string | null;
}

interface Props {
  target: { quoteId?: string; leadId?: string };
  initial: { validUntil: string; vatRateBps: number; notes: string; items: { label: string; description: string | null; quantity: number; unitPriceCents: number; offerId?: string | null; optionId?: string | null }[] };
  catalog: { offers: { id: string; name: string; priceCents: number; features: string[] }[]; options: { id: string; name: string; description: string | null; priceCents: number | null }[] };
  readOnly?: boolean;
}

// Clés déterministes pour les lignes initiales (identiques serveur/navigateur), aléatoires pour les lignes ajoutées.
const key = () => `n-${Math.random().toString(36).slice(2, 10)}`;

export function QuoteEditor({ target, initial, catalog, readOnly }: Props) {
  const [items, setItems] = useState<Item[]>(
    initial.items.map((i, idx) => ({ key: `i-${idx}`, label: i.label, description: i.description ?? "", quantity: String(i.quantity), unitPrice: String(i.unitPriceCents / 100), offerId: i.offerId, optionId: i.optionId })),
  );
  const [validUntil, setValidUntil] = useState(initial.validUntil);
  const [vat, setVat] = useState(String(initial.vatRateBps));
  const [notes, setNotes] = useState(initial.notes);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();

  const parsed = items.map((i) => ({ quantity: Math.max(1, Number(i.quantity) || 1), unitPriceCents: parseEuroToCents(i.unitPrice) ?? 0 }));
  const totals = quoteTotals(parsed.map((p) => ({ ...p, unitPriceCents: Number.isNaN(p.unitPriceCents) ? 0 : p.unitPriceCents })), Number(vat));
  const upd = (key: string, patch: Partial<Item>) => setItems((list) => list.map((i) => (i.key === key ? { ...i, ...patch } : i)));

  function addFromCatalog(value: string) {
    if (!value) return;
    const [type, id] = value.split(":");
    if (type === "offer") {
      const o = catalog.offers.find((x) => x.id === id)!;
      setItems((l) => [...l, { key: key(), label: `Site ${o.name}`, description: o.features.join(" · "), quantity: "1", unitPrice: String(o.priceCents / 100), offerId: o.id }]);
    } else if (type === "option") {
      const o = catalog.options.find((x) => x.id === id)!;
      setItems((l) => [...l, { key: key(), label: o.name, description: o.description ?? "", quantity: "1", unitPrice: o.priceCents != null ? String(o.priceCents / 100) : "", optionId: o.id }]);
    } else setItems((l) => [...l, { key: key(), label: "", description: "", quantity: "1", unitPrice: "" }]);
  }

  function save() {
    setMessage(null);
    const invalid = items.find((i) => Number.isNaN(parseEuroToCents(i.unitPrice)) || !i.label.trim());
    if (invalid) return setMessage({ ok: false, text: "Chaque ligne doit avoir un libellé et un prix valide." });
    start(async () => {
      const res = await saveQuoteAction(target, {
        validUntil: new Date(`${validUntil}T12:00:00`),
        vatRateBps: Number(vat),
        notes: notes || null,
        items: items.map((i, idx) => ({ label: i.label, description: i.description || null, quantity: parsed[idx]!.quantity, unitPriceCents: parsed[idx]!.unitPriceCents ?? 0, offerId: i.offerId ?? null, optionId: i.optionId ?? null })),
      });
      if (res) setMessage(res.ok ? { ok: true, text: res.message ?? "Enregistré." } : { ok: false, text: res.error });
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <ul className="flex flex-col gap-3">
        {items.map((i, idx) => (
          <li key={i.key} className="grid gap-2 rounded-xl border border-line p-3 sm:grid-cols-[1fr_5rem_8rem_auto] sm:items-start">
            <div className="flex flex-col gap-2">
              <label className="sr-only" htmlFor={`l-${i.key}`}>
                Libellé ligne {idx + 1}
              </label>
              <Input id={`l-${i.key}`} value={i.label} onChange={(e) => upd(i.key, { label: e.target.value })} placeholder="Prestation" disabled={readOnly} className="h-10 py-2 text-sm" />
              <label className="sr-only" htmlFor={`d-${i.key}`}>
                Description ligne {idx + 1}
              </label>
              <Textarea id={`d-${i.key}`} value={i.description} onChange={(e) => upd(i.key, { description: e.target.value })} placeholder="Détail (facultatif)" rows={2} disabled={readOnly} className="min-h-0 text-sm" />
            </div>
            <div className="grid grid-cols-[5rem_1fr_auto] gap-2 sm:contents">
              <Input aria-label={`Quantité ligne ${idx + 1}`} type="number" min={1} value={i.quantity} onChange={(e) => upd(i.key, { quantity: e.target.value })} disabled={readOnly} className="h-10 py-2 text-sm" />
              <Input aria-label={`Prix unitaire HT ligne ${idx + 1} (€)`} inputMode="decimal" value={i.unitPrice} onChange={(e) => upd(i.key, { unitPrice: e.target.value })} placeholder="Prix HT €" disabled={readOnly} className="h-10 py-2 text-sm" />
              {!readOnly && (
                <button type="button" onClick={() => setItems((l) => l.filter((x) => x.key !== i.key))} className="grid size-10 place-items-center rounded-lg text-muted hover:bg-danger-soft hover:text-danger" aria-label={`Supprimer la ligne ${idx + 1}`}>
                  <Trash2 className="size-4" />
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      {!readOnly && (
        <div className="flex items-center gap-2">
          <Plus className="size-4 text-muted" aria-hidden />
          <label htmlFor="catalog" className="sr-only">
            Ajouter une ligne
          </label>
          <Select id="catalog" value="" onChange={(e) => addFromCatalog(e.target.value)} className="h-10 max-w-xs py-2 text-sm">
            <option value="">Ajouter une ligne…</option>
            <option value="free:">Ligne libre</option>
            <optgroup label="Offres">
              {catalog.offers.map((o) => (
                <option key={o.id} value={`offer:${o.id}`}>
                  {o.name} — {formatCents(o.priceCents)}
                </option>
              ))}
            </optgroup>
            <optgroup label="Options">
              {catalog.options.map((o) => (
                <option key={o.id} value={`option:${o.id}`}>
                  {o.name} {o.priceCents != null ? `— ${formatCents(o.priceCents)}` : "(sur devis)"}
                </option>
              ))}
            </optgroup>
          </Select>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Valable jusqu'au" htmlFor="q-valid">
          <Input id="q-valid" type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} disabled={readOnly} className="text-sm" />
        </Field>
        <Field label="TVA" htmlFor="q-vat">
          <Select id="q-vat" value={vat} onChange={(e) => setVat(e.target.value)} disabled={readOnly} className="text-sm">
            <option value="0">Non applicable (0 %)</option>
            <option value="550">5,5 %</option>
            <option value="1000">10 %</option>
            <option value="2000">20 %</option>
          </Select>
        </Field>
        <Field label="Conditions / notes" htmlFor="q-notes" className="sm:col-span-2">
          <Textarea id="q-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} disabled={readOnly} className="text-sm" placeholder="Ex. Acompte de 50 % à la commande, solde à la livraison." />
        </Field>
      </div>

      <dl className="ml-auto w-full max-w-xs space-y-1.5 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">Total HT</dt>
          <dd className="tabular-nums">{formatCents(totals.totalHtCents)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">TVA</dt>
          <dd className="tabular-nums">{formatCents(totals.totalVatCents)}</dd>
        </div>
        <div className="flex justify-between border-t border-line pt-1.5 text-base font-semibold">
          <dt>Total TTC</dt>
          <dd className="tabular-nums">{formatCents(totals.totalTtcCents)}</dd>
        </div>
      </dl>

      {message && <Alert tone={message.ok ? "success" : "danger"}>{message.text}</Alert>}
      {!readOnly && (
        <Button type="button" onClick={save} pending={pending} className="self-start" disabled={items.length === 0}>
          Enregistrer le devis
        </Button>
      )}
    </div>
  );
}
