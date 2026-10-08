import type { Metadata } from "next";
import { LegalPage, ToFill } from "@/components/landing/Prose";
import { getPublicSettings } from "@/server/public-content";

export const metadata: Metadata = { title: "Politique de confidentialité", alternates: { canonical: "/confidentialite" } };

// Modèle de politique de confidentialité : à faire relire par un professionnel du droit avant mise en production.
export default async function PrivacyPage() {
  const s = await getPublicSettings();
  return (
    <LegalPage title="Politique de confidentialité">
      <section>
        <h2>Responsable du traitement</h2>
        <p>
          <ToFill value={s.legalName} label="Raison sociale" /> — <ToFill value={s.address} label="Adresse" /> — contact : <ToFill value={s.contactEmail} label="Email de contact" />.
        </p>
      </section>
      <section>
        <h2>Données collectées</h2>
        <p>Via le formulaire de demande : identité (prénom, nom), coordonnées (email, téléphone), informations sur votre entreprise et votre projet, ainsi que la provenance de votre visite (paramètres de campagne, site référent).</p>
        <p>Via l&apos;espace client : vos identifiants (le mot de passe est stocké sous forme chiffrée irréversible), le brief de votre projet, les fichiers que vous déposez et vos messages.</p>
      </section>
      <section>
        <h2>Finalités et bases légales</h2>
        <ul>
          <li>Étudier votre demande et vous recontacter : votre consentement et les mesures précontractuelles prises à votre demande.</li>
          <li>Réaliser votre site et assurer le suivi du projet : exécution du contrat.</li>
          <li>Facturation et obligations comptables : obligation légale.</li>
          <li>Sécurité de la plateforme (prévention des abus) : intérêt légitime.</li>
        </ul>
      </section>
      <section>
        <h2>Durées de conservation</h2>
        <p>Prospects sans suite : 3 ans maximum après le dernier contact. Clients : durée de la relation contractuelle, puis durées légales (10 ans pour les pièces comptables).</p>
      </section>
      <section>
        <h2>Destinataires</h2>
        <p>Vos données sont destinées uniquement à {s.brandName}. Elles ne sont ni vendues ni louées. Elles peuvent être hébergées par nos prestataires techniques (hébergement, envoi d&apos;emails) : <ToFill value={s.hostingInfo} label="Hébergeur" />.</p>
      </section>
      <section>
        <h2>Cookies</h2>
        <p>Ce site n&apos;utilise pas de cookie publicitaire ni de mesure d&apos;audience tierce. Seul un cookie de session, strictement nécessaire, est déposé lorsque vous vous connectez à votre espace.</p>
      </section>
      <section>
        <h2>Vos droits</h2>
        <p>Vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, de limitation, d&apos;opposition et de portabilité de vos données, ainsi que du droit de retirer votre consentement. Pour les exercer : <ToFill value={s.contactEmail} label="Email de contact" />. Les clients peuvent aussi exporter leurs données depuis leur espace (Mon profil). Vous pouvez introduire une réclamation auprès de la CNIL (cnil.fr).</p>
      </section>
    </LegalPage>
  );
}
