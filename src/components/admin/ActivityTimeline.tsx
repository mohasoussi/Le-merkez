import { formatDateTime } from "@/lib/format";

export function ActivityTimeline({ items }: { items: { id: string; message: string; createdAt: Date; actor: { firstName: string } | null }[] }) {
  if (items.length === 0) return <p className="text-sm text-muted">Aucun événement.</p>;
  return (
    <ol className="relative space-y-4 border-l border-line pl-5">
      {items.map((a) => (
        <li key={a.id} className="relative">
          <span className="absolute -left-[25px] top-1.5 size-2.5 rounded-full border-2 border-white bg-brand ring-1 ring-line" aria-hidden />
          <p className="text-sm">{a.message}</p>
          <p className="text-xs text-muted">
            {formatDateTime(a.createdAt)}
            {a.actor && ` · ${a.actor.firstName}`}
          </p>
        </li>
      ))}
    </ol>
  );
}
