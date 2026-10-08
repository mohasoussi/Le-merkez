"use client";

import { useActionState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { createSubscriptionAction, deletePaymentAction, recordPaymentAction, updateSubscriptionAction } from "@/server/actions/admin-finance";
import type { ActionResult } from "@/server/actions/result";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Field";
import { FormMessage } from "@/components/admin/FormMessage";
import { PAYMENT_KINDS, PAYMENT_KIND_LABELS, PAYMENT_METHODS, PAYMENT_METHOD_LABELS, SUBSCRIPTION_STATUSES, SUBSCRIPTION_STATUS_LABELS } from "@/lib/constants";
import { toDateInput } from "@/lib/format";

type State = ActionResult<unknown> | null;
const small = "h-10 py-2 text-sm";

export function PaymentForm({ clientId, projects, suggestedDeposit }: { clientId: string; projects: { id: string; name: string }[]; suggestedDeposit?: string }) {
  const [state, action, pending] = useActionState<State, FormData>(recordPaymentAction.bind(null, clientId), null);
  const fe = state && !state.ok ? state.fieldErrors : undefined;
  return (
    <form action={action} className="grid gap-3 sm:grid-cols-2">
      <Field label="Type" htmlFor="pay-kind">
        <Select id="pay-kind" name="kind" defaultValue="DEPOSIT" className={small}>
          {PAYMENT_KINDS.map((k) => (
            <option key={k} value={k}>
              {PAYMENT_KIND_LABELS[k]}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Montant (€)" htmlFor="pay-amount" error={fe?.amount ?? fe?.amountCents}>
        <Input id="pay-amount" name="amount" inputMode="decimal" required defaultValue={suggestedDeposit} className={small} />
      </Field>
      <Field label="Date" htmlFor="pay-date">
        <Input id="pay-date" name="paidAt" type="date" defaultValue={toDateInput(new Date())} className={small} />
      </Field>
      <Field label="Moyen" htmlFor="pay-method">
        <Select id="pay-method" name="method" defaultValue="TRANSFER" className={small}>
          {PAYMENT_METHODS.map((k) => (
            <option key={k} value={k}>
              {PAYMENT_METHOD_LABELS[k]}
            </option>
          ))}
        </Select>
      </Field>
      {projects.length > 0 && (
        <Field label="Projet" htmlFor="pay-project">
          <Select id="pay-project" name="projectId" defaultValue={projects.length === 1 ? projects[0]!.id : ""} className={small}>
            <option value="">—</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>
        </Field>
      )}
      <Field label="Référence" htmlFor="pay-ref">
        <Input id="pay-ref" name="reference" placeholder="N° de virement, facture…" className={small} />
      </Field>
      <div className="flex flex-col gap-2 sm:col-span-2">
        <FormMessage state={state} />
        <Button type="submit" size="sm" pending={pending} className="self-start">
          Enregistrer le paiement
        </Button>
        <p className="text-xs text-muted">Un acompte enregistré ouvre automatiquement le brief au client.</p>
      </div>
    </form>
  );
}

export function DeletePaymentButton({ paymentId }: { paymentId: string }) {
  const [pending, start] = useTransition();
  return (
    <button type="button" disabled={pending} onClick={() => confirm("Supprimer ce paiement ?") && start(async () => void (await deletePaymentAction(paymentId)))} className="rounded p-1 text-muted hover:text-danger" aria-label="Supprimer le paiement">
      <Trash2 className="size-3.5" />
    </button>
  );
}

export function SubscriptionCreateForm({ clientId, plans }: { clientId: string; plans: { id: string; name: string; priceCents: number }[] }) {
  const [state, action, pending] = useActionState<State, FormData>(createSubscriptionAction.bind(null, clientId), null);
  return (
    <form action={action} className="grid gap-3 sm:grid-cols-2">
      <Field label="Formule" htmlFor="sub-plan">
        <Select id="sub-plan" name="offerId" required className={small}>
          {plans.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} — {(p.priceCents / 100).toLocaleString("fr-FR")} €/mois
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Prix négocié (€/mois)" htmlFor="sub-price" hint="Vide = prix de la formule">
        <Input id="sub-price" name="price" inputMode="decimal" className={small} />
      </Field>
      <Field label="Début" htmlFor="sub-start">
        <Input id="sub-start" name="startDate" type="date" defaultValue={toDateInput(new Date())} className={small} />
      </Field>
      <Field label="Prochaine échéance" htmlFor="sub-next" hint="Vide = dans un mois">
        <Input id="sub-next" name="nextDueDate" type="date" className={small} />
      </Field>
      <div className="flex flex-col gap-2 sm:col-span-2">
        <FormMessage state={state} />
        <Button type="submit" size="sm" variant="secondary" pending={pending} className="self-start">
          Ajouter la maintenance
        </Button>
      </div>
    </form>
  );
}

export function SubscriptionEditForm({ sub }: { sub: { id: string; status: string; priceCents: number; nextDueDate: Date | null; notes: string | null } }) {
  const [state, action, pending] = useActionState<State, FormData>(updateSubscriptionAction.bind(null, sub.id), null);
  return (
    <form action={action} className="grid grid-cols-2 gap-2 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end">
      <Field label="Statut" htmlFor={`s-status-${sub.id}`}>
        <Select id={`s-status-${sub.id}`} name="status" defaultValue={sub.status} className={small}>
          {SUBSCRIPTION_STATUSES.map((s) => (
            <option key={s} value={s}>
              {SUBSCRIPTION_STATUS_LABELS[s]}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="€/mois" htmlFor={`s-price-${sub.id}`}>
        <Input id={`s-price-${sub.id}`} name="price" inputMode="decimal" defaultValue={String(sub.priceCents / 100)} className={small} />
      </Field>
      <Field label="Échéance" htmlFor={`s-next-${sub.id}`}>
        <Input id={`s-next-${sub.id}`} name="nextDueDate" type="date" defaultValue={toDateInput(sub.nextDueDate)} className={small} />
      </Field>
      <input type="hidden" name="notes" value={sub.notes ?? ""} />
      <Button type="submit" size="sm" variant="secondary" pending={pending} className="h-10">
        OK
      </Button>
      {state && <div className="col-span-full"><FormMessage state={state} /></div>}
    </form>
  );
}
