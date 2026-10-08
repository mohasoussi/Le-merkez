"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { BarChart3, FileText, FolderKanban, HelpCircle, Images, KanbanSquare, LayoutDashboard, LogOut, Menu, Package, Settings, Users, UserSquare2, Wrench, X } from "lucide-react";
import { logoutAction } from "@/server/actions/auth";
import { cn } from "@/lib/cn";

const NAV: { section?: string; items: { href: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] }[] = [
  {
    items: [
      { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
      { href: "/admin/pipeline", label: "Pipeline", icon: KanbanSquare },
      { href: "/admin/prospects", label: "Prospects", icon: Users },
      { href: "/admin/clients", label: "Clients", icon: UserSquare2 },
      { href: "/admin/projets", label: "Projets", icon: FolderKanban },
    ],
  },
  {
    section: "Ventes",
    items: [
      { href: "/admin/devis", label: "Devis", icon: FileText },
      { href: "/admin/maintenance", label: "Maintenance", icon: Wrench },
      { href: "/admin/statistiques", label: "Statistiques", icon: BarChart3 },
    ],
  },
  {
    section: "Site public",
    items: [
      { href: "/admin/offres", label: "Offres & options", icon: Package },
      { href: "/admin/realisations", label: "Réalisations", icon: Images },
      { href: "/admin/faq", label: "FAQ", icon: HelpCircle },
      { href: "/admin/parametres", label: "Paramètres", icon: Settings },
    ],
  },
];

export function AdminShell({ brandName, userName, children }: { brandName: string; userName: string; children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const nav = (
    <nav aria-label="Administration" className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-4">
      {NAV.map((group, i) => (
        <div key={i}>
          {group.section && <p className="mb-1.5 px-3 text-[11px] font-medium uppercase tracking-wider text-muted">{group.section}</p>}
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn("flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors", active ? "bg-white font-medium text-ink shadow-soft ring-1 ring-line" : "text-ink-soft hover:bg-white/60 hover:text-ink")}
                  >
                    <item.icon className={cn("size-4", active ? "text-brand" : "text-muted")} aria-hidden />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  const footer = (
    <div className="border-t border-line p-3">
      <div className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5">
        <span className="truncate text-sm text-ink-soft">{userName}</span>
        <form action={logoutAction}>
          <button type="submit" className="grid size-8 place-items-center rounded-lg text-muted hover:bg-white hover:text-ink" aria-label="Se déconnecter" title="Se déconnecter">
            <LogOut className="size-4" />
          </button>
        </form>
      </div>
    </div>
  );

  const brand = (
    <Link href="/admin" className="flex items-center gap-2 font-semibold tracking-tight">
      <span className="grid size-7 place-items-center rounded-lg bg-ink text-xs text-white">{brandName.slice(0, 1)}</span>
      <span className="truncate">{brandName}</span>
      <span className="rounded-md bg-brand-soft px-1.5 py-0.5 text-[10px] font-medium uppercase text-brand-strong">CRM</span>
    </Link>
  );

  return (
    <div className="min-h-dvh bg-canvas lg:grid lg:grid-cols-[248px_1fr]">
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-line bg-canvas lg:flex">
        <div className="flex h-16 items-center px-5">{brand}</div>
        {nav}
        {footer}
      </aside>

      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-white/90 px-4 backdrop-blur-xl lg:hidden">
        {brand}
        <button type="button" onClick={() => setOpen(true)} className="grid size-10 place-items-center rounded-xl" aria-label="Ouvrir le menu" aria-expanded={open}>
          <Menu className="size-5" />
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" className="absolute inset-0 bg-ink/30 backdrop-blur-sm" onClick={() => setOpen(false)} aria-label="Fermer le menu" />
          <div className="absolute inset-y-0 left-0 flex w-[82%] max-w-xs animate-fade-up flex-col bg-canvas shadow-lift">
            <div className="flex h-14 items-center justify-between px-4">
              {brand}
              <button type="button" onClick={() => setOpen(false)} className="grid size-10 place-items-center rounded-xl" aria-label="Fermer le menu">
                <X className="size-5" />
              </button>
            </div>
            {nav}
            {footer}
          </div>
        </div>
      )}

      <main id="contenu" className="min-w-0 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
        {children}
      </main>
    </div>
  );
}
