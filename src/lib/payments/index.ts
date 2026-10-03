import { helloassoProvider } from "./helloasso";
import { paypalProvider } from "./paypal";
import { stripeProvider } from "./stripe";
import type { PaymentProvider } from "./types";

export * from "./types";

const providers: Record<string, PaymentProvider> = {
  stripe: stripeProvider,
  paypal: paypalProvider,
  helloasso: helloassoProvider,
};

/** Prestataire actif (variable PAYMENT_PROVIDER), ou null si aucun n'est configuré. */
export function getPaymentProvider(): PaymentProvider | null {
  const id = process.env.PAYMENT_PROVIDER?.trim().toLowerCase();
  const provider = id ? providers[id] : undefined;
  return provider && provider.isConfigured() ? provider : null;
}
