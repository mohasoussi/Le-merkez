"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { gsap, MQ, useGSAP } from "@/components/motion/gsap";
import RevealText from "@/components/motion/RevealText";
import Button from "@/components/ui/Button";
import PatchField from "@/components/ui/PatchField";
import { donation, type DonationGoal } from "@/content/donation";
import { site } from "@/content/site";

const eur = (n: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

/** Progression animée — affichée uniquement si un objectif chiffré réel est renseigné. */
function GoalProgress({ goal }: { goal: DonationGoal }) {
  const ref = useRef<HTMLDivElement>(null);
  const has = goal.target != null && goal.target > 0 && goal.collected != null;
  const pct = has ? Math.min(100, (goal.collected! / goal.target!) * 100) : 0;

  useGSAP(
    () => {
      if (!has) return;
      const counter = { v: 0 };
      const out = ref.current!.querySelector<HTMLElement>("[data-count]")!;
      gsap.from("[data-bar]", { scaleX: 0, duration: 2.2, ease: "expo.out", scrollTrigger: { trigger: ref.current, start: "top 85%", once: true } });
      gsap.to(counter, {
        v: goal.collected!,
        duration: 2.2,
        ease: "expo.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
        onUpdate: () => (out.textContent = eur(counter.v)),
      });
    },
    { scope: ref },
  );

  if (!has) {
    return site.showPlaceholderLabels ? <p className="ph-label mt-4 text-cream/45">{donation.targetPlaceholder}</p> : null;
  }
  return (
    <div ref={ref} className="mt-5">
      <div className="h-1 w-full bg-cream/15">
        <div data-bar className="h-full origin-left bg-saffron" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-2 flex justify-between text-xs text-cream/70">
        <span data-count>{eur(goal.collected!)}</span>
        <span>sur {eur(goal.target!)}</span>
      </p>
    </div>
  );
}

/**
 * CONTRIBUEZ À LA CONSTRUCTION DU MERKEZ.
 * Aucun paiement n'est simulé : le formulaire délègue à /api/donate ou à `externalDonationUrl`.
 */
export default function Donation() {
  const root = useRef<HTMLElement>(null);
  const uid = useId();
  const [goal, setGoal] = useState<DonationGoal["id"]>(donation.goals[0].id);
  const [preset, setPreset] = useState<number | "other">(donation.defaultAmount);
  const [custom, setCustom] = useState("");
  const [status, setStatus] = useState<{ kind: "idle" | "loading" | "info" | "error"; message?: string }>({ kind: "idle" });
  const customRef = useRef<HTMLInputElement>(null);

  const amount = custom.trim() ? Number(custom.replace(",", ".")) : preset === "other" ? NaN : preset;
  const valid = Number.isFinite(amount) && amount >= donation.minAmount;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MQ.desktop}, ${MQ.mobile}`, () => {
        gsap.from("[data-don-patch] > div > div", {
          opacity: 0,
          scale: 0,
          duration: 1,
          ease: "expo.out",
          stagger: { each: 0.02, from: "center" },
          scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
        });
        gsap.from("[data-don-card]", {
          y: 60,
          opacity: 0,
          duration: 1.4,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-don-card]", start: "top 85%", once: true },
        });
      });
    },
    { scope: root },
  );

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!valid) {
      setStatus({ kind: "error", message: "Merci d’indiquer un montant valide." });
      return;
    }
    if (donation.externalDonationUrl) {
      window.location.href = donation.externalDonationUrl;
      return;
    }
    setStatus({ kind: "loading" });
    try {
      const res = await fetch("/api/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, goalId: goal }),
      });
      const data = (await res.json()) as { status: string; message?: string; redirectUrl?: string };
      if (data.status === "ok" && data.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      }
      setStatus({
        kind: data.status === "not_configured" ? "info" : "error",
        message: data.message ?? "Une erreur est survenue.",
      });
    } catch {
      setStatus({ kind: "error", message: "Connexion impossible. Merci de réessayer." });
    }
  }

  return (
    <section ref={root} id="soutenir" aria-labelledby="donation-title" className="grain relative overflow-hidden bg-madder text-cream">
      <div data-don-patch aria-hidden="true" className="absolute inset-y-0 right-0 w-[45%] opacity-25 max-lg:hidden" style={{ maskImage: "linear-gradient(to left, black, transparent)", WebkitMaskImage: "linear-gradient(to left, black, transparent)" }}>
        <PatchField cols={6} rows={10} seed={71} gap={3} />
      </div>

      <div className="gutter relative z-[2] mx-auto grid max-w-[1600px] gap-14 py-28 md:py-40 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="eyebrow mb-6 flex items-center gap-4 text-saffron">
            <span aria-hidden="true" className="stitch inline-block w-10" />
            {donation.eyebrow}
          </p>
          <RevealText as="h2" id="donation-title" className="display text-[clamp(2.2rem,5vw,4.8rem)] uppercase">
            {donation.title}
          </RevealText>
          <RevealText className="mt-8 max-w-xl font-serif text-[clamp(1.3rem,2vw,1.8rem)] italic leading-snug text-cream/90">
            {`« ${donation.text} »`}
          </RevealText>
        </div>

        <form
          data-don-card
          onSubmit={submit}
          className="glass rounded-[4px] p-6 md:p-10 lg:col-span-5 lg:col-start-8"
          aria-describedby={`${uid}-status`}
        >
          <fieldset>
            <legend className="eyebrow mb-4 text-cream/70">Je soutiens</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {donation.goals.map((g) => (
                <label
                  key={g.id}
                  className={`relative cursor-pointer border p-5 transition-colors duration-300 ${goal === g.id ? "border-saffron bg-night/30" : "border-cream/25 hover:border-cream/60"}`}
                >
                  <input type="radio" name="goal" value={g.id} checked={goal === g.id} onChange={() => setGoal(g.id)} className="sr-only" />
                  <span className="eyebrow block text-saffron">{g.label}</span>
                  <span className="mt-2 block text-lg font-light uppercase tracking-wide">{g.title}</span>
                  <span className="mt-1 block text-sm leading-snug text-cream/75">{g.description}</span>
                  <GoalProgress goal={g} />
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-8">
            <legend className="eyebrow mb-4 text-cream/70">Montant</legend>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {donation.amounts.map((a) => (
                <button
                  key={a}
                  type="button"
                  aria-pressed={!custom && preset === a}
                  onClick={() => {
                    setPreset(a);
                    setCustom("");
                  }}
                  className={`rounded-full border py-3 text-sm font-medium transition-all duration-300 active:scale-95 ${
                    !custom && preset === a ? "border-cream bg-cream text-madder" : "border-cream/30 hover:border-cream"
                  }`}
                >
                  {a} €
                </button>
              ))}
              <button
                type="button"
                aria-pressed={preset === "other" || Boolean(custom)}
                onClick={() => {
                  setPreset("other");
                  customRef.current?.focus();
                }}
                className={`col-span-2 rounded-full border py-3 text-[0.68rem] font-semibold uppercase tracking-[0.16em] transition-all duration-300 active:scale-95 sm:col-span-1 ${
                  preset === "other" || custom ? "border-cream bg-cream text-madder" : "border-cream/30 hover:border-cream"
                }`}
              >
                Autre
              </button>
            </div>
            <label htmlFor={`${uid}-custom`} className="mt-5 block text-xs uppercase tracking-[0.18em] text-cream/70">
              Montant libre
            </label>
            <div className="mt-2 flex items-center border-b border-cream/40 focus-within:border-saffron">
              <input
                ref={customRef}
                id={`${uid}-custom`}
                inputMode="decimal"
                autoComplete="off"
                placeholder="Votre montant"
                value={custom}
                onChange={(e) => setCustom(e.target.value.replace(/[^\d.,]/g, ""))}
                className="w-full bg-transparent py-3 text-2xl font-light outline-none placeholder:text-cream/35"
              />
              <span className="text-xl text-cream/70">€</span>
            </div>
          </fieldset>

          <Button type="submit" variant="solid" className="mt-8 w-full" disabled={status.kind === "loading"}>
            {status.kind === "loading" ? "Un instant…" : `${donation.cta}${valid ? ` — ${eur(amount)}` : ""}`}
          </Button>

          <p id={`${uid}-status`} role="status" aria-live="polite" className={`mt-4 min-h-[1.25rem] text-sm ${status.kind === "error" ? "text-saffron" : "text-cream/85"}`}>
            {status.message}
          </p>
          {site.showPlaceholderLabels && <p className="ph-label mt-2 text-cream/40">{donation.legalNote}</p>}
        </form>
      </div>
    </section>
  );
}
