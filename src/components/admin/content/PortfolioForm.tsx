"use client";

import { useActionState } from "react";
import { deletePortfolioAction, savePortfolioAction } from "@/server/actions/admin-content";
import type { ActionResult } from "@/server/actions/result";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { FormMessage } from "@/components/admin/FormMessage";
import { SECTORS, SECTOR_LABELS } from "@/lib/constants";
import { DeleteButton } from "./DeleteButton";

export interface PortfolioValues {
  id: string | null;
  name: string;
  category: string;
  description: string;
  url: string;
  imageUrl: string;
  imageAlt: string;
  imagePreview: string | null;
  technologies: string;
  date: string;
  status: "DRAFT" | "PUBLISHED";
  sortOrder: number;
}

export function PortfolioForm({ v }: { v: PortfolioValues }) {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(savePortfolioAction.bind(null, v.id), null);
  const fe = state && !state.ok ? state.fieldErrors : undefined;
  const p = v.id ?? "new";
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <Field label="Nom du projet" htmlFor={`p-n-${p}`} error={fe?.name}>
        <Input id={`p-n-${p}`} name="name" defaultValue={v.name} required className="text-sm" />
      </Field>
      <Field label="Catégorie" htmlFor={`p-c-${p}`}>
        <Select id={`p-c-${p}`} name="category" defaultValue={v.category} className="text-sm">
          {SECTORS.map((s) => (
            <option key={s} value={s}>
              {SECTOR_LABELS[s]}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Description" htmlFor={`p-d-${p}`} error={fe?.description} className="sm:col-span-2">
        <Textarea id={`p-d-${p}`} name="description" defaultValue={v.description} rows={3} required className="text-sm" />
      </Field>
      <Field label="URL du site" htmlFor={`p-u-${p}`} error={fe?.url}>
        <Input id={`p-u-${p}`} name="url" type="url" defaultValue={v.url} placeholder="https://…" className="text-sm" />
      </Field>
      <Field label="Technologies / fonctionnalités" htmlFor={`p-t-${p}`} hint="Séparées par des virgules">
        <Input id={`p-t-${p}`} name="technologies" defaultValue={v.technologies} className="text-sm" />
      </Field>
      <Field label="Image (téléverser)" htmlFor={`p-i-${p}`} error={fe?.image} hint="JPG, PNG, WebP — idéalement 1600×1200">
        <Input id={`p-i-${p}`} name="image" type="file" accept=".jpg,.jpeg,.png,.webp,.avif,.gif" className="text-sm" />
      </Field>
      <Field label="ou URL d'image externe" htmlFor={`p-iu-${p}`} error={fe?.imageUrl}>
        <Input id={`p-iu-${p}`} name="imageUrl" type="url" defaultValue={v.imageUrl} className="text-sm" />
      </Field>
      {v.imagePreview && (
        <div className="flex items-center gap-3 sm:col-span-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={v.imagePreview} alt="" className="h-16 w-24 rounded-lg object-cover ring-1 ring-line" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="removeImage" className="size-4" /> Retirer l&apos;image
          </label>
        </div>
      )}
      <Field label="Texte alternatif de l'image" htmlFor={`p-alt-${p}`} hint="Décrit l'image (accessibilité, SEO)">
        <Input id={`p-alt-${p}`} name="imageAlt" defaultValue={v.imageAlt} className="text-sm" />
      </Field>
      <div className="grid grid-cols-3 gap-2">
        <Field label="Date" htmlFor={`p-date-${p}`}>
          <Input id={`p-date-${p}`} name="date" type="date" defaultValue={v.date} className="text-sm" />
        </Field>
        <Field label="Statut" htmlFor={`p-s-${p}`}>
          <Select id={`p-s-${p}`} name="status" defaultValue={v.status} className="text-sm">
            <option value="PUBLISHED">Publié</option>
            <option value="DRAFT">Brouillon</option>
          </Select>
        </Field>
        <Field label="Ordre" htmlFor={`p-o-${p}`}>
          <Input id={`p-o-${p}`} name="sortOrder" type="number" min={0} defaultValue={v.sortOrder} className="text-sm" />
        </Field>
      </div>
      <div className="flex flex-col gap-3 sm:col-span-2">
        <FormMessage state={state} />
        <div className="flex items-center justify-between gap-2">
          <Button type="submit" size="sm" pending={pending}>
            {v.id ? "Enregistrer" : "Ajouter la réalisation"}
          </Button>
          {v.id && <DeleteButton action={() => deletePortfolioAction(v.id!)} confirmText="Supprimer cette réalisation ?" />}
        </div>
      </div>
    </form>
  );
}
