import "server-only";
import { createId } from "./ids";
import { db } from "@/server/db";
import { AppError, notFound } from "@/server/errors";
import type { Actor } from "@/server/auth/session";
import { assertProjectAccess } from "./projects";
import { logActivity } from "./activity";
import { storage } from "@/server/storage";
import { detectFileType, sanitizeFileName } from "@/server/storage/file-types";
import { enforceRateLimit, RATE_LIMITS } from "@/server/security/rate-limit";
import { notifyFileUploaded } from "@/server/email/notifications";
import { env } from "@/server/env";
import { FILE_CATEGORIES, type FileCategoryCode } from "@/lib/constants";
import { logger } from "@/server/logger";

export const MAX_FILES_PER_PROJECT = 300;

/** Téléversement d'un fichier de projet : contrôle d'accès, taille, type réel (signature), clé aléatoire. */
export async function uploadProjectFile(actor: Actor, projectId: string, file: { name: string; bytes: Uint8Array; category: string }) {
  const project = await assertProjectAccess(actor, projectId);
  await enforceRateLimit(`upload:${actor.id}`, RATE_LIMITS.upload);

  if (!FILE_CATEGORIES.includes(file.category as FileCategoryCode)) throw new AppError("Catégorie invalide.");
  const maxBytes = env().UPLOAD_MAX_MB * 1024 * 1024;
  if (file.bytes.byteLength === 0) throw new AppError("Le fichier est vide.");
  if (file.bytes.byteLength > maxBytes) throw new AppError(`Fichier trop volumineux (${env().UPLOAD_MAX_MB} Mo maximum).`);
  const type = detectFileType(file.name, file.bytes);
  if (!type) throw new AppError("Type de fichier non autorisé. Formats acceptés : images (JPG, PNG, WebP…), PDF, documents Word/Excel/PowerPoint, texte, ZIP, AI/EPS/PSD.");
  if ((await db.projectFile.count({ where: { projectId } })) >= MAX_FILES_PER_PROJECT) throw new AppError("Nombre maximum de fichiers atteint pour ce projet.");

  const storageKey = `projects/${projectId}/${createId()}.${type.ext}`;
  await storage().put(storageKey, file.bytes, type.mime);
  try {
    const record = await db.$transaction(async (tx) => {
      const created = await tx.projectFile.create({
        data: { projectId, uploadedById: actor.id, category: file.category as FileCategoryCode, originalName: sanitizeFileName(file.name), storageKey, mimeType: type.mime, sizeBytes: file.bytes.byteLength },
      });
      await logActivity(tx, { type: "FILE_UPLOADED", projectId, clientId: project.clientId, actorId: actor.id, message: `Fichier ajouté : ${created.originalName}` });
      return created;
    });
    if (actor.role === "CLIENT") {
      await notifyFileUploaded({ projectId, projectName: project.name, fileName: record.originalName, uploaderName: `${actor.firstName} ${actor.lastName}`.trim() });
    }
    return record;
  } catch (error) {
    await storage().delete(storageKey).catch(() => {});
    throw error;
  }
}

/** Fichier à télécharger : uniquement si l'utilisateur a accès au projet. */
export async function getFileForDownload(actor: Actor, fileId: string) {
  const file = await db.projectFile.findUnique({ where: { id: fileId } });
  if (!file) throw notFound("Fichier");
  await assertProjectAccess(actor, file.projectId); // lève NOT_FOUND pour un autre client
  const obj = await storage().get(file.storageKey);
  if (!obj) {
    logger.error("file.missing_in_storage", { fileId, key: file.storageKey });
    throw notFound("Fichier");
  }
  return { file, obj };
}

/** Un client ne peut supprimer que les fichiers qu'il a lui-même déposés. */
export async function deleteProjectFile(actor: Actor, fileId: string) {
  const file = await db.projectFile.findUnique({ where: { id: fileId } });
  if (!file) throw notFound("Fichier");
  await assertProjectAccess(actor, file.projectId);
  if (actor.role !== "ADMIN" && file.uploadedById !== actor.id) throw new AppError("Vous ne pouvez supprimer que vos propres fichiers.", "FORBIDDEN");
  await db.projectFile.delete({ where: { id: fileId } });
  await storage().delete(file.storageKey).catch((error) => logger.error("storage.delete_failed", { error, key: file.storageKey }));
  return file.projectId;
}
