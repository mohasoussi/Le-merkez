"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { changePasswordAction, loginAction, requestResetAction, setPasswordAction } from "@/server/actions/auth";
import { Button } from "@/components/ui/Button";
import { Field, Input, describedBy } from "@/components/ui/Field";
import { Alert } from "@/components/ui/States";
import type { ActionResult } from "@/server/actions/result";

type State = ActionResult | null;

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState<State, FormData>(loginAction, null);
  // Champ contrôlé : React réinitialise les formulaires après une action, l'email ne doit pas être perdu en cas d'erreur.
  const [email, setEmail] = useState("");
  const fe = state && !state.ok ? state.fieldErrors : undefined;
  return (
    <form action={action} className="flex flex-col gap-4" noValidate={false}>
      {state && !state.ok && <Alert>{state.error}</Alert>}
      <input type="hidden" name="next" value={next ?? ""} />
      <Field label="Email" htmlFor="email" error={fe?.email}>
        <Input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!fe?.email} aria-describedby={describedBy("email", fe?.email)} />
      </Field>
      <Field label="Mot de passe" htmlFor="password" error={fe?.password}>
        <Input id="password" name="password" type="password" autoComplete="current-password" required aria-invalid={!!fe?.password} aria-describedby={describedBy("password", fe?.password)} />
      </Field>
      <Button type="submit" pending={pending} className="mt-1">
        Se connecter
      </Button>
      <Link href="/mot-de-passe-oublie" className="text-center text-sm text-muted hover:text-ink">
        Mot de passe oublié ?
      </Link>
    </form>
  );
}

export function SetPasswordForm({ token, submitLabel }: { token: string; submitLabel: string }) {
  const [state, action, pending] = useActionState<State, FormData>(setPasswordAction, null);
  const fe = state && !state.ok ? state.fieldErrors : undefined;
  return (
    <form action={action} className="flex flex-col gap-4">
      {state && !state.ok && <Alert>{state.error}</Alert>}
      <input type="hidden" name="token" value={token} />
      <Field label="Nouveau mot de passe" htmlFor="password" error={fe?.password} hint="Au moins 10 caractères, avec des lettres et un chiffre ou un symbole.">
        <Input id="password" name="password" type="password" autoComplete="new-password" minLength={10} required aria-invalid={!!fe?.password} aria-describedby={describedBy("password", fe?.password, true)} />
      </Field>
      <Field label="Confirmer le mot de passe" htmlFor="confirm" error={fe?.confirm}>
        <Input id="confirm" name="confirm" type="password" autoComplete="new-password" required aria-invalid={!!fe?.confirm} aria-describedby={describedBy("confirm", fe?.confirm)} />
      </Field>
      <Button type="submit" pending={pending}>
        {submitLabel}
      </Button>
    </form>
  );
}

export function ResetRequestForm() {
  const [state, action, pending] = useActionState<State, FormData>(requestResetAction, null);
  if (state?.ok) return <Alert tone="success">{state.message}</Alert>;
  const fe = state && !state.ok ? state.fieldErrors : undefined;
  return (
    <form action={action} className="flex flex-col gap-4">
      {state && !state.ok && <Alert>{state.error}</Alert>}
      <Field label="Email" htmlFor="email" error={fe?.email}>
        <Input id="email" name="email" type="email" autoComplete="email" required aria-invalid={!!fe?.email} />
      </Field>
      <Button type="submit" pending={pending}>
        Recevoir un lien
      </Button>
    </form>
  );
}

export function ChangePasswordForm() {
  const [state, action, pending] = useActionState<State, FormData>(changePasswordAction, null);
  const fe = state && !state.ok ? state.fieldErrors : undefined;
  return (
    <form action={action} className="flex max-w-sm flex-col gap-4">
      {state && !state.ok && <Alert>{state.error}</Alert>}
      {state?.ok && <Alert tone="success">{state.message}</Alert>}
      <Field label="Mot de passe actuel" htmlFor="currentPassword" error={fe?.currentPassword}>
        <Input id="currentPassword" name="currentPassword" type="password" autoComplete="current-password" required />
      </Field>
      <Field label="Nouveau mot de passe" htmlFor="password" error={fe?.password} hint="Au moins 10 caractères.">
        <Input id="password" name="password" type="password" autoComplete="new-password" minLength={10} required />
      </Field>
      <Field label="Confirmer" htmlFor="confirm" error={fe?.confirm}>
        <Input id="confirm" name="confirm" type="password" autoComplete="new-password" required />
      </Field>
      <Button type="submit" pending={pending} variant="secondary">
        Mettre à jour
      </Button>
    </form>
  );
}
