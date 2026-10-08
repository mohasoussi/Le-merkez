"use client";

import { useActionState } from "react";
import { deleteFaqAction, saveFaqAction } from "@/server/actions/admin-content";
import type { ActionResult } from "@/server/actions/result";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { FormMessage } from "@/components/admin/FormMessage";
import { DeleteButton } from "./DeleteButton";

export function FaqForm({ v }: { v: { id: string | null; question: string; answer: string; isActive: boolean; sortOrder: number } }) {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(saveFaqAction.bind(null, v.id), null);
  const fe = state && !state.ok ? state.fieldErrors : undefined;
  const p = v.id ?? "new";
  return (
    <form action={action} className="flex flex-col gap-3">
      <Field label="Question" htmlFor={`f-q-${p}`} error={fe?.question}>
        <Input id={`f-q-${p}`} name="question" defaultValue={v.question} required className="text-sm" />
      </Field>
      <Field label="Réponse" htmlFor={`f-a-${p}`} error={fe?.answer}>
        <Textarea id={`f-a-${p}`} name="answer" defaultValue={v.answer} rows={4} required className="text-sm" />
      </Field>
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isActive" defaultChecked={v.isActive} className="size-4 accent-[var(--color-brand)]" /> Visible
        </label>
        <label className="flex items-center gap-2">
          Ordre <Input name="sortOrder" type="number" min={0} defaultValue={v.sortOrder} className="h-9 w-20 py-1 text-sm" aria-label="Ordre d'affichage" />
        </label>
      </div>
      <FormMessage state={state} />
      <div className="flex items-center justify-between gap-2">
        <Button type="submit" size="sm" pending={pending}>
          {v.id ? "Enregistrer" : "Ajouter la question"}
        </Button>
        {v.id && <DeleteButton action={() => deleteFaqAction(v.id!)} confirmText="Supprimer cette question ?" />}
      </div>
    </form>
  );
}
