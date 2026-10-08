import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function KpiCard({ label, value, hint, href, icon, accent }: { label: string; value: ReactNode; hint?: ReactNode; href?: string; icon?: ReactNode; accent?: boolean }) {
  const body = (
    <>
      <div className="flex items-center justify-between gap-2">
        <p className={cn("text-[13px] font-medium", accent ? "text-white/70" : "text-muted")}>{label}</p>
        {icon && <span className={cn(accent ? "text-white/60" : "text-muted")}>{icon}</span>}
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums sm:text-[1.7rem]">{value}</p>
      {hint && <p className={cn("mt-1 text-xs", accent ? "text-white/60" : "text-muted")}>{hint}</p>}
    </>
  );
  const cls = cn("block rounded-2xl border p-4 transition-shadow sm:p-5", accent ? "border-ink bg-ink text-white" : "border-line bg-white shadow-soft", href && "hover:shadow-lift");
  return href ? (
    <Link href={href} className={cls}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}
