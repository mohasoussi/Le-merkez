import type { Metadata } from "next";
import Link from "next/link";
import { ResetRequestForm } from "@/components/auth/AuthForms";

export const metadata: Metadata = { title: "Mot de passe oublié", robots: { index: false } };

export default function ForgotPasswordPage() {
  return (
    <div className="rounded-3xl border border-line bg-surface p-6 shadow-soft sm:p-8">
      <h1 className="text-2xl font-semibold tracking-tight">Mot de passe oublié</h1>
      <p className="mb-6 mt-1 text-sm text-muted">Indiquez votre email, nous vous enverrons un lien pour en choisir un nouveau.</p>
      <ResetRequestForm />
      <Link href="/connexion" className="mt-4 block text-center text-sm text-muted hover:text-ink">
        Retour à la connexion
      </Link>
    </div>
  );
}
