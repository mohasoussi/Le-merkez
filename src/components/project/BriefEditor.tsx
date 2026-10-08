"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Check, CloudOff, Loader2 } from "lucide-react";
import { saveBriefAction, submitBriefAction } from "@/server/actions/project-space";
import { BRIEF_SECTIONS, type BriefData } from "@/lib/validation/brief";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { Alert } from "@/components/ui/States";

type SaveState = "idle" | "saving" | "saved" | "error";

/** Brief avec sauvegarde automatique (1,2 s après la dernière frappe, et à la fermeture de la page). */
export function BriefEditor({ projectId, initial, onSubmittedHref }: { projectId: string; initial: BriefData; onSubmittedHref?: string }) {
  const [data, setData] = useState<BriefData>(initial);
  const [save, setSave] = useState<SaveState>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [pending, start] = useTransition();
  const dirty = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latest = useRef(data);
  latest.current = data;

  async function flush() {
    if (!dirty.current) return;
    dirty.current = false;
    setSave("saving");
    const res = await saveBriefAction(projectId, latest.current);
    if (res.ok) setSave("saved");
    else {
      dirty.current = true;
      setSave("error");
      setError(res.error);
    }
  }

  useEffect(() => {
    const onHide = () => void flush();
    window.addEventListener("pagehide", onHide);
    document.addEventListener("visibilitychange", onHide);
    return () => {
      window.removeEventListener("pagehide", onHide);
      document.removeEventListener("visibilitychange", onHide);
      if (timer.current) clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function update(section: keyof BriefData, key: string, value: string) {
    setData((d) => ({ ...d, [section]: { ...d[section], [key]: value } }));
    setErrors(({ [`${section}.${key}`]: _r, ...rest }) => rest);
    dirty.current = true;
    setSave("idle");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => void flush(), 1200);
  }

  function submit() {
    setError(null);
    start(async () => {
      if (timer.current) clearTimeout(timer.current);
      const res = await submitBriefAction(projectId, latest.current);
      if (res.ok) {
        dirty.current = false;
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (onSubmittedHref) window.location.assign(onSubmittedHref);
      } else {
        setError(res.error);
        setErrors(res.fieldErrors ?? {});
        const first = Object.keys(res.fieldErrors ?? {})[0];
        if (first) document.getElementById(`brief-${first.replace(".", "-")}`)?.focus();
      }
    });
  }

  if (submitted) return <Alert tone="success">Merci ! Votre brief a bien été envoyé. Nous revenons vers vous rapidement.</Alert>;

  return (
    <div className="flex flex-col gap-6">
      <div className="sticky top-14 z-10 -mx-1 flex items-center justify-end gap-2 bg-canvas/90 px-1 py-2 text-xs text-muted backdrop-blur lg:top-0" aria-live="polite">
        {save === "saving" && (
          <>
            <Loader2 className="size-3.5 animate-spin" aria-hidden /> Enregistrement…
          </>
        )}
        {save === "saved" && (
          <>
            <Check className="size-3.5 text-success" aria-hidden /> Enregistré automatiquement
          </>
        )}
        {save === "error" && (
          <>
            <CloudOff className="size-3.5 text-danger" aria-hidden /> Non enregistré — vérifiez votre connexion
          </>
        )}
        {save === "idle" && "Vos réponses sont enregistrées automatiquement."}
      </div>

      {BRIEF_SECTIONS.map((section, i) => (
        <section key={section.key} className="rounded-2xl border border-line bg-white p-5 shadow-soft sm:p-6" aria-labelledby={`brief-section-${section.key}`}>
          <p className="font-mono text-xs text-brand">{String(i + 1).padStart(2, "0")}</p>
          <h2 id={`brief-section-${section.key}`} className="mt-1 text-lg font-semibold">
            {section.title}
          </h2>
          <p className="mb-5 text-sm text-muted">{section.description}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {section.fields.map((f) => {
              const fieldId = `brief-${section.key}-${f.key}`;
              const value = (data[section.key] as Record<string, string | undefined>)[f.key] ?? "";
              const err = errors[`${section.key}.${f.key}`];
              return (
                <Field key={f.key} label={f.label} htmlFor={fieldId} hint={f.hint} error={err} className={f.long ? "sm:col-span-2" : undefined}>
                  {f.long ? (
                    <Textarea id={fieldId} value={value} rows={3} onChange={(e) => update(section.key, f.key, e.target.value)} aria-invalid={!!err} className="text-sm" />
                  ) : (
                    <Input id={fieldId} value={value} onChange={(e) => update(section.key, f.key, e.target.value)} aria-invalid={!!err} className="text-sm" />
                  )}
                </Field>
              );
            })}
          </div>
        </section>
      ))}

      {error && <Alert>{error}</Alert>}
      <div className="flex flex-col items-start gap-2 rounded-2xl border border-line bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">Vous pouvez revenir plus tard : rien n&apos;est perdu. Envoyez le brief quand il est prêt.</p>
        <Button type="button" variant="brand" pending={pending} onClick={submit}>
          Envoyer mon brief
        </Button>
      </div>
    </div>
  );
}
