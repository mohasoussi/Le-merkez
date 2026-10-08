"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { FolderKanban, LogOut, UserRound } from "lucide-react";
import { logoutAction } from "@/server/actions/auth";
import { cn } from "@/lib/cn";

export function ClientShell({ brandName, children }: { brandName: string; children: ReactNode }) {
  const pathname = usePathname();
  const nav = [
    { href: "/client", label: "Mes projets", icon: FolderKanban, active: pathname === "/client" || pathname.startsWith("/client/projets") },
    { href: "/client/profil", label: "Mon profil", icon: UserRound, active: pathname.startsWith("/client/profil") },
  ];
  return (
    <div className="min-h-dvh bg-canvas pb-20 sm:pb-0">
      <header className="sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
          <Link href="/client" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="grid size-7 place-items-center rounded-lg bg-ink text-xs text-white">{brandName.slice(0, 1)}</span>
            {brandName}
          </Link>
          <nav aria-label="Espace client" className="hidden items-center gap-1 sm:flex">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} aria-current={n.active ? "page" : undefined} className={cn("rounded-lg px-3 py-2 text-sm", n.active ? "bg-canvas font-medium text-ink" : "text-ink-soft hover:text-ink")}>
                {n.label}
              </Link>
            ))}
            <form action={logoutAction}>
              <button type="submit" className="ml-1 rounded-lg px-3 py-2 text-sm text-ink-soft hover:text-ink">
                Déconnexion
              </button>
            </form>
          </nav>
          <form action={logoutAction} className="sm:hidden">
            <button type="submit" className="grid size-10 place-items-center rounded-xl text-muted" aria-label="Se déconnecter">
              <LogOut className="size-5" />
            </button>
          </form>
        </div>
      </header>
      <main id="contenu" className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
        {children}
      </main>
      {/* Navigation basse sur mobile (accessible au pouce) */}
      <nav aria-label="Espace client" className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl sm:hidden">
        {nav.map((n) => (
          <Link key={n.href} href={n.href} aria-current={n.active ? "page" : undefined} className={cn("flex flex-col items-center gap-0.5 py-2.5 text-[11px]", n.active ? "font-medium text-brand" : "text-muted")}>
            <n.icon className="size-5" aria-hidden />
            {n.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
