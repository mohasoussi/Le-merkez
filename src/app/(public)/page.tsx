import { Hero } from "@/components/landing/Hero";
import { Audience } from "@/components/landing/Audience";
import { Problem } from "@/components/landing/Problem";
import { Portfolio } from "@/components/landing/Portfolio";
import { Offers } from "@/components/landing/Offers";
import { Steps } from "@/components/landing/Steps";
import { Faq } from "@/components/landing/Faq";
import { FinalCta } from "@/components/landing/FinalCta";
import { getPublicFaqs, getPublicOffers, getPublicOptions, getPublicPortfolio, getPublicSettings } from "@/server/public-content";
import { JsonLd } from "@/components/landing/JsonLd";

export default async function HomePage() {
  const [s, offers, options, faqs, portfolio] = await Promise.all([getPublicSettings(), getPublicOffers(), getPublicOptions(), getPublicFaqs(), getPublicPortfolio()]);
  const siteOffers = offers.filter((o) => o.type === "SITE");
  const maintenance = offers.filter((o) => o.type === "MAINTENANCE");
  const appUrl = process.env.APP_URL ?? "http://localhost:3000";

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            name: s.brandName,
            description: s.seoDescription,
            url: appUrl,
            ...(s.contactEmail ? { email: s.contactEmail } : {}),
            ...(s.phone ? { telephone: s.phone } : {}),
            ...(s.city ? { address: { "@type": "PostalAddress", addressLocality: s.city, addressCountry: "FR" } } : {}),
            sameAs: [s.instagramUrl, s.tiktokUrl, s.facebookUrl, s.linkedinUrl].filter(Boolean),
            makesOffer: siteOffers.map((o) => ({
              "@type": "Offer",
              name: `Site ${o.name}`,
              price: (o.priceCents / 100).toFixed(2),
              priceCurrency: "EUR",
            })),
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
          },
        ]}
      />
      <Hero title={s.heroTitle} subtitle={s.heroSubtitle} />
      <Audience />
      <Problem quote={s.problemQuote} />
      <Portfolio items={portfolio} />
      <Offers offers={siteOffers} maintenance={maintenance} options={options} />
      <Steps />
      <Faq items={faqs} />
      <FinalCta title={s.ctaTitle} subtitle={s.ctaSubtitle} />
    </>
  );
}
