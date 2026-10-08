"use client";

import { useActionState } from "react";
import { deleteOfferAction, deleteOptionAction, saveOfferAction, saveOptionAction } from "@/server/actions/admin-content";
import type { ActionResult } from "@/server/actions/result";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { FormMessage } from "@/components/admin/FormMessage";
import { DeleteButton } from "./DeleteButton";

type State = ActionResult<unknown> | null;

export interface OfferValues {
  id: string | null;
  name: string;
  tagline: string;
  price: string;
  priceLabel: string;
  features: string;
  highlighted: boolean;
  isActive: boolean;
  sortOrder: number;
  type: "SITE" | "MAINTENANCE";
}

export function OfferForm({ v }: { v: OfferValues }) {
  const [state, action, pending] = useActionState<State, FormData>(saveOfferAction.bind(null, v.id), null);
  const fe = state && !state.ok ? state.fieldErrors : undefined;
  const p = v.id ?? "new";
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="type" value={v.type} />
      <Field label="Nom" htmlFor={`o-name-${p}`} error={fe?.name}>
        <Input id={`o-name-${p}`} name="name" defaultValue={v.name} required className="text-sm" />
      </Field>
      <div className="grid grid-cols-[1fr_1.4fr] gap-2">
        <Field label={v.type === "MAINTENANCE" ? "Prix / mois (€)" : "Prix (€)"} htmlFor={`o-price-${p}`} error={fe?.price}>
          <Input id={`o-price-${p}`} name="price" inputMode="decimal" defaultValue={v.price} required className="text-sm" />
        </Field>
        <Field label="Mention avant le prix" htmlFor={`o-pl-${p}`}>
          <Input id={`o-pl-${p}`} name="priceLabel" defaultValue={v.priceLabel} placeholder="à partir de" className="text-sm" />
        </Field>
      </div>
      {v.type === "SITE" && (
        <Field label="Accroche" htmlFor={`o-tag-${p}`} className="sm:col-span-2">
          <Input id={`o-tag-${p}`} name="tagline" defaultValue={v.tagline} className="text-sm" />
        </Field>
      )}
      <Field label="Contenu (une ligne par élément)" htmlFor={`o-feat-${p}`} className="sm:col-span-2">
        <Textarea id={`o-feat-${p}`} name="features" defaultValue={v.features} rows={5} className="text-sm" />
      </Field>
      <div className="flex flex-wrap items-center gap-4 text-sm sm:col-span-2">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isActive" defaultChecked={v.isActive} className="size-4 accent-[var(--color-brand)]" /> Visible sur le site
        </label>
        {v.type === "SITE" && (
          <label className="flex items-center gap-2">
            <input type="checkbox" name="highlighted" defaultChecked={v.highlighted} className="size-4 accent-[var(--color-brand)]" /> Mise en avant
          </label>
        )}
        <label className="flex items-center gap-2">
          Ordre <Input name="sortOrder" type="number" min={0} defaultValue={v.sortOrder} className="h-9 w-20 py-1 text-sm" aria-label="Ordre d'affichage" />
        </label>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 sm:col-span-2">
        <Button type="submit" size="sm" pending={pending}>
          {v.id ? "Enregistrer" : "Ajouter"}
        </Button>
        {v.id && <DeleteButton action={() => deleteOfferAction(v.id!)} confirmText="Supprimer cette offre ?" />}
      </div>
      <div className="sm:col-span-2">
        <FormMessage state={state} />
      </div>
    </form>
  );
}

export function OptionForm({ v }: { v: { id: string | null; name: string; description: string; price: string; isActive: boolean; sortOrder: number } }) {
  const [state, action, pending] = useActionState<State, FormData>(saveOptionAction.bind(null, v.id), null);
  const p = v.id ?? "new";
  return (
    <form action={action} className="grid gap-2 sm:grid-cols-[1.2fr_1.6fr_7rem_auto_auto] sm:items-end">
      <Field label="Option" htmlFor={`op-n-${p}`}>
        <Input id={`op-n-${p}`} name="name" defaultValue={v.name} required className="h-10 py-2 text-sm" />
      </Field>
      <Field label="Description" htmlFor={`op-d-${p}`}>
        <Input id={`op-d-${p}`} name="description" defaultValue={v.description} className="h-10 py-2 text-sm" />
      </Field>
      <Field label="Prix (€)" htmlFor={`op-p-${p}`} hint="Vide = sur devis">
        <Input id={`op-p-${p}`} name="price" inputMode="decimal" defaultValue={v.price} className="h-10 py-2 text-sm" />
      </Field>
      <input type="hidden" name="sortOrder" value={v.sortOrder} />
      <label className="flex h-10 items-center gap-2 text-sm">
        <input type="checkbox" name="isActive" defaultChecked={v.isActive} className="size-4 accent-[var(--color-brand)]" /> Visible
      </label>
      <div className="flex h-10 items-center gap-1">
        <Button type="submit" size="sm" variant="secondary" pending={pending}>
          {v.id ? "OK" : "Ajouter"}
        </Button>
        {v.id && <DeleteButton action={() => deleteOptionAction(v.id!)} confirmText="Supprimer cette option ?" />}
      </div>
      {state && (
        <div className="sm:col-span-5">
          <FormMessage state={state} />
        </div>
      )}
    </form>
  );
}

