import { Check } from "lucide-react";
import type { TimelineStep } from "@/lib/constants";
import { cn } from "@/lib/cn";

/** Timeline verticale sur mobile, horizontale sur grand écran. États annoncés aux lecteurs d'écran. */
export function ProjectTimeline({ steps }: { steps: TimelineStep[] }) {
  const label = { done: "terminé", current: "en cours", upcoming: "à venir" } as const;
  return (
    <ol className="grid gap-0 sm:grid-cols-6 sm:gap-2" aria-label="Étapes du projet">
      {steps.map((s, i) => (
        <li key={s.key} className="relative flex gap-3 pb-5 last:pb-0 sm:flex-col sm:items-center sm:gap-2 sm:pb-0 sm:text-center" aria-current={s.state === "current" ? "step" : undefined}>
          {i < steps.length - 1 && (
            <span aria-hidden className={cn("absolute left-[13px] top-7 h-[calc(100%-1.75rem)] w-0.5 sm:left-[calc(50%+16px)] sm:top-[13px] sm:h-0.5 sm:w-[calc(100%-32px+0.5rem)]", s.state === "done" ? "bg-success" : "bg-line")} />
          )}
          <span
            className={cn(
              "relative z-10 grid size-7 shrink-0 place-items-center rounded-full text-xs font-semibold",
              s.state === "done" && "bg-success text-white",
              s.state === "current" && "bg-brand text-white ring-4 ring-brand/15",
              s.state === "upcoming" && "bg-white text-muted ring-1 ring-line",
            )}
          >
            {s.state === "done" ? <Check className="size-4" aria-hidden /> : i + 1}
          </span>
          <div>
            <p className={cn("text-sm", s.state === "upcoming" ? "text-muted" : "font-medium")}>{s.label}</p>
            <p className={cn("text-xs", s.state === "done" ? "text-success" : s.state === "current" ? "text-brand" : "text-muted")}>{s.state === "done" ? "✓" : label[s.state]}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function ProgressBar({ value, label = "Avancement du projet" }: { value: number; label?: string }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-sm text-muted">{label}</span>
        <span className="text-2xl font-semibold tabular-nums tracking-tight">{value} %</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-canvas" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
        <div className="h-full rounded-full bg-gradient-to-r from-brand to-indigo-400 transition-[width] duration-700" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
