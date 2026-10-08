import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdminPage } from "@/server/auth/guards";
import { getSettings } from "@/server/services/settings";

export const metadata: Metadata = { title: { default: "Administration", template: "%s — Administration" }, robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const actor = await requireAdminPage();
  const settings = await getSettings();
  return (
    <AdminShell brandName={settings.brandName} userName={`${actor.firstName} ${actor.lastName}`.trim()}>
      {children}
    </AdminShell>
  );
}
