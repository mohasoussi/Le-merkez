"use client";

import { useActionState, useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { changeProjectStatusAction, createProjectAction, deleteProjectAction, updateProjectAction } from "@/server/actions/admin-projects";
import type { ActionResult } from "@/server/actions/result";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { FormMessage } from "@/components/admin/FormMessage";
import { PROJECT_STATUSES, PROJECT_STATUS_LABELS, PROJECT_STATUS_PROGRESS, type ProjectStatusCode } from "@/lib/constants";

type State = ActionResult<unknown> | null;

export interface ProjectFormValues {
  name: string;
  offerId: string;
  price: string;
  startDate: string;
  dueDate: string;
  previewUrl: string;
  liveUrl: string;
  notes: string;
  progressOverride: number | null;
  briefEnabled: boolean;
  contentReceived: boolean;
}

export function ProjectForm({ mode, targetId, offers, values, status }: { mode: "create" | "edit"; targetId: string; offers: { id: string; name: string; priceCents: number }[]; values: ProjectFormValues; status?: ProjectStatusCode }) {
  const actionFn = mode === "create" ? createProjectAction.bind(null, targetId) : updateProjectAction.bind(null, targetId);
  const [state, action, pending] = useActionState<State, FormData>(actionFn, null);
  const [manual, setManual] = useState(values.progressOverride != null);
  const [price, setPrice] = useState(values.price);
  const fe = state && !state.ok ? state.fieldErrors : undefined;
  const auto = status ? PROJECT_STATUS_PROGRESS[status] : PROJECT_STATUS_PROGRESS.BRIEF;
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <Field label="Nom du projet" htmlFor="p-name" error={fe?.name} required className="sm:col-span-2">
        <Input id="p-name" name="name" defaultValue={values.name} required className="text-sm" />
      </Field>
      <Field label="Offre" htmlFor="p-offer">
        <Select
          id="p-offer"
          name="offerId"
          defaultValue={values.offerId}
          className="text-sm"
          onChange={(e) => {
            const o = offers.find((x) => x.id === e.target.value);
            if (o && !price) setPrice(String(o.priceCents / 100));
          }}
        >
          <option value="">Sur mesure</option>
          {offers.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Prix (€ TTC)" htmlFor="p-price" error={fe?.price ?? fe?.priceCents}>
        <Input id="p-price" name="price" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} className="text-sm" />
      </Field>
      <Field label="Date de début" htmlFor="p-start">
        <Input id="p-start" name="startDate" type="date" defaultValue={values.startDate} className="text-sm" />
      </Field>
      <Field label="Livraison prévue" htmlFor="p-due">
        <Input id="p-due" name="dueDate" type="date" defaultValue={values.dueDate} className="text-sm" />
      </Field>
      <Field label="URL de preview" htmlFor="p-preview" error={fe?.previewUrl}>
        <Input id="p-preview" name="previewUrl" type="url" placeholder="https://…" defaultValue={values.previewUrl} className="text-sm" />
      </Field>
      <Field label="URL finale" htmlFor="p-live" error={fe?.liveUrl}>
        <Input id="p-live" name="liveUrl" type="url" placeholder="https://…" defaultValue={values.liveUrl} className="text-sm" />
      </Field>
      <fieldset className="rounded-xl border border-line p-4 sm:col-span-2">
        <legend className="px-1 text-sm font-medium">Progression affichée au client</legend>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input type="radio" name="progressMode" value="auto" checked={!manual} onChange={() => setManual(false)} className="accent-[var(--color-brand)]" /> Automatique selon le statut ({auto} %)
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="progressMode" value="manual" checked={manual} onChange={() => setManual(true)} className="accent-[var(--color-brand)]" /> Manuelle
          </label>
          {manual && (
            <span className="flex items-center gap-2">
              <label htmlFor="p-progress" className="sr-only">
                Pourcentage
              </label>
              <Input id="p-progress" name="progress" type="number" min={0} max={100} defaultValue={values.progressOverride ?? auto} className="h-9 w-20 py-1 text-sm" /> %
            </span>
          )}
        </div>
      </fieldset>
      <div className="flex flex-col gap-2 sm:col-span-2">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="briefEnabled" defaultChecked={values.briefEnabled} className="size-4 accent-[var(--color-brand)]" /> Brief ouvert au client (automatique à l&apos;enregistrement de l&apos;acompte)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="contentReceived" defaultChecked={values.contentReceived} className="size-4 accent-[var(--color-brand)]" /> Contenus reçus (textes, photos, logo)
        </label>
      </div>
      <Field label="Notes internes (jamais visibles par le client)" htmlFor="p-notes" className="sm:col-span-2">
        <Textarea id="p-notes" name="notes" defaultValue={values.notes} rows={4} className="text-sm" />
      </Field>
      <div className="flex flex-col gap-3 sm:col-span-2">
        <FormMessage state={state} />
        <Button type="submit" pending={pending} className="self-start">
          {mode === "create" ? "Créer le projet" : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}

export function ProjectStatusForm({ projectId, status, hasClientAccount }: { projectId: string; status: ProjectStatusCode; hasClientAccount: boolean }) {
  const [state, action, pending] = useActionState<State, FormData>(changeProjectStatusAction.bind(null, projectId), null);
  const [value, setValue] = useState(status);
  return (
    <form action={action} className="flex flex-col gap-3">
      <ol className="grid grid-cols-1 gap-1.5" role="radiogroup" aria-label="Statut du projet">
        {PROJECT_STATUSES.map((s, i) => {
          const idx = PROJECT_STATUSES.indexOf(status);
          return (
            <li key={s}>
              <label className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 text-sm transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand/15 ${value === s ? "border-brand bg-brand-soft/60 font-medium" : "border-line hover:bg-canvas"}`}>
                <input type="radio" name="status" value={s} checked={value === s} onChange={() => setValue(s)} className="sr-only" />
                <span className={`grid size-5 place-items-center rounded-full text-[10px] font-semibold ${i < idx ? "bg-success text-white" : i === idx ? "bg-brand text-white" : "bg-canvas text-muted ring-1 ring-line"}`}>{i < idx ? "✓" : i + 1}</span>
                {PROJECT_STATUS_LABELS[s]}
              </label>
            </li>
          );
        })}
      </ol>
      {hasClientAccount && (
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="notify" defaultChecked className="size-4 accent-[var(--color-brand)]" /> Prévenir le client par email
        </label>
      )}
      <FormMessage state={state} />
      <Button type="submit" pending={pending} disabled={value === status}>
        Mettre à jour le statut
      </Button>
    </form>
  );
}

export function DeleteProjectButton({ projectId, clientId }: { projectId: string; clientId: string }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  return (
    <div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="text-danger hover:bg-danger-soft hover:text-danger"
        pending={pending}
        onClick={() => {
          if (!confirm("Supprimer définitivement ce projet, son brief, ses fichiers et ses messages ?")) return;
          start(async () => {
            const res = await deleteProjectAction(projectId, clientId);
            if (res && !res.ok) setError(res.error);
          });
        }}
      >
        <Trash2 className="size-4" aria-hidden /> Supprimer le projet
      </Button>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
