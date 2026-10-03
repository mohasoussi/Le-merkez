export interface DonationIntent {
  amount: number; // en euros
  currency: "EUR";
  goalId: string;
  email?: string;
}

export interface CheckoutResult {
  /** URL de la page de paiement hébergée par le prestataire. */
  redirectUrl: string;
}

/**
 * Contrat commun à tous les prestataires de paiement.
 * Pour brancher un prestataire : implémenter `createCheckout` dans le fichier correspondant
 * (stripe.ts, paypal.ts, helloasso.ts) et définir PAYMENT_PROVIDER.
 */
export interface PaymentProvider {
  id: "stripe" | "paypal" | "helloasso";
  label: string;
  isConfigured(): boolean;
  createCheckout(intent: DonationIntent, origin: string): Promise<CheckoutResult>;
}

export class PaymentNotConfiguredError extends Error {
  constructor(provider: string) {
    super(`Le prestataire de paiement « ${provider} » n'est pas encore configuré.`);
  }
}
