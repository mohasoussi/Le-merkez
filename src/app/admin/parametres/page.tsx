import type { Metadata } from "next";
import { requireAdminPage } from "@/server/auth/guards";
import { getSettings } from "@/server/services/settings";
import { PageHeader } from "@/components/admin/PageHeader";
import { SettingsForm } from "@/components/admin/content/SettingsForm";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { ChangePasswordForm } from "@/components/auth/AuthForms";

export const metadata: Metadata = { title: "Paramètres" };

export default async function SettingsPage() {
  await requireAdminPage();
  const s = await getSettings();
  return (
    <>
      <PageHeader title="Paramètres" description="Textes, coordonnées, réseaux sociaux, mentions légales et règles commerciales." />
      <div className="flex max-w-4xl flex-col gap-6">
        <SettingsForm v={{ ...s, createdAt: null, updatedAt: null }} />
        <Card>
          <CardHeader title="Mon mot de passe" />
          <CardBody>
            <ChangePasswordForm />
          </CardBody>
        </Card>
      </div>
    </>
  );
}
