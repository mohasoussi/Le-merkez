import Link from "next/link";
import { buttonClass } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-4 text-center">
      <div>
        <p className="font-mono text-sm text-brand">404</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Page introuvable</h1>
        <p className="mt-2 text-muted">La page que vous cherchez n&apos;existe pas ou a été déplacée.</p>
        <Link href="/" className={buttonClass("primary", "md", "mt-6")}>
          Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
