import { cn } from "@/lib/cn";

// Graphiques à une seule série : une couleur (marque), valeurs en encre neutre, infobulle au survol ET au focus clavier,
// et un tableau équivalent pour les lecteurs d'écran. Aucun JavaScript, aucune librairie.

export interface Datum {
  label: string;
  value: number;
  display?: string;
}

/** Barres horizontales triées (répartition par catégorie). */
export function BarList({ data, title }: { data: Datum[]; title: string }) {
  if (data.length === 0) return <p className="py-6 text-center text-sm text-muted">Pas encore de données.</p>;
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <figure>
      <ul className="space-y-2.5" aria-hidden="true">
        {data.map((d) => (
          <li key={d.label} className="grid grid-cols-[minmax(0,7.5rem)_1fr_auto] items-center gap-3 text-sm">
            <span className="truncate text-ink-soft">{d.label}</span>
            <span className="h-2.5 rounded-r-[4px] bg-canvas">
              <span className="block h-full rounded-r-[4px] bg-brand" style={{ width: `${(d.value / max) * 100}%`, minWidth: d.value > 0 ? 4 : 0 }} />
            </span>
            <span className="tabular-nums text-ink">{d.display ?? d.value}</span>
          </li>
        ))}
      </ul>
      <DataTable title={title} data={data} />
    </figure>
  );
}

/** Colonnes (évolution dans le temps). Étiquettes d'axe allégées sur mobile. */
export function ColumnChart({ data, title }: { data: Datum[]; title: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <figure>
      {total === 0 ? (
        <p className="py-10 text-center text-sm text-muted">Pas encore de prospects sur la période.</p>
      ) : (
        <div className="relative">
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 border-t border-dashed border-line" />
          <span aria-hidden="true" className="pointer-events-none absolute -top-2.5 right-0 bg-white pl-1 text-[11px] tabular-nums text-muted">{max}</span>
          <div className="flex h-44 items-end gap-[2px] border-b border-line sm:gap-1.5">
            {data.map((d) => (
              <div key={d.label} role="img" aria-label={`${d.label} : ${d.display ?? d.value}`} className="group relative flex h-full flex-1 items-end justify-center rounded-sm focus-visible:ring-2 focus-visible:ring-brand" tabIndex={0}>
                <div className={cn("w-full max-w-10 rounded-t-[4px] bg-brand transition-opacity group-hover:opacity-80 group-focus:opacity-80", d.value === 0 && "bg-transparent")} style={{ height: `${(d.value / max) * 100}%`, minHeight: d.value > 0 ? 4 : 0 }} />
                <span aria-hidden="true" className="pointer-events-none absolute bottom-full z-10 mb-1 hidden whitespace-nowrap rounded-lg bg-ink px-2 py-1 text-xs text-white shadow-lift group-hover:block group-focus:block">
                  {d.label} : {d.display ?? d.value}
                </span>
              </div>
            ))}
          </div>
          <div aria-hidden="true" className="mt-1.5 flex gap-[2px] sm:gap-1.5">
            {data.map((d, i) => (
              <span key={d.label} className={cn("flex-1 truncate text-center text-[10px] text-muted sm:text-[11px]", i % 2 === 1 && "max-sm:invisible")}>
                {d.label}
              </span>
            ))}
          </div>
        </div>
      )}
      <DataTable title={title} data={data} />
    </figure>
  );
}

function DataTable({ title, data }: { title: string; data: Datum[] }) {
  return (
    <details className="mt-3 text-xs text-muted">
      <summary className="cursor-pointer hover:text-ink">Voir le tableau</summary>
      <table className="mt-2 w-full text-left">
        <caption className="sr-only">{title}</caption>
        <tbody className="divide-y divide-line">
          {data.map((d) => (
            <tr key={d.label}>
              <th scope="row" className="py-1 font-normal">
                {d.label}
              </th>
              <td className="py-1 text-right tabular-nums text-ink">{d.display ?? d.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  );
}
