import { Skeleton } from "@/components/ui/States";

export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Chargement">
      <Skeleton className="mb-8 h-8 w-56" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
