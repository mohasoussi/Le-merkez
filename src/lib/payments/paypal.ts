import { PaymentNotConfiguredError, type PaymentProvider } from "./types";

/**
 * PayPal Orders API v2 — à implémenter lors du branchement :
 * 1. Obtenir un token OAuth avec PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET.
 * 2. POST /v2/checkout/orders (intent CAPTURE, montant, return_url, cancel_url).
 * 3. Retourner le lien « approve » comme redirectUrl.
 */
export const paypalProvider: PaymentProvider = {
  id: "paypal",
  label: "PayPal",
  isConfigured: () => Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET),
  async createCheckout() {
    throw new PaymentNotConfiguredError("paypal");
  },
};
