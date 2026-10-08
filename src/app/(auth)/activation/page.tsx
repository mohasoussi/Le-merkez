import type { Metadata } from "next";
import Link from "next/link";
import { findValidAuthToken } from "@/server/services/auth";
import { SetPasswordForm } from "@/components/auth/AuthForms";
import { Alert } from "@/components/ui/States";

export const metadata: Metadata = { title: "Activation du compte", robots: { index: false } };

export default async function ActivationPage({ searchParams }: { searchParams: Promise<{ token?: string; mode?: string }> }) {
  const { token, mode } = await searchParams;
  const record = token ? await findValidAuthToken(token) : null;
  const isReset = mode === "reset" || record?.type === "PASSWORD_RESET";
  return (
    <div className="rounded-3xl border border-line bg-surface p-6 shadow-soft sm:p-8">
      <h1 className="text-2xl font-semibold tracking-tight">{isReset ? "Nouveau mot de passe" : "Activez votre espace"}</h1>
      {record && token ? (
        <>
          <p className="mb-6 mt-1 text-sm text-muted">
            {isReset ? "Choisissez votre nouveau mot de passe." : `Bonjour ${record.user.firstName}, choisissez votre mot de passe pour accéder à votre espace.`}
          </p>
          <SetPasswordForm token={token} submitLabel={isReset ? "Enregistrer" : "Activer mon espace"} />
        </>
      ) : (
        <div className="mt-4 flex flex-col gap-4">
          <Alert>Ce lien n&apos;est plus valide (il a expiré ou a déjà été utilisé).</Alert>
          <Link href="/mot-de-passe-oublie" className="text-sm font-medium text-brand">
            Demander un nouveau lien
          </Link>
        </div>
      )}
    </div>
  );
}
