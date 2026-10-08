import type { ReactNode } from "react";

export function DefinitionList({ items }: { items: [string, ReactNode][] }) {
  return (
    <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
      {items.map(([k, v]) => (
        <div key={k} className="min-w-0">
          <dt className="text-xs text-muted">{k}</dt>
          <dd className="mt-0.5 break-words text-sm">{v || <span className="text-muted">—</span>}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Lien externe sûr à partir d'une saisie libre (« monsite.fr », « @compte »…). */
export function ExternalLink({ value, kind }: { value: string | null | undefined; kind?: "instagram" | "url" }) {
  if (!value) return null;
  let href = value.trim();
  if (kind === "instagram" && !/^https?:/i.test(href)) href = `https://instagram.com/${href.replace(/^@/, "")}`;
  else if (!/^https?:\/\//i.test(href)) href = `https://${href}`;
  if (!/^https?:\/\/[^\s]+$/i.test(href)) return <>{value}</>;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer nofollow" className="text-brand hover:underline">
      {value}
    </a>
  );
}
