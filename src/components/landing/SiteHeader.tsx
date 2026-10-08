"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { buttonClass } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/#realisations", label: "Réalisations" },
  { href: "/#offres", label: "Offres" },
  { href: "/#methode", label: "Méthode" },
  { href: "/#faq", label: "FAQ" },
];

export function SiteHeader({ brandName }: { brandName: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className={cn("sticky top-0 z-40 transition-[background,box-shadow] duration-300", scrolled || open ? "bg-white/85 shadow-[0_1px_0_var(--color-line)] backdrop-blur-xl" : "bg-transparent")}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight" onClick={() => setOpen(false)}>
          <span className="grid size-8 place-items-center rounded-[10px] bg-ink text-sm text-white">{brandName.slice(0, 1)}</span>
          <span>{brandName}</span>
        </Link>
        <nav aria-label="Navigation principale" className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="rounded-lg px-3 py-2 text-sm text-ink-soft transition-colors hover:text-ink">
              {n.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/connexion" className="hidden rounded-lg px-3 py-2 text-sm text-ink-soft hover:text-ink sm:block">
            Espace client
          </Link>
          <Link href="/demande" className={buttonClass("primary", "sm", "hidden sm:inline-flex")}>
            Créer mon site
          </Link>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-xl text-ink md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-menu" aria-label="Menu mobile" className="h-[calc(100dvh-4rem)] border-t border-line bg-white px-4 pb-8 pt-4 md:hidden">
          <ul className="flex flex-col">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} onClick={() => setOpen(false)} className="block border-b border-line py-4 text-lg font-medium">
                  {n.label}
                </a>
              </li>
            ))}
            <li>
              <Link href="/connexion" onClick={() => setOpen(false)} className="block border-b border-line py-4 text-lg font-medium">
                Espace client
              </Link>
            </li>
          </ul>
          <Link href="/demande" onClick={() => setOpen(false)} className={buttonClass("primary", "lg", "mt-6 w-full")}>
            Créer mon site
          </Link>
        </nav>
      )}
    </header>
  );
}
