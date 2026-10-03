/**
 * Appel aux dons.
 *
 * - `goals[].target` / `collected` : montants RÉELS uniquement. Laisser `null` tant
 *   qu'aucun objectif chiffré n'est validé → la barre de progression n'est pas affichée.
 * - `externalDonationUrl` : la solution la plus simple pour démarrer (ex. page HelloAsso).
 *   Si renseigné, le bouton y redirige directement.
 * - Sinon, le formulaire appelle /api/donate qui délègue au prestataire défini par la
 *   variable d'environnement PAYMENT_PROVIDER (voir src/lib/payments).
 */
export interface DonationGoal {
  id: "lieu" | "activites";
  label: string;
  title: string;
  description: string;
  target: number | null;
  collected: number | null;
}

export const donation = {
  eyebrow: "Soutenir",
  title: "Contribuez à la construction du Merkez",
  text: "Chaque contribution participe à créer un espace où les différences peuvent devenir des occasions de rencontre, de dialogue et de fraternité.",
  currency: "EUR",
  amounts: [25, 50, 100, 250],
  defaultAmount: 50,
  minAmount: 1,
  cta: "Je soutiens le Merkez",
  goals: [
    {
      id: "lieu",
      label: "Objectif 1",
      title: "Le lieu",
      description: "Acquisition ou création d’un lieu physique.",
      target: null,
      collected: null,
    },
    {
      id: "activites",
      label: "Objectif 2",
      title: "Les actions",
      description: "Financement des activités et actions du Merkez.",
      target: null,
      collected: null,
    },
  ] as DonationGoal[],
  targetPlaceholder: "[OBJECTIF CHIFFRÉ À DÉFINIR]",
  externalDonationUrl: null as string | null,
  /** Mentions affichées sous le formulaire (ex. reçu fiscal) : uniquement si vérifiées. */
  legalNote: "[MENTIONS LÉGALES / FISCALITÉ DES DONS À AJOUTER]",
};
