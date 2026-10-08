import type { Metadata } from "next";
import { ClientShell } from "@/components/client/ClientShell";
import { requireClientPage } from "@/server/auth/guards";
import { getSettings } from "@/server/services/settings";

export const metadata: Metadata = { title: { default: "Mon espace", template: "%s — Mon espace" }, robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  await requireClientPage();
  const settings = await getSettings();
  return <ClientShell brandName={settings.brandName}>{children}</ClientShell>;
}
