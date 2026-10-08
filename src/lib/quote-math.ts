/** Calcul des totaux d'un devis, en centimes (entiers) — partagé navigateur/serveur. */
export function quoteTotals(items: { quantity: number; unitPriceCents: number }[], vatRateBps: number) {
  const ht = items.reduce((s, i) => s + i.quantity * i.unitPriceCents, 0);
  const vat = Math.round((ht * vatRateBps) / 10_000);
  return { totalHtCents: ht, totalVatCents: vat, totalTtcCents: ht + vat };
}
