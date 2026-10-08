import { cn } from "@/lib/cn";

export type MockTheme = "restaurant" | "artisan" | "consultant" | "shop" | "neutral";

const themes: Record<MockTheme, { bg: string; accent: string; hero: string; text: string; label: string }> = {
  restaurant: { bg: "bg-[#fbf7f2]", accent: "bg-[#c2410c]", hero: "bg-gradient-to-br from-[#f59e0b] via-[#ea580c] to-[#9a3412]", text: "bg-[#3b2a1e]", label: "Restaurant" },
  artisan: { bg: "bg-[#f5f8fb]", accent: "bg-[#0f766e]", hero: "bg-gradient-to-br from-[#5eead4] via-[#14b8a6] to-[#115e59]", text: "bg-[#13312d]", label: "Artisan" },
  consultant: { bg: "bg-[#0d0d14]", accent: "bg-[#818cf8]", hero: "bg-gradient-to-br from-[#6366f1] via-[#4f46e5] to-[#1e1b4b]", text: "bg-white", label: "Consultant" },
  shop: { bg: "bg-[#fdf7fb]", accent: "bg-[#be185d]", hero: "bg-gradient-to-br from-[#f9a8d4] via-[#ec4899] to-[#9d174d]", text: "bg-[#3d1028]", label: "Commerce" },
  neutral: { bg: "bg-[#f8fafc]", accent: "bg-[#334155]", hero: "bg-gradient-to-br from-[#cbd5e1] via-[#94a3b8] to-[#475569]", text: "bg-[#0f172a]", label: "Site" },
};

/** Maquette de site stylisée (purement décorative, aucune image chargée). */
export function SiteMockup({ theme, className, compact }: { theme: MockTheme; className?: string; compact?: boolean }) {
  const t = themes[theme];
  return (
    <div aria-hidden="true" className={cn("overflow-hidden rounded-2xl bg-white shadow-lift ring-1 ring-black/5", className)}>
      <div className="flex items-center gap-1.5 border-b border-black/5 bg-white px-3 py-2">
        <span className="size-2 rounded-full bg-[#ff5f57]" />
        <span className="size-2 rounded-full bg-[#febc2e]" />
        <span className="size-2 rounded-full bg-[#28c840]" />
        <span className="ml-2 h-3 flex-1 rounded-full bg-black/[0.05]" />
      </div>
      <div className={cn("p-3", t.bg)}>
        <div className="mb-3 flex items-center justify-between">
          <span className={cn("h-2 w-12 rounded-full opacity-80", t.text)} />
          <div className="flex gap-1.5">
            <span className={cn("h-1.5 w-6 rounded-full opacity-30", t.text)} />
            <span className={cn("h-1.5 w-6 rounded-full opacity-30", t.text)} />
            <span className={cn("h-1.5 w-8 rounded-full", t.accent)} />
          </div>
        </div>
        <div className={cn("relative overflow-hidden rounded-xl", t.hero, compact ? "h-20" : "h-28")}>
          <div className="absolute inset-x-3 bottom-3 space-y-1.5">
            <span className="block h-2.5 w-3/4 rounded-full bg-white/90" />
            <span className="block h-1.5 w-1/2 rounded-full bg-white/60" />
            <span className="mt-2 block h-4 w-16 rounded-md bg-white" />
          </div>
        </div>
        {!compact && (
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="space-y-1.5 rounded-lg bg-white/70 p-2 ring-1 ring-black/5">
                <span className={cn("block h-6 rounded-md opacity-15", t.accent)} />
                <span className={cn("block h-1.5 w-4/5 rounded-full opacity-40", t.text)} />
                <span className={cn("block h-1.5 w-3/5 rounded-full opacity-20", t.text)} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function PhoneMockup({ theme, className }: { theme: MockTheme; className?: string }) {
  const t = themes[theme];
  return (
    <div aria-hidden="true" className={cn("w-32 rounded-[1.6rem] bg-ink p-1.5 shadow-lift", className)}>
      <div className={cn("overflow-hidden rounded-[1.25rem]", t.bg)}>
        <div className="mx-auto mt-1.5 h-1.5 w-10 rounded-full bg-black/80" />
        <div className="p-2">
          <div className={cn("h-24 rounded-xl", t.hero)} />
          <span className={cn("mt-2 block h-2 w-4/5 rounded-full opacity-80", t.text)} />
          <span className={cn("mt-1.5 block h-1.5 w-3/5 rounded-full opacity-30", t.text)} />
          <span className={cn("mt-3 block h-5 rounded-lg", t.accent)} />
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            <span className="h-10 rounded-lg bg-white/80 ring-1 ring-black/5" />
            <span className="h-10 rounded-lg bg-white/80 ring-1 ring-black/5" />
          </div>
        </div>
      </div>
    </div>
  );
}

export const SECTOR_MOCK_THEME: Record<string, MockTheme> = {
  RESTAURANT: "restaurant",
  CRAFTSMAN: "artisan",
  CONSULTANT: "consultant",
  LIBERAL_PROFESSION: "consultant",
  RETAIL: "shop",
};
