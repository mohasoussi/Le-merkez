import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Reveal } from "./Reveal";

export function Section({ id, eyebrow, title, intro, children, className, tone = "white" }: { id?: string; eyebrow?: string; title: ReactNode; intro?: ReactNode; children: ReactNode; className?: string; tone?: "white" | "canvas" | "dark" }) {
  return (
    <section id={id} className={cn("py-20 sm:py-28", tone === "canvas" && "bg-canvas", tone === "dark" && "bg-ink text-white", className)}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
          {eyebrow && <p className={cn("mb-3 text-sm font-medium", tone === "dark" ? "text-indigo-300" : "text-brand")}>{eyebrow}</p>}
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-balance sm:text-[2.6rem] sm:leading-[1.1]">{title}</h2>
          {intro && <p className={cn("mt-4 text-lg leading-relaxed text-pretty", tone === "dark" ? "text-white/70" : "text-ink-soft")}>{intro}</p>}
        </Reveal>
        {children}
      </div>
    </section>
  );
}
