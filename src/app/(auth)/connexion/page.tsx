import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentActor } from "@/server/auth/cookies";
import { LoginForm } from "@/components/auth/AuthForms";

export const metadata: Metadata = { title: "Connexion", robots: { index: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const actor = await getCurrentActor();
  if (actor) redirect(actor.role === "ADMIN" ? "/admin" : "/client");
  const { next } = await searchParams;
  return (
    <div className="rounded-3xl border border-line bg-surface p-6 shadow-soft sm:p-8">
      <h1 className="text-2xl font-semibold tracking-tight">Connexion</h1>
      <p className="mb-6 mt-1 text-sm text-muted">Accédez à votre espace.</p>
      <LoginForm next={next} />
    </div>
  );
}
