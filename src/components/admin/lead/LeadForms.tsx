"use client";

import { useActionState, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Download, Trash2, UserCheck } from "lucide-react";
import { addNoteAction, changeStageAction, convertLeadAction, createLeadAction, deleteLeadAction, deleteNoteAction, exportLeadDataAction, updateLeadAction } from "@/server/actions/admin-leads";
import type { ActionResult } from "@/server/actions/result";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { FormMessage } from "@/components/admin/FormMessage";
import { BUDGETS, BUDGET_LABELS, LEAD_SOURCES, LEAD_SOURCE_LABELS, PIPELINE_STAGES, PIPELINE_STAGE_LABELS, PROJECT_TYPES, PROJECT_TYPE_LABELS, SECTORS, SECTOR_LABELS, type PipelineStageCode } from "@/lib/constants";

type State = ActionResult<unknown> | null;

export function StageForm({ leadId, stage }: { leadId: string; stage: PipelineStageCode }) {
  const [state, action, pending] = useActionState<State, FormData>(changeStageAction.bind(null, leadId), null);
  const [value, setValue] = useState(stage);
  return (
    <form action={action} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <label htmlFor="stage" className="sr-only">
          Statut
        </label>
        <Select id="stage" name="stage" value={value} onChange={(e) => setValue(e.target.value as PipelineStageCode)} className="h-10 py-2 text-sm">
          {PIPELINE_STAGES.map((s) => (
            <option key={s} value={s}>
              {PIPELINE_STAGE_LABELS[s]}
            </option>
          ))}
        </Select>
        <Button type="submit" size="md" className="h-10" pending={pending} disabled={value === stage}>
          Changer
        </Button>
      </div>
      {value === "LOST" && value !== stage && <Input name="lostReason" placeholder="Raison (facultatif)" className="h-10 py-2 text-sm" />}
      <FormMessage state={state} />
    </form>
  );
}

interface LeadEditProps {
  leadId: string;
  offers: { id: string; name: string }[];
  values: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    companyName: string;
    activity: string;
    city: string;
    currentWebsite: string;
    instagram: string;
    facebook: string;
    source: string;
    offerId: string;
    dealAmount: string;
    nextCallAt: string;
  };
}

export function LeadEditForm({ leadId, offers, values }: LeadEditProps) {
  const [state, action, pending] = useActionState<State, FormData>(updateLeadAction.bind(null, leadId), null);
  const fe = state && !state.ok ? state.fieldErrors : undefined;
  const text = (name: keyof LeadEditProps["values"], label: string, props: React.ComponentProps<"input"> = {}) => (
    <Field label={label} htmlFor={`lead-${name}`} error={fe?.[name]}>
      <Input id={`lead-${name}`} name={name} defaultValue={values[name]} aria-invalid={!!fe?.[name]} className="text-sm" {...props} />
    </Field>
  );
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      {text("firstName", "Prénom", { required: true })}
      {text("lastName", "Nom", { required: true })}
      {text("email", "Email", { type: "email", required: true })}
      {text("phone", "Téléphone", { type: "tel" })}
      {text("companyName", "Entreprise", { required: true })}
      {text("activity", "Activité")}
      {text("city", "Ville")}
      {text("currentWebsite", "Site actuel")}
      {text("instagram", "Instagram")}
      {text("facebook", "Facebook")}
      <Field label="Source" htmlFor="lead-source">
        <Select id="lead-source" name="source" defaultValue={values.source} className="text-sm">
          {LEAD_SOURCES.map((s) => (
            <option key={s} value={s}>
              {LEAD_SOURCE_LABELS[s]}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Offre envisagée" htmlFor="lead-offer">
        <Select id="lead-offer" name="offerId" defaultValue={values.offerId} className="text-sm">
          <option value="">— Aucune —</option>
          {offers.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </Select>
      </Field>
      {text("dealAmount", "Montant du devis (€ TTC)", { inputMode: "decimal", placeholder: "Ex. 990" })}
      {text("nextCallAt", "Appel programmé", { type: "datetime-local" })}
      <div className="flex flex-col gap-3 sm:col-span-2">
        <FormMessage state={state} />
        <Button type="submit" pending={pending} className="self-start">
          Enregistrer
        </Button>
      </div>
    </form>
  );
}

export function NoteForm({ leadId }: { leadId: string }) {
  const [state, action, pending] = useActionState<State, FormData>(async (prev: State, fd: FormData) => {
    const res = await addNoteAction(leadId, prev, fd);
    return res;
  }, null);
  return (
    <form action={action} className="flex flex-col gap-2">
      <label htmlFor="note-body" className="sr-only">
        Nouvelle note
      </label>
      <Textarea id="note-body" name="body" rows={3} placeholder="Compte rendu d'appel, besoin précis, relance…" className="min-h-20 text-sm" required maxLength={5000} />
      {state && !state.ok && <FormMessage state={state} />}
      <Button type="submit" size="sm" variant="secondary" pending={pending} className="self-end">
        Ajouter la note
      </Button>
    </form>
  );
}

export function DeleteNoteButton({ noteId, leadId }: { noteId: string; leadId: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => confirm("Supprimer cette note ?") && start(async () => void (await deleteNoteAction(noteId, leadId)))}
      className="rounded p-1 text-muted hover:text-danger"
      aria-label="Supprimer la note"
    >
      <Trash2 className="size-3.5" />
    </button>
  );
}

export function ConvertForm({ leadId }: { leadId: string }) {
  const [state, action, pending] = useActionState<State, FormData>(convertLeadAction.bind(null, leadId), null);
  return (
    <form action={action} className="flex flex-col gap-3">
      <p className="text-sm text-muted">Les informations du prospect sont reprises automatiquement : aucune ressaisie. L&apos;historique est conservé.</p>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="createProject" defaultChecked className="size-4 accent-[var(--color-brand)]" /> Créer aussi le projet
      </label>
      <FormMessage state={state} />
      <Button type="submit" variant="brand" pending={pending}>
        <UserCheck className="size-4" aria-hidden /> Convertir en client
      </Button>
    </form>
  );
}

export function LeadDangerZone({ leadId, canDelete }: { leadId: string; canDelete: boolean }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() =>
          start(async () => {
            const res = await exportLeadDataAction(leadId);
            if (!res.ok || !res.data) return setError(res.ok ? "Export impossible." : res.error);
            const url = URL.createObjectURL(new Blob([res.data], { type: "application/json" }));
            const a = Object.assign(document.createElement("a"), { href: url, download: `donnees-prospect-${leadId}.json` });
            a.click();
            URL.revokeObjectURL(url);
          })
        }
      >
        <Download className="size-4" aria-hidden /> Exporter ses données (RGPD)
      </Button>
      {canDelete && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-danger hover:bg-danger-soft hover:text-danger"
          pending={pending}
          onClick={() => {
            if (!confirm("Supprimer définitivement ce prospect et tout son historique ? Cette action est irréversible.")) return;
            start(async () => {
              const res = await deleteLeadAction(leadId);
              if (res && !res.ok) setError(res.error);
              else router.refresh();
            });
          }}
        >
          <Trash2 className="size-4" aria-hidden /> Supprimer définitivement
        </Button>
      )}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}

export function NewLeadForm() {
  const [state, action, pending] = useActionState<State, FormData>(createLeadAction, null);
  const fe = state && !state.ok ? state.fieldErrors : undefined;
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <Field label="Prénom" htmlFor="firstName" error={fe?.firstName} required>
        <Input id="firstName" name="firstName" required />
      </Field>
      <Field label="Nom" htmlFor="lastName" error={fe?.lastName} required>
        <Input id="lastName" name="lastName" required />
      </Field>
      <Field label="Email" htmlFor="email" error={fe?.email} required>
        <Input id="email" name="email" type="email" required />
      </Field>
      <Field label="Téléphone" htmlFor="phone" error={fe?.phone}>
        <Input id="phone" name="phone" type="tel" />
      </Field>
      <Field label="Entreprise" htmlFor="companyName" error={fe?.companyName} required>
        <Input id="companyName" name="companyName" required />
      </Field>
      <Field label="Activité" htmlFor="activity" error={fe?.activity}>
        <Input id="activity" name="activity" />
      </Field>
      <Field label="Ville" htmlFor="city" error={fe?.city}>
        <Input id="city" name="city" />
      </Field>
      <Field label="Source" htmlFor="source">
        <Select id="source" name="source" defaultValue="REFERRAL">
          {LEAD_SOURCES.map((s) => (
            <option key={s} value={s}>
              {LEAD_SOURCE_LABELS[s]}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Type de projet" htmlFor="projectType">
        <Select id="projectType" name="projectType" defaultValue="NEW_SITE">
          {PROJECT_TYPES.map((s) => (
            <option key={s} value={s}>
              {PROJECT_TYPE_LABELS[s]}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Secteur" htmlFor="sector">
        <Select id="sector" name="sector" defaultValue="OTHER">
          {SECTORS.map((s) => (
            <option key={s} value={s}>
              {SECTOR_LABELS[s]}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Budget" htmlFor="budget">
        <Select id="budget" name="budget" defaultValue="FROM_500_TO_1000">
          {BUDGETS.map((s) => (
            <option key={s} value={s}>
              {BUDGET_LABELS[s]}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Description du besoin" htmlFor="description" className="sm:col-span-2">
        <Textarea id="description" name="description" rows={4} />
      </Field>
      <div className="flex flex-col gap-3 sm:col-span-2">
        <FormMessage state={state} />
        <Button type="submit" pending={pending} className="self-start">
          Créer le prospect
        </Button>
      </div>
    </form>
  );
}
