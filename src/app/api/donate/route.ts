import { NextResponse } from "next/server";
import { donation } from "@/content/donation";
import { getPaymentProvider, PaymentNotConfiguredError } from "@/lib/payments";

/**
 * Crée une session de paiement pour un don.
 * Tant qu'aucun prestataire n'est configuré, renvoie 503 + status "not_configured"
 * (aucun paiement fictif n'est simulé).
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ status: "invalid", message: "Requête invalide." }, { status: 400 });
  }

  const { amount, goalId } = (body ?? {}) as { amount?: unknown; goalId?: unknown };
  const value = typeof amount === "number" ? Math.round(amount * 100) / 100 : NaN;
  const goal = donation.goals.find((g) => g.id === goalId);

  if (!Number.isFinite(value) || value < donation.minAmount || value > 100000 || !goal) {
    return NextResponse.json({ status: "invalid", message: "Montant ou objectif invalide." }, { status: 400 });
  }

  const provider = getPaymentProvider();
  if (!provider) {
    return NextResponse.json(
      { status: "not_configured", message: "Le paiement en ligne sera bientôt disponible." },
      { status: 503 },
    );
  }

  try {
    const origin = new URL(request.url).origin;
    const { redirectUrl } = await provider.createCheckout({ amount: value, currency: "EUR", goalId: goal.id }, origin);
    return NextResponse.json({ status: "ok", redirectUrl });
  } catch (error) {
    if (error instanceof PaymentNotConfiguredError) {
      return NextResponse.json({ status: "not_configured", message: "Le paiement en ligne sera bientôt disponible." }, { status: 503 });
    }
    console.error("[donate]", error);
    return NextResponse.json({ status: "error", message: "Une erreur est survenue." }, { status: 500 });
  }
}
