"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "@/lib/zod";
import { requireAdmin } from "@/server/auth/guards";
import * as projects from "@/server/services/projects";
import { storage } from "@/server/storage";
import { logger } from "@/server/logger";
import { AppError } from "@/server/errors";
import { PROJECT_STATUSES } from "@/lib/constants";
import { parseEuroToCents } from "@/lib/format";
import { ok, runAction } from "./result";

const id = z.string().min(1).max(40);

function parseProjectForm(formData: FormData): projects.ProjectInput {
  const f = Object.fromEntries(formData) as Record<string, string>;
  const price = parseEuroToCents(f.price ?? "");
  if (Number.isNaN(price)) throw new AppError("Prix invalide.", "VALIDATION", { price: "Prix invalide." });
  const progress = f.progressMode === "manual" && f.progress !== "" ? Number(f.progress) : null;
  return {
    name: f.name ?? "",
    offerId: f.offerId || null,
    priceCents: price,
    startDate: f.startDate ? new Date(f.startDate) : null,
    dueDate: f.dueDate ? new Date(f.dueDate) : null,
    previewUrl: f.previewUrl || null,
    liveUrl: f.liveUrl || null,
    notes: f.notes || null,
    progressOverride: progress,
    briefEnabled: f.briefEnabled === "on",
    contentReceived: f.contentReceived === "on",
  };
}

export async function createProjectAction(clientId: string, _: unknown, formData: FormData) {
  let target = "";
  const res = await runAction("createProject", async () => {
    const actor = await requireAdmin();
    const project = await projects.createProject(actor, id.parse(clientId), parseProjectForm(formData));
    revalidatePath("/admin", "layout");
    target = `/admin/projets/${project.id}`;
  });
  if (!res.ok) return res;
  redirect(target);
}

export async function updateProjectAction(projectId: string, _: unknown, formData: FormData) {
  return runAction("updateProject", async () => {
    const actor = await requireAdmin();
    await projects.updateProject(actor, id.parse(projectId), parseProjectForm(formData));
    revalidatePath("/admin", "layout");
    revalidatePath("/client", "layout");
    return ok("Projet enregistré.");
  });
}

export async function changeProjectStatusAction(projectId: string, _: unknown, formData: FormData) {
  return runAction("changeProjectStatus", async () => {
    const actor = await requireAdmin();
    const status = z.enum(PROJECT_STATUSES).parse(formData.get("status"));
    await projects.changeProjectStatus(actor, id.parse(projectId), status, { notifyClient: formData.get("notify") === "on" });
    revalidatePath("/admin", "layout");
    revalidatePath("/client", "layout");
    return ok("Statut mis à jour.");
  });
}

export async function deleteProjectAction(projectId: string, clientId: string) {
  const res = await runAction("deleteProject", async () => {
    const actor = await requireAdmin();
    const keys = await projects.deleteProject(actor, id.parse(projectId));
    await Promise.all(keys.map((k) => storage().delete(k).catch((error) => logger.error("storage.delete_failed", { error, key: k }))));
    revalidatePath("/admin", "layout");
  });
  if (!res.ok) return res;
  redirect(`/admin/clients/${clientId}`);
}
