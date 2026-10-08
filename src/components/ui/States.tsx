import type { ReactNode } from "react";
import { AlertCircle, CheckCircle2, Inbox } from "lucide-react";
import { cn } from "@/lib/cn";

export function EmptyState({ title, description, action, icon, className }: { title: string; description?: ReactNode; action?: ReactNode; icon?: ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-2xl border border-dashed border-line px-6 py-12 text-center", className)}>
      <div className="mb-3 grid size-11 place-items-center rounded-full bg-canvas text-muted">{icon ?? <Inbox className="size-5" aria-hidden />}</div>
      <p className="font-medium text-ink">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Alert({ tone = "danger", children, className }: { tone?: "danger" | "success" | "info"; children: ReactNode; className?: string }) {
  const styles = {
    danger: "bg-danger-soft text-danger ring-danger/15",
    success: "bg-success-soft text-success ring-success/15",
    info: "bg-brand-soft text-brand-strong ring-brand/15",
  }[tone];
  const Icon = tone === "success" ? CheckCircle2 : AlertCircle;
  return (
    <div role={tone === "danger" ? "alert" : "status"} className={cn("flex items-start gap-2.5 rounded-xl px-3.5 py-3 text-sm ring-1 ring-inset", styles, className)}>
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div>{children}</div>
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-canvas", className)} />;
}
