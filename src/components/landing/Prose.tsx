import type { ReactNode } from "react";

export function LegalPage({ title, updated, children }: { title: string; updated?: string; children: ReactNode }) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
      {updated && <p className="mt-2 text-sm text-muted">Dernière mise à jour : {updated}</p>}
      <div className="mt-10 space-y-8 leading-relaxed text-ink-soft [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-ink [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-1">{children}</div>
    </article>
  );
}

export function ToFill({ value, label }: { value: string | null | undefined; label: string }) {
  return value ? <>{value}</> : <mark className="rounded bg-warning-soft px-1 text-warning">[{label} — à compléter dans l&apos;administration]</mark>;
}
