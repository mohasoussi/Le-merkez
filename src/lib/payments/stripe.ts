import { PaymentNotConfiguredError, type PaymentProvider } from "./types";

/**
 * Stripe Checkout — à implémenter lors du branchement :
 *   npm i stripe
 *   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
 *   const session = await stripe.checkout.sessions.create({
 *     mode: "payment",
 *     line_items: [{ price_data: { currency: "eur", unit_amount: intent.amount * 100,
 *       product_data: { name: `Don — ${intent.goalId}` } }, quantity: 1 }],
 *     success_url: `${origin}/merci`, cancel_url: `${origin}/#soutenir`,
 *   });
 *   return { redirectUrl: session.url! };
 */
export const stripeProvider: PaymentProvider = {
  id: "stripe",
  label: "Stripe",
  isConfigured: () => Boolean(process.env.STRIPE_SECRET_KEY),
  async createCheckout() {
    throw new PaymentNotConfiguredError("stripe");
  },
};
