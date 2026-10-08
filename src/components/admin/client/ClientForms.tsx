"use client";

import { useActionState, useState, useTransition } from "react";
import { Check, Copy, KeyRound, Trash2 } from "lucide-react";
import { createAccessAction, deleteClientAction, toggleClientUserAction, updateClientAction } from "@/server/actions/admin-clients";
import type { ActionResult } from "@/server/actions/result";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { FormMessage } from "@/components/admin/FormMessage";

type State = ActionResult<unknown> | null;

export function ClientEditForm({ clientId, values }: { clientId: string; values: Record<string, string> }) {
  const [state, action, pending] = useActionState<State, FormData>(updateClientAction.bind(null, clientId), null);
  const fe = state && !state.ok ? state.fieldErrors : undefined;
  const f = (name: string, label: string, props: React.ComponentProps<"input"> = {}) => (
    <Field label={label} htmlFor={`c-${name}`} error={fe?.[name]}>
      <Input id={`c-${name}`} name={name} defaultValue={values[name]} className="text-sm" {...props} />
    </Field>
  );
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      {f("firstName", "Prénom", { required: true })}
      {f("lastName", "Nom", { required: true })}
      {f("email", "Email", { type: "email", required: true })}
      {f("phone", "Téléphone", { type: "tel" })}
      {f("companyName", "Entreprise", { required: true })}
      {f("activity", "Activité")}
      {f("address", "Adresse")}
      {f("city", "Ville")}
      {f("country", "Pays")}
      {f("website", "Site")}
      <Field label="Notes internes" htmlFor="c-notes" className="sm:col-span-2">
        <Textarea id="c-notes" name="notes" defaultValue={values.notes} rows={3} className="text-sm" />
      </Field>
      <div className="flex flex-col gap-3 sm:col-span-2">
        <FormMessage state={state} />
        <Button type="submit" pending={pending} className="self-start">
          Enregistrer
        </Button>
      </div>
    </form>
  );
}

export function AccessForm({ clientId, defaultEmail, hasAccount }: { clientId: string; defaultEmail: string; hasAccount: boolean }) {
  const [state, action, pending] = useActionState<ActionResult<{ link: string; emailSent: boolean }> | null, FormData>(createAccessAction.bind(null, clientId), null);
  const [copied, setCopied] = useState(false);
  const link = state?.ok ? state.data?.link : undefined;
  return (
    <form action={action} className="flex flex-col gap-3">
      <Field label="Email de connexion du client" htmlFor="access-email">
        <Input id="access-email" name="email" type="email" defaultValue={defaultEmail} className="text-sm" />
      </Field>
      <FormMessage state={state} />
      {link && (
        <div className="flex items-center gap-2 rounded-xl bg-canvas p-2">
          <code className="min-w-0 flex-1 truncate text-xs">{link}</code>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={async () => {
              await navigator.clipboard.writeText(link);
              setCopied(true);
            }}
          >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />} {copied ? "Copié" : "Copier"}
          </Button>
        </div>
      )}
      <Button type="submit" variant={hasAccount ? "secondary" : "brand"} pending={pending} className="self-start">
        <KeyRound className="size-4" aria-hidden /> {hasAccount ? "Renvoyer une invitation" : "Créer l'accès client"}
      </Button>
      <p className="text-xs text-muted">Le client reçoit un lien sécurisé (valable 7 jours) pour choisir son mot de passe. Vous ne connaissez jamais son mot de passe.</p>
    </form>
  );
}

export function ToggleUserButton({ clientId, userId, isActive }: { clientId: string; userId: string; isActive: boolean }) {
  const [pending, start] = useTransition();
  return (
    <Button type="button" size="sm" variant="ghost" pending={pending} onClick={() => start(async () => void (await toggleClientUserAction(clientId, userId, !isActive)))}>
      {isActive ? "Désactiver" : "Réactiver"}
    </Button>
  );
}

export function DeleteClientButton({ clientId }: { clientId: string }) {
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
          if (!confirm("Supprimer définitivement ce client, ses projets, fichiers, messages, paiements et son accès ? Irréversible.")) return;
          start(async () => {
            const res = await deleteClientAction(clientId);
            if (res && !res.ok) setError(res.error);
          });
        }}
      >
        <Trash2 className="size-4" aria-hidden /> Supprimer définitivement
      </Button>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
