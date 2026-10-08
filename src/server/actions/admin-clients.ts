"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "@/lib/zod";
import { requireAdmin } from "@/server/auth/guards";
import * as clients from "@/server/services/clients";
import { storage } from "@/server/storage";
import { logger } from "@/server/logger";
import { ok, okData, runAction } from "./result";

const id = z.string().min(1).max(40);

export async function updateClientAction(clientId: string, _: unknown, formData: FormData) {
  return runAction("updateClient", async () => {
    const actor = await requireAdmin();
    await clients.updateClient(actor, id.parse(clientId), clients.clientUpdateSchema.parse(Object.fromEntries(formData)));
    revalidatePath(`/admin/clients/${clientId}`);
    return ok("Client enregistré.");
  });
}

export async function createAccessAction(clientId: string, _: unknown, formData: FormData) {
  return runAction("createAccess", async () => {
    const actor = await requireAdmin();
    const email = z.email("Email invalide.").optional().parse(formData.get("email") || undefined);
    const res = await clients.createClientAccess(actor, id.parse(clientId), email);
    revalidatePath(`/admin/clients/${clientId}`);
    return okData(res, res.emailSent ? "Invitation envoyée par email." : "Accès créé. L'email n'étant pas configuré (mode console), copiez le lien ci-dessous et transmettez-le au client.");
  });
}

export async function toggleClientUserAction(clientId: string, userId: string, isActive: boolean) {
  return runAction("toggleClientUser", async () => {
    const actor = await requireAdmin();
    await clients.setClientUserActive(actor, id.parse(userId), isActive);
    revalidatePath(`/admin/clients/${clientId}`);
  });
}

export async function deleteClientAction(clientId: string) {
  const res = await runAction("deleteClient", async () => {
    const actor = await requireAdmin();
    const keys = await clients.deleteClient(actor, id.parse(clientId));
    await Promise.all(keys.map((k) => storage().delete(k).catch((error) => logger.error("storage.delete_failed", { error, key: k }))));
    revalidatePath("/admin", "layout");
  });
  if (!res.ok) return res;
  redirect("/admin/clients");
}
