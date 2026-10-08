import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { buttonClass } from "@/components/ui/Button";
import { PhoneMockup, SiteMockup } from "./SiteMockup";

export function Hero({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <section className="relative overflow-hidden">
      {/* Halo décoratif */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-40 -z-10 mx-auto h-[36rem] max-w-5xl bg-[radial-gradient(closest-side,rgb(99_102_241/0.16),transparent)]" />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,transparent,white_85%),linear-gradient(to_right,rgb(10_10_15/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(10_10_15/0.04)_1px,transparent_1px)] bg-[size:auto,44px_44px,44px_44px]" />

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-10 sm:px-6 sm:pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:pb-24 lg:pt-20">
        <div className="animate-fade-up text-center lg:text-left">
          <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-line bg-white/80 px-3 py-1 text-xs font-medium text-ink-soft shadow-soft lg:mx-0">
            <span className="size-1.5 rounded-full bg-success" />
            <span className="sm:hidden">Pour les pros et indépendants</span>
            <span className="hidden sm:inline">Sites pour petites entreprises, commerces et indépendants</span>
          </p>
          <h1 className="mx-auto mt-5 max-w-xl text-[2.35rem] font-semibold leading-[1.08] tracking-[-0.035em] text-balance sm:text-5xl lg:mx-0 lg:text-[3.6rem]">{title}</h1>
          <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-ink-soft text-pretty lg:mx-0">{subtitle}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link href="/demande" className={buttonClass("primary", "lg", "group")}>
              Créer mon site
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
            <a href="#realisations" className={buttonClass("secondary", "lg")}>
              Voir les réalisations
            </a>
          </div>
          <ul className="mx-auto mt-8 flex max-w-md flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-muted lg:mx-0 lg:justify-start">
            {["Pensé pour le mobile", "Devis gratuit", "Accompagnement de A à Z"].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <Check className="size-4 text-success" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto h-[300px] w-[92%] max-w-[520px] sm:h-[420px] sm:w-full" aria-hidden="true">
          <SiteMockup theme="consultant" className="absolute right-0 top-0 w-[72%] rotate-[3deg] animate-float [animation-delay:-2s]" />
          <SiteMockup theme="artisan" className="absolute bottom-6 left-[3%] w-[62%] -rotate-[4deg] animate-float [animation-delay:-4s]" compact />
          <SiteMockup theme="restaurant" className="absolute left-[14%] top-[22%] w-[70%] animate-float" />
          <PhoneMockup theme="restaurant" className="absolute -bottom-2 right-[4%] w-24 rotate-[6deg] sm:w-32" />
        </div>
      </div>
    </section>
  );
}
