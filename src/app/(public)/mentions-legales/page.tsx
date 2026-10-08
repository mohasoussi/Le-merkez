import type { Metadata } from "next";
import { LegalPage, ToFill } from "@/components/landing/Prose";
import { getPublicSettings } from "@/server/public-content";

export const metadata: Metadata = { title: "Mentions légales", alternates: { canonical: "/mentions-legales" } };

export default async function LegalNoticePage() {
  const s = await getPublicSettings();
  return (
    <LegalPage title="Mentions légales">
      <section>
        <h2>Éditeur du site</h2>
        <p>
          <ToFill value={s.legalName} label="Raison sociale ou nom" /> — <ToFill value={s.legalForm} label="Forme juridique" />
          <br />
          SIRET : <ToFill value={s.siret} label="SIRET" />
          {s.vatNumber && (
            <>
              <br />
              TVA intracommunautaire : {s.vatNumber}
            </>
          )}
          <br />
          Adresse : <ToFill value={s.address} label="Adresse" />
          <br />
          Contact : <ToFill value={s.contactEmail} label="Email" /> {s.phone && `— ${s.phone}`}
        </p>
      </section>
      <section>
        <h2>Hébergement</h2>
        <p>
          <ToFill value={s.hostingInfo} label="Nom, adresse et téléphone de l'hébergeur" />
        </p>
      </section>
      <section>
        <h2>Propriété intellectuelle</h2>
        <p>L&apos;ensemble des contenus de ce site (textes, visuels, logo) est protégé. Toute reproduction sans autorisation est interdite.</p>
      </section>
    </LegalPage>
  );
}
