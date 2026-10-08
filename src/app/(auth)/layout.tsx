import Link from "next/link";
import { getPublicSettings } from "@/server/public-content";

export const dynamic = "force-dynamic";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const s = await getPublicSettings();
  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <header className="px-5 py-5">
        <Link href="/" className="inline-flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid size-7 place-items-center rounded-lg bg-ink text-xs text-white">{s.brandName.slice(0, 1)}</span>
          {s.brandName}
        </Link>
      </header>
      <main className="flex flex-1 items-start justify-center px-4 pb-16 pt-6 sm:items-center sm:pt-0">
        <div className="w-full max-w-sm animate-fade-up">{children}</div>
      </main>
    </div>
  );
}
