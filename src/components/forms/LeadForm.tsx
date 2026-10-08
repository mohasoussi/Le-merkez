"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea, describedBy } from "@/components/ui/Field";
import { Alert } from "@/components/ui/States";
import { cn } from "@/lib/cn";
import {
  BUDGETS,
  BUDGET_LABELS,
  FORM_SECTORS,
  LEAD_SOURCES,
  LEAD_SOURCE_LABELS,
  NEEDS,
  NEED_LABELS,
  PROJECT_TYPES,
  PROJECT_TYPE_LABELS,
  SECTOR_LABELS,
  TIMELINES,
  TIMELINE_LABELS,
} from "@/lib/constants";
import { LEAD_STEPS, leadStepSchemas, type LeadStep } from "@/lib/validation/lead";
import { readAttribution } from "@/components/landing/UtmCapture";

type Values = Record<string, string | string[] | boolean>;
type Errors = Record<string, string>;

const STEP_TITLES: Record<LeadStep, { title: string; subtitle: string }> = {
  project: { title: "Votre projet", subtitle: "Quelques questions rapides pour cerner votre besoin." },
  needs: { title: "Vos besoins", subtitle: "Ce que votre site doit permettre à vos visiteurs." },
  company: { title: "Votre entreprise", subtitle: "Pour comprendre votre activité." },
  contact: { title: "Vos coordonnées", subtitle: "Pour vous recontacter au sujet de votre projet." },
};

const DRAFT_KEY = "lead-form-draft";
const INITIAL: Values = { needs: [], country: "France", consent: false };

declare global {
  interface Window {
    turnstile?: { render: (el: HTMLElement, opts: Record<string, unknown>) => string; reset: (id?: string) => void };
  }
}

export function LeadForm({ formToken, defaultOfferSlug, offerName, turnstileSiteKey }: { formToken: string; defaultOfferSlug?: string; offerName?: string; turnstileSiteKey?: string }) {
  const [values, setValues] = useState<Values>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const [stepIndex, setStepIndex] = useState(0);
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const step = LEAD_STEPS[stepIndex]!;

  // Restaure un brouillon (rechargement de page, retour arrière…)
  useEffect(() => {
    try {
      const draft = sessionStorage.getItem(DRAFT_KEY);
      if (draft) setValues({ ...INITIAL, ...(JSON.parse(draft) as Values), consent: false });
    } catch {}
  }, []);

  useEffect(() => {
    if (status !== "idle") return;
    try {
      const { consent: _c, ...rest } = values;
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(rest));
    } catch {}
  }, [values, status]);

  // Cloudflare Turnstile (uniquement si configuré)
  useEffect(() => {
    if (!turnstileSiteKey || step !== "contact") return;
    const render = () => {
      if (turnstileRef.current && window.turnstile && !turnstileRef.current.dataset.rendered) {
        turnstileRef.current.dataset.rendered = "1";
        window.turnstile.render(turnstileRef.current, { sitekey: turnstileSiteKey, callback: (t: string) => setTurnstileToken(t), language: "fr" });
      }
    };
    if (window.turnstile) return render();
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    s.async = true;
    s.onload = render;
    document.head.appendChild(s);
  }, [turnstileSiteKey, step]);

  const set = (name: string, value: Values[string]) => {
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors(({ [name]: _removed, ...rest }) => rest);
  };
  const str = (name: string) => (typeof values[name] === "string" ? (values[name] as string) : "");

  function focusFirstError(errs: Errors) {
    const first = Object.keys(errs)[0];
    if (!first) return;
    requestAnimationFrame(() => {
      const el = formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`);
      el?.focus();
      el?.scrollIntoView({ block: "center", behavior: "smooth" });
    });
  }

  function validateStep(s: LeadStep): Errors {
    const res = leadStepSchemas[s].safeParse(values);
    if (res.success) return {};
    const out: Errors = {};
    for (const i of res.error.issues) {
      const key = String(i.path[0]);
      out[key] ??= i.message;
    }
    return out;
  }

  function goTo(index: number) {
    setStepIndex(index);
    setGlobalError(null);
    requestAnimationFrame(() => {
      headingRef.current?.focus();
      formRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
    });
  }

  function next() {
    const errs = validateStep(step);
    setErrors(errs);
    if (Object.keys(errs).length) return focusFirstError(errs);
    goTo(stepIndex + 1);
  }

  async function submit() {
    // Re-valide toutes les étapes avant envoi
    for (let i = 0; i < LEAD_STEPS.length; i++) {
      const errs = validateStep(LEAD_STEPS[i]!);
      if (Object.keys(errs).length) {
        setErrors(errs);
        if (i !== stepIndex) goTo(i);
        return focusFirstError(errs);
      }
    }
    setStatus("submitting");
    setGlobalError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          heardFrom: str("heardFrom") || undefined,
          offerSlug: defaultOfferSlug,
          attribution: readAttribution(),
          formToken,
          turnstileToken: turnstileToken || undefined,
          website2: (formRef.current?.elements.namedItem("website2") as HTMLInputElement | null)?.value ?? "",
        }),
      });
      if (res.ok) {
        setStatus("success");
        try {
          sessionStorage.removeItem(DRAFT_KEY);
        } catch {}
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { error?: string; fieldErrors?: Errors };
      setStatus("idle");
      if (data.fieldErrors && Object.keys(data.fieldErrors).length) {
        setErrors(data.fieldErrors);
        const field = Object.keys(data.fieldErrors)[0]!;
        const owner = LEAD_STEPS.findIndex((s) => field in leadStepSchemas[s].shape);
        if (owner >= 0 && owner !== stepIndex) goTo(owner);
        focusFirstError(data.fieldErrors);
      }
      setGlobalError(data.error ?? "Une erreur est survenue. Veuillez réessayer.");
      if (turnstileSiteKey) window.turnstile?.reset();
    } catch {
      setStatus("idle");
      setGlobalError("Connexion impossible. Vérifiez votre réseau et réessayez.");
    }
  }

  if (status === "success") {
    return (
      <div className="animate-fade-up rounded-3xl border border-line bg-white p-8 text-center shadow-soft sm:p-12" role="status">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-success-soft text-success">
          <CheckCircle2 className="size-7" aria-hidden />
        </span>
        <h2 className="mt-6 text-2xl font-semibold tracking-tight">Merci !</h2>
        <p className="mx-auto mt-3 max-w-md text-lg leading-relaxed text-ink-soft">Votre demande a bien été reçue. Nous allons étudier votre projet et revenir vers vous.</p>
        <Link href="/" className="mt-8 inline-block text-sm font-medium text-brand hover:underline">
          Retour à l&apos;accueil
        </Link>
      </div>
    );
  }

  const progress = ((stepIndex + 1) / LEAD_STEPS.length) * 100;
  const err = (n: string) => errors[n];
  const inputProps = (name: string, hint?: boolean) => ({
    id: name,
    name,
    value: str(name),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => set(name, e.target.value),
    "aria-invalid": !!err(name),
    "aria-describedby": describedBy(name, err(name), hint),
  });

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (stepIndex < LEAD_STEPS.length - 1) next();
        else void submit();
      }}
      className="relative scroll-mt-24 rounded-3xl border border-line bg-white shadow-soft"
    >
      <div className="border-b border-line px-5 pb-5 pt-6 sm:px-8">
        <div className="mb-4 flex items-center justify-between text-xs font-medium text-muted">
          <span>
            Étape {stepIndex + 1} sur {LEAD_STEPS.length}
          </span>
          {offerName && <span className="rounded-full bg-brand-soft px-2.5 py-1 text-brand-strong">Offre {offerName}</span>}
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-canvas" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)} aria-label="Progression du formulaire">
          <div className="h-full rounded-full bg-brand transition-[width] duration-500" style={{ width: `${progress}%` }} />
        </div>
        <h2 ref={headingRef} tabIndex={-1} className="mt-6 text-xl font-semibold tracking-tight outline-none">
          {STEP_TITLES[step].title}
        </h2>
        <p className="mt-1 text-sm text-muted">{STEP_TITLES[step].subtitle}</p>
      </div>

      <div className="flex flex-col gap-6 px-5 py-6 sm:px-8 sm:py-8">
        {globalError && <Alert>{globalError}</Alert>}

        {/* Honeypot : invisible pour les humains, rempli par les robots */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="website2">Ne pas remplir</label>
          <input id="website2" name="website2" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
        </div>

        {step === "project" && (
          <>
            <ChoiceGroup name="projectType" legend="Type de projet" options={PROJECT_TYPES.map((v) => [v, PROJECT_TYPE_LABELS[v]])} value={str("projectType")} onChange={(v) => set("projectType", v)} error={err("projectType")} />
            <ChoiceGroup name="sector" legend="Votre secteur" options={FORM_SECTORS.map((v) => [v, SECTOR_LABELS[v]])} value={str("sector")} onChange={(v) => set("sector", v)} error={err("sector")} />
            <ChoiceGroup name="budget" legend="Budget envisagé" options={BUDGETS.map((v) => [v, BUDGET_LABELS[v]])} value={str("budget")} onChange={(v) => set("budget", v)} error={err("budget")} />
            <ChoiceGroup name="timeline" legend="Délai souhaité" options={TIMELINES.map((v) => [v, TIMELINE_LABELS[v]])} value={str("timeline")} onChange={(v) => set("timeline", v)} error={err("timeline")} />
          </>
        )}

        {step === "needs" && (
          <>
            <fieldset>
              <legend className="mb-3 text-sm font-medium">Besoins (plusieurs choix possibles)</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {NEEDS.map((n) => {
                  const list = (values.needs as string[]) ?? [];
                  const checked = list.includes(n);
                  return (
                    <label key={n} className={cn("flex cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-3 text-sm transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand/15", checked ? "border-brand bg-brand-soft/60" : "border-line hover:border-ink/20")}>
                      <input type="checkbox" name="needs" value={n} checked={checked} onChange={() => set("needs", checked ? list.filter((x) => x !== n) : [...list, n])} className="size-4 accent-[var(--color-brand)]" />
                      {NEED_LABELS[n]}
                    </label>
                  );
                })}
              </div>
            </fieldset>
            {((values.needs as string[]) ?? []).includes("OTHER") && (
              <Field label="Autre besoin" htmlFor="needsOther" error={err("needsOther")}>
                <Input {...inputProps("needsOther")} />
              </Field>
            )}
            <Field label="Décrivez votre projet et ce que vous aimeriez obtenir." htmlFor="description" error={err("description")} required hint="Votre activité, vos clients, ce qui vous manque aujourd'hui…">
              <Textarea {...inputProps("description", true)} rows={5} />
            </Field>
            <Field label="Avez-vous des sites internet que vous aimez ?" htmlFor="references" error={err("references")} hint="Liens ou noms de sites, et ce qui vous plaît.">
              <Textarea {...inputProps("references", true)} rows={3} />
            </Field>
          </>
        )}

        {step === "company" && (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Nom de l'entreprise" htmlFor="companyName" error={err("companyName")} required>
              <Input {...inputProps("companyName")} autoComplete="organization" />
            </Field>
            <Field label="Activité" htmlFor="activity" error={err("activity")} required>
              <Input {...inputProps("activity")} placeholder="Ex. boulangerie, plombier, coach…" />
            </Field>
            <Field label="Ville" htmlFor="city" error={err("city")} required>
              <Input {...inputProps("city")} autoComplete="address-level2" />
            </Field>
            <Field label="Pays" htmlFor="country" error={err("country")} required>
              <Input {...inputProps("country")} autoComplete="country-name" />
            </Field>
            <Field label="Site actuel" htmlFor="currentWebsite" error={err("currentWebsite")} className="sm:col-span-2">
              <Input {...inputProps("currentWebsite")} inputMode="url" placeholder="www.monsite.fr (si vous en avez un)" />
            </Field>
            <Field label="Instagram" htmlFor="instagram" error={err("instagram")}>
              <Input {...inputProps("instagram")} placeholder="@moncompte" />
            </Field>
            <Field label="Facebook" htmlFor="facebook" error={err("facebook")}>
              <Input {...inputProps("facebook")} />
            </Field>
            <Field label="Autre réseau social" htmlFor="otherSocial" error={err("otherSocial")} className="sm:col-span-2">
              <Input {...inputProps("otherSocial")} placeholder="TikTok, LinkedIn…" />
            </Field>
          </div>
        )}

        {step === "contact" && (
          <>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Prénom" htmlFor="firstName" error={err("firstName")} required>
                <Input {...inputProps("firstName")} autoComplete="given-name" />
              </Field>
              <Field label="Nom" htmlFor="lastName" error={err("lastName")} required>
                <Input {...inputProps("lastName")} autoComplete="family-name" />
              </Field>
              <Field label="Email" htmlFor="email" error={err("email")} required>
                <Input {...inputProps("email")} type="email" autoComplete="email" inputMode="email" />
              </Field>
              <Field label="Téléphone" htmlFor="phone" error={err("phone")} required>
                <Input {...inputProps("phone")} type="tel" autoComplete="tel" inputMode="tel" />
              </Field>
              <Field label="Comment nous avez-vous connu ?" htmlFor="heardFrom" error={err("heardFrom")} className="sm:col-span-2">
                <Select {...inputProps("heardFrom")}>
                  <option value="">— Facultatif —</option>
                  {LEAD_SOURCES.map((s) => (
                    <option key={s} value={s}>
                      {LEAD_SOURCE_LABELS[s]}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
            <div>
              <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-canvas p-4 text-sm leading-relaxed text-ink-soft">
                <input
                  type="checkbox"
                  name="consent"
                  checked={values.consent === true}
                  onChange={(e) => set("consent", e.target.checked)}
                  aria-invalid={!!err("consent")}
                  aria-describedby={err("consent") ? "consent-error" : undefined}
                  className="mt-0.5 size-4 shrink-0 accent-[var(--color-brand)]"
                />
                <span>
                  J&apos;accepte que les informations saisies soient utilisées pour étudier ma demande et me recontacter. Elles ne sont ni vendues ni transmises à des tiers.{" "}
                  <Link href="/confidentialite" target="_blank" className="font-medium text-ink underline underline-offset-2">
                    Politique de confidentialité
                  </Link>
                  <span className="text-danger"> *</span>
                </span>
              </label>
              {err("consent") && (
                <p id="consent-error" role="alert" className="mt-1.5 text-xs font-medium text-danger">
                  {err("consent")}
                </p>
              )}
            </div>
            {turnstileSiteKey && <div ref={turnstileRef} />}
          </>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-line px-5 py-4 sm:px-8">
        {stepIndex > 0 ? (
          <Button type="button" variant="ghost" onClick={() => goTo(stepIndex - 1)}>
            <ArrowLeft className="size-4" aria-hidden /> Retour
          </Button>
        ) : (
          <span />
        )}
        {stepIndex < LEAD_STEPS.length - 1 ? (
          <Button type="submit">
            Continuer <ArrowRight className="size-4" aria-hidden />
          </Button>
        ) : (
          <Button type="submit" variant="brand" pending={status === "submitting"}>
            Envoyer ma demande
          </Button>
        )}
      </div>
    </form>
  );
}

/** Groupe de choix unique, rendu en « cartes » tactiles mais basé sur de vrais boutons radio (clavier, lecteurs d'écran). */
function ChoiceGroup({ name, legend, options, value, onChange, error }: { name: string; legend: ReactNode; options: [string, string][]; value: string; onChange: (v: string) => void; error?: string }) {
  return (
    <fieldset aria-describedby={error ? `${name}-error` : undefined}>
      <legend className="mb-3 text-sm font-medium">
        {legend}
        <span className="text-danger" aria-hidden="true">
          {" "}
          *
        </span>
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map(([v, label]) => (
          <label
            key={v}
            className={cn(
              "cursor-pointer rounded-xl border px-3.5 py-2.5 text-sm transition-[background,border-color,box-shadow] has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand/15",
              value === v ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink/25",
            )}
          >
            <input type="radio" name={name} value={v} checked={value === v} onChange={() => onChange(v)} className="sr-only" />
            {label}
          </label>
        ))}
      </div>
      {error && (
        <p id={`${name}-error`} role="alert" className="mt-2 text-xs font-medium text-danger">
          {error}
        </p>
      )}
    </fieldset>
  );
}
