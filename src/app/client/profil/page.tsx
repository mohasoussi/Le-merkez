import type { Metadata } from "next";
import { Download } from "lucide-react";
import { requireClientPage } from "@/server/auth/guards";
import { db } from "@/server/db";
import { getSettings } from "@/server/services/settings";
import { ChangePasswordForm } from "@/components/auth/AuthForms";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { DefinitionList } from "@/components/admin/DefinitionList";
import { buttonClass } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Mon profil" };

export default async function ProfilePage() {
  const actor = await requireClientPage();
  const [client, settings] = await Promise.all([db.client.findUnique({ where: { id: actor.clientId! } }), getSettings()]);
  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Mon profil</h1>
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader title="Mes informations" description={`Une information à corriger ? Écrivez-nous${settings.contactEmail ? ` à ${settings.contactEmail}` : " via la messagerie de votre projet"}.`} />
          <CardBody>
            <DefinitionList
              items={[
                ["Nom", `${actor.firstName} ${actor.lastName}`],
                ["Email de connexion", actor.email],
                ["Entreprise", client?.companyName],
                ["Téléphone", client?.phone],
                ["Ville", client?.city],
                ["Site", client?.website],
              ]}
            />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Mot de passe" />
          <CardBody>
            <ChangePasswordForm />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Mes données personnelles" description="Téléchargez une copie de vos données. Pour demander leur suppression, contactez-nous." />
          <CardBody>
            <a href="/api/client/export" className={buttonClass("secondary", "sm")}>
              <Download className="size-4" aria-hidden /> Télécharger mes données
            </a>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
