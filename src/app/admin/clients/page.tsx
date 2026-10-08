import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { requireAdminPage } from "@/server/auth/guards";
import { listClients } from "@/server/services/clients";
import { PageHeader } from "@/components/admin/PageHeader";
import { Input } from "@/components/ui/Field";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/States";
import { formatCents, formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Clients" };

export default async function ClientsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const actor = await requireAdminPage();
  const { q } = await searchParams;
  const clients = await listClients(actor, q?.trim().slice(0, 100) || undefined);
  return (
    <>
      <PageHeader title="Clients" description="Un prospect devient client depuis sa fiche (bouton « Convertir en client »)." />
      <form method="get" className="relative mb-5 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
        <label htmlFor="q" className="sr-only">
          Rechercher un client
        </label>
        <Input id="q" name="q" defaultValue={q} placeholder="Rechercher un client…" className="pl-9 text-sm" />
      </form>
      {clients.length === 0 ? (
        <EmptyState title={q ? "Aucun client ne correspond." : "Aucun client pour le moment."} description="Convertissez un prospect en client depuis sa fiche." />
      ) : (
        <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {clients.map((c) => {
            const paid = c.payments.filter((p) => p.kind !== "MAINTENANCE").reduce((s, p) => s + p.amountCents, 0);
            const active = c.projects.filter((p) => p.status !== "DONE").length;
            const hasAccess = c.users.some((u) => u.passwordHash);
            return (
              <li key={c.id} className="min-w-0">
                <Link href={`/admin/clients/${c.id}`} className="block h-full rounded-2xl border border-line bg-white p-5 shadow-soft transition-shadow hover:shadow-lift">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{c.companyName}</p>
                      <p className="truncate text-sm text-muted">
                        {c.firstName} {c.lastName}
                      </p>
                    </div>
                    {c.isDemo && <Badge>fictif</Badge>}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-1.5 text-xs">
                    <Badge tone={active ? "brand" : "neutral"}>
                      {c.projects.length} projet{c.projects.length > 1 ? "s" : ""}
                      {active ? ` · ${active} en cours` : ""}
                    </Badge>
                    <Badge tone={hasAccess ? "success" : c.users.length ? "warning" : "neutral"}>{hasAccess ? "Espace activé" : c.users.length ? "Invitation envoyée" : "Sans accès"}</Badge>
                    {c.subscriptions.length > 0 && <Badge tone="info">Maintenance</Badge>}
                  </div>
                  <p className="mt-3 text-xs text-muted">
                    Payé : {formatCents(paid)} · client depuis le {formatDate(c.createdAt)}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
