"use client";

import { useActionState } from "react";
import { saveSettingsAction } from "@/server/actions/admin-content";
import type { ActionResult } from "@/server/actions/result";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { FormMessage } from "@/components/admin/FormMessage";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";

type V = Record<string, string | number | null>;

export function SettingsForm({ v }: { v: V }) {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(saveSettingsAction, null);
  const fe = state && !state.ok ? state.fieldErrors : undefined;
  const f = (name: string, label: string, opts: { long?: boolean; type?: string; hint?: string; full?: boolean; value?: string } = {}) => (
    <Field label={label} htmlFor={`s-${name}`} error={fe?.[name]} hint={opts.hint} className={opts.full || opts.long ? "sm:col-span-2" : undefined}>
      {opts.long ? (
        <Textarea id={`s-${name}`} name={name} defaultValue={String(v[name] ?? "")} rows={2} className="text-sm" />
      ) : (
        <Input id={`s-${name}`} name={name} type={opts.type ?? "text"} defaultValue={opts.value ?? String(v[name] ?? "")} className="text-sm" />
      )}
    </Field>
  );
  return (
    <form action={action} className="flex flex-col gap-6">
      <Card>
        <CardHeader title="Identité & textes principaux" description="Textes affichés sur la page d'accueil." />
        <CardBody className="grid gap-4 sm:grid-cols-2">
          {f("brandName", "Nom de la marque", { hint: "Affiché dans l'en-tête, les emails et le titre des pages." })}
          <span />
          {f("heroTitle", "Titre principal (hero)", { long: true })}
          {f("heroSubtitle", "Sous-titre (hero)", { long: true })}
          {f("problemQuote", "Message de la section « Le constat »", { long: true })}
          {f("ctaTitle", "Titre de l'appel à l'action final")}
          {f("ctaSubtitle", "Texte de l'appel à l'action final", { long: true })}
        </CardBody>
      </Card>
      <Card>
        <CardHeader title="Référencement (SEO)" />
        <CardBody className="grid gap-4 sm:grid-cols-2">
          {f("seoTitle", "Titre des pages", { full: true })}
          {f("seoDescription", "Meta description", { long: true, hint: "≈ 150 caractères." })}
        </CardBody>
      </Card>
      <Card>
        <CardHeader title="Coordonnées & réseaux sociaux" />
        <CardBody className="grid gap-4 sm:grid-cols-2">
          {f("contactEmail", "Email de contact", { type: "email" })}
          {f("phone", "Téléphone", { type: "tel" })}
          {f("address", "Adresse")}
          {f("city", "Ville")}
          {f("instagramUrl", "Instagram (URL)", { type: "url" })}
          {f("tiktokUrl", "TikTok (URL)", { type: "url" })}
          {f("facebookUrl", "Facebook (URL)", { type: "url" })}
          {f("linkedinUrl", "LinkedIn (URL)", { type: "url" })}
        </CardBody>
      </Card>
      <Card>
        <CardHeader title="Mentions légales & devis" description="Utilisées sur les pages légales et les devis imprimés. À faire valider par un professionnel." />
        <CardBody className="grid gap-4 sm:grid-cols-2">
          {f("legalName", "Raison sociale / nom")}
          {f("legalForm", "Forme juridique", { hint: "Ex. Micro-entreprise, SASU…" })}
          {f("siret", "SIRET")}
          {f("vatNumber", "N° de TVA intracommunautaire")}
          {f("hostingInfo", "Hébergeur du site (nom, adresse, téléphone)", { long: true })}
          {f("vatRate", "Taux de TVA par défaut (%)", { type: "number", value: String(Number(v.vatRateBps ?? 0) / 100) })}
          {f("vatMention", "Mention si TVA non applicable")}
          {f("depositPercent", "Acompte (%)", { type: "number" })}
          {f("quoteValidityDays", "Validité des devis (jours)", { type: "number" })}
        </CardBody>
      </Card>
      <div className="sticky bottom-4 z-10 flex flex-col gap-2 rounded-2xl border border-line bg-white/95 p-3 shadow-lift backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <FormMessage state={state} />
        <Button type="submit" pending={pending} className="sm:ml-auto">
          Enregistrer les paramètres
        </Button>
      </div>
    </form>
  );
}
