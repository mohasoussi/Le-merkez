import type { Metadata } from "next";
import { Clock, MessageCircle, ShieldCheck } from "lucide-react";
import { LeadForm } from "@/components/forms/LeadForm";
import { createFormToken } from "@/server/security/antispam";
import { getPublicOffers } from "@/server/public-content";

export const metadata: Metadata = {
  title: "Demander mon estimation",
  description: "Présentez votre projet de site internet en quelques minutes. Nous vous recontactons pour l'étudier avec vous.",
  alternates: { canonical: "/demande" },
};

export default async function DemandePage({ searchParams }: { searchParams: Promise<{ offre?: string }> }) {
  const { offre } = await searchParams;
  const offers = await getPublicOffers();
  const offer = offers.find((o) => o.slug === offre && o.type === "SITE");

  return (
    <div className="bg-canvas">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-20 pt-10 sm:px-6 sm:pt-14 lg:grid-cols-[1fr_1.6fr] lg:gap-14">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-sm font-medium text-brand">Demande d&apos;estimation</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-balance sm:text-4xl">Parlons de votre projet.</h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">Quelques minutes suffisent. Plus vous êtes précis, plus notre proposition sera adaptée.</p>
          <ul className="mt-8 hidden space-y-4 text-sm text-ink-soft sm:block">
            <li className="flex gap-3">
              <Clock className="size-5 shrink-0 text-brand" aria-hidden /> Environ 3 minutes pour remplir le formulaire.
            </li>
            <li className="flex gap-3">
              <MessageCircle className="size-5 shrink-0 text-brand" aria-hidden /> Nous vous recontactons pour échanger sur votre projet.
            </li>
            <li className="flex gap-3">
              <ShieldCheck className="size-5 shrink-0 text-brand" aria-hidden /> Vos informations restent confidentielles.
            </li>
          </ul>
        </div>
        <LeadForm formToken={createFormToken()} defaultOfferSlug={offer?.slug} offerName={offer?.name} turnstileSiteKey={process.env.TURNSTILE_SITE_KEY || undefined} />
      </div>
    </div>
  );
}
