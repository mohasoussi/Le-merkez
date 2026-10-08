import { SiteHeader } from "@/components/landing/SiteHeader";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { UtmCapture } from "@/components/landing/UtmCapture";
import { getPublicSettings } from "@/server/public-content";

// Rendu à la demande (aucune base n'est requise au build) ; les données sont mises en cache (tag « public-content »).
export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const s = await getPublicSettings();
  return (
    <>
      <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow-lift">
        Aller au contenu
      </a>
      <UtmCapture />
      <SiteHeader brandName={s.brandName} />
      <main id="contenu">{children}</main>
      <SiteFooter
        brandName={s.brandName}
        contactEmail={s.contactEmail}
        phone={s.phone}
        city={s.city}
        socials={[
          { label: "Instagram", url: s.instagramUrl },
          { label: "TikTok", url: s.tiktokUrl },
          { label: "Facebook", url: s.facebookUrl },
          { label: "LinkedIn", url: s.linkedinUrl },
        ]}
      />
    </>
  );
}
