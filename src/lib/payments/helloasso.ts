import { PaymentNotConfiguredError, type PaymentProvider } from "./types";

/**
 * HelloAsso Checkout API — à implémenter lors du branchement :
 * 1. Token OAuth2 (client_credentials) avec HELLOASSO_CLIENT_ID / SECRET.
 * 2. POST /v5/organizations/{HELLOASSO_ORGANIZATION_SLUG}/checkout-intents
 *    (totalAmount en centimes, itemName, backUrl, errorUrl, returnUrl).
 * 3. Retourner `redirectUrl` fourni par HelloAsso.
 *
 * Alternative sans code : renseigner `externalDonationUrl` dans src/content/donation.ts
 * avec l'URL du formulaire de don HelloAsso.
 */
export const helloassoProvider: PaymentProvider = {
  id: "helloasso",
  label: "HelloAsso",
  isConfigured: () =>
    Boolean(process.env.HELLOASSO_CLIENT_ID && process.env.HELLOASSO_CLIENT_SECRET && process.env.HELLOASSO_ORGANIZATION_SLUG),
  async createCheckout() {
    throw new PaymentNotConfiguredError("helloasso");
  },
};
