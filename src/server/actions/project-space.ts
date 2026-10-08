"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireActor, requireAdmin } from "@/server/auth/guards";
import { reopenBrief, saveBriefDraft, submitBrief } from "@/server/services/briefs";
import { postMessage } from "@/server/services/messages";
import { deleteProjectFile } from "@/server/services/files";
import { ok, okData, runAction } from "./result";

// Actions communes à l'administrateur et au client : les droits sont vérifiés dans chaque service.

const id = z.string().min(1).max(40);

function refresh(projectId: string) {
  revalidatePath(`/admin/projets/${projectId}`);
  revalidatePath(`/client/projets/${projectId}`, "layout");
  revalidatePath("/client");
}

export async function saveBriefAction(projectId: string, data: unknown) {
  return runAction("saveBrief", async () => {
    const actor = await requireActor();
    const savedAt = await saveBriefDraft(actor, id.parse(projectId), data);
    return okData(savedAt.toISOString());
  });
}

export async function submitBriefAction(projectId: string, data: unknown) {
  return runAction("submitBrief", async () => {
    const actor = await requireActor();
    await submitBrief(actor, id.parse(projectId), data);
    refresh(projectId);
    return ok("Merci ! Votre brief a bien été envoyé.");
  });
}

export async function reopenBriefAction(projectId: string) {
  return runAction("reopenBrief", async () => {
    const actor = await requireAdmin();
    await reopenBrief(actor, id.parse(projectId));
    refresh(projectId);
    return ok("Le brief est à nouveau modifiable par le client.");
  });
}

export async function postMessageAction(projectId: string, _: unknown, formData: FormData) {
  return runAction("postMessage", async () => {
    const actor = await requireActor();
    await postMessage(actor, id.parse(projectId), String(formData.get("body") ?? ""));
    refresh(projectId);
  });
}

export async function deleteFileAction(fileId: string) {
  return runAction("deleteFile", async () => {
    const actor = await requireActor();
    const projectId = await deleteProjectFile(actor, id.parse(fileId));
    refresh(projectId);
  });
}
