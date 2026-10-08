"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Download, FileText, Image as ImageIcon, Trash2, UploadCloud } from "lucide-react";
import { deleteFileAction } from "@/server/actions/project-space";
import { Select } from "@/components/ui/Field";
import { Alert, EmptyState } from "@/components/ui/States";
import { FILE_CATEGORIES, FILE_CATEGORY_LABELS, type FileCategoryCode } from "@/lib/constants";
import { formatDate, formatFileSize } from "@/lib/format";
import { cn } from "@/lib/cn";

export interface FileItem {
  id: string;
  originalName: string;
  category: FileCategoryCode;
  sizeBytes: number;
  mimeType: string;
  createdAt: string;
  uploadedBy: { firstName: string; role: string } | null;
  canDelete: boolean;
}

interface Upload {
  key: string;
  name: string;
  progress: number;
  error?: string;
}

/** Envoi via XMLHttpRequest pour afficher une vraie progression (utile sur mobile / 4G). */
function uploadWithProgress(projectId: string, file: File, category: string, onProgress: (p: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `/api/projects/${projectId}/files`);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) return resolve();
      try {
        reject(new Error((JSON.parse(xhr.responseText) as { error?: string }).error ?? "Envoi impossible."));
      } catch {
        reject(new Error(xhr.status === 413 ? "Fichier trop volumineux." : "Envoi impossible."));
      }
    };
    xhr.onerror = () => reject(new Error("Connexion interrompue. Réessayez."));
    const fd = new FormData();
    fd.append("file", file);
    fd.append("category", category);
    xhr.send(fd);
  });
}

export function FileManager({ projectId, files, accept, maxMb, readOnly }: { projectId: string; files: FileItem[]; accept: string; maxMb: number; readOnly?: boolean }) {
  const [category, setCategory] = useState<FileCategoryCode>("PHOTOS");
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, start] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handle(list: FileList | null) {
    if (!list?.length) return;
    setError(null);
    const batch = Array.from(list).map((f, i) => ({ file: f, key: `${Date.now()}-${i}` }));
    setUploads((u) => [...u, ...batch.map((b) => ({ key: b.key, name: b.file.name, progress: 0 }))]);
    for (const { file, key } of batch) {
      if (file.size > maxMb * 1024 * 1024) {
        setUploads((u) => u.map((x) => (x.key === key ? { ...x, error: `Trop volumineux (max ${maxMb} Mo)` } : x)));
        continue;
      }
      try {
        await uploadWithProgress(projectId, file, category, (p) => setUploads((u) => u.map((x) => (x.key === key ? { ...x, progress: p } : x))));
        setUploads((u) => u.filter((x) => x.key !== key));
      } catch (e) {
        setUploads((u) => u.map((x) => (x.key === key ? { ...x, error: (e as Error).message } : x)));
      }
    }
    if (inputRef.current) inputRef.current.value = "";
    router.refresh();
  }

  const grouped = FILE_CATEGORIES.map((c) => [c, files.filter((f) => f.category === c)] as const).filter(([, l]) => l.length);

  return (
    <div className="flex flex-col gap-5">
      {!readOnly && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <label htmlFor="file-category" className="text-sm font-medium">
              Catégorie
            </label>
            <Select id="file-category" value={category} onChange={(e) => setCategory(e.target.value as FileCategoryCode)} className="h-10 py-2 text-sm sm:w-56">
              {FILE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {FILE_CATEGORY_LABELS[c]}
                </option>
              ))}
            </Select>
          </div>
          <label
            htmlFor="file-input"
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              void handle(e.dataTransfer.files);
            }}
            className={cn("flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand/15", dragOver ? "border-brand bg-brand-soft/50" : "border-line hover:border-ink/25 hover:bg-canvas")}
          >
            <UploadCloud className="size-7 text-brand" aria-hidden />
            <span className="text-sm font-medium">Touchez pour choisir des fichiers</span>
            <span className="hidden text-sm text-muted sm:block">ou glissez-les ici</span>
            <span className="text-xs text-muted">Images, PDF, Word, Excel, ZIP… · {maxMb} Mo max par fichier</span>
            <input ref={inputRef} id="file-input" type="file" multiple accept={accept} className="sr-only" onChange={(e) => void handle(e.target.files)} />
          </label>
          {uploads.length > 0 && (
            <ul className="space-y-2" aria-live="polite">
              {uploads.map((u) => (
                <li key={u.key} className="rounded-xl border border-line px-3 py-2 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate">{u.name}</span>
                    {u.error ? (
                      <button type="button" className="text-xs text-muted hover:text-ink" onClick={() => setUploads((x) => x.filter((y) => y.key !== u.key))}>
                        Fermer
                      </button>
                    ) : (
                      <span className="text-xs tabular-nums text-muted">{u.progress} %</span>
                    )}
                  </div>
                  {u.error ? (
                    <p className="mt-1 text-xs text-danger" role="alert">
                      {u.error}
                    </p>
                  ) : (
                    <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-canvas">
                      <div className="h-full bg-brand transition-[width]" style={{ width: `${u.progress}%` }} />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {error && <Alert>{error}</Alert>}

      {files.length === 0 ? (
        <EmptyState title="Aucun fichier pour le moment." description={readOnly ? undefined : "Logo, photos, textes, charte graphique… déposez ici tout ce qui servira à votre site."} />
      ) : (
        grouped.map(([cat, list]) => (
          <section key={cat}>
            <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">
              {FILE_CATEGORY_LABELS[cat]} ({list.length})
            </h3>
            <ul className="divide-y divide-line rounded-xl border border-line">
              {list.map((f) => {
                const isImage = f.mimeType.startsWith("image/") && f.mimeType !== "image/vnd.adobe.photoshop" && f.mimeType !== "image/heic";
                return (
                  <li key={f.id} className="flex items-center gap-3 px-3 py-2.5">
                    {isImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={`/api/files/${f.id}?inline=1`} alt="" loading="lazy" className="size-10 shrink-0 rounded-lg bg-canvas object-cover" />
                    ) : (
                      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-canvas text-muted">{f.mimeType.startsWith("image/") ? <ImageIcon className="size-4" /> : <FileText className="size-4" />}</span>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm">{f.originalName}</p>
                      <p className="text-xs text-muted">
                        {formatFileSize(f.sizeBytes)} · {formatDate(f.createdAt)}
                        {f.uploadedBy && ` · ${f.uploadedBy.role === "ADMIN" ? "équipe" : f.uploadedBy.firstName}`}
                      </p>
                    </div>
                    <a href={`/api/files/${f.id}`} className="grid size-9 place-items-center rounded-lg text-muted hover:bg-canvas hover:text-ink" aria-label={`Télécharger ${f.originalName}`}>
                      <Download className="size-4" />
                    </a>
                    {f.canDelete && !readOnly && (
                      <button
                        type="button"
                        className="grid size-9 place-items-center rounded-lg text-muted hover:bg-danger-soft hover:text-danger"
                        aria-label={`Supprimer ${f.originalName}`}
                        onClick={() =>
                          confirm(`Supprimer « ${f.originalName} » ?`) &&
                          start(async () => {
                            const res = await deleteFileAction(f.id);
                            if (!res.ok) setError(res.error);
                            router.refresh();
                          })
                        }
                      >
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
