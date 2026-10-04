import type { Book } from "@/content/books";

/**
 * Point d'entrée unique de la future boutique.
 *
 * Aujourd'hui : l'achat se fait sur la fiche de l'ouvrage chez l'éditeur (Les 7 Lectures).
 * Demain : brancher ici un panier (Stripe Checkout, Shopify Storefront, Snipcart…) en
 * s'appuyant sur `book.sku` — les composants n'auront pas à changer.
 */
export type Availability =
  | { status: "external"; href: string; label: string }
  | { status: "unavailable"; label: string };

export function getAvailability(book: Book): Availability {
  if (book.purchaseUrl) return { status: "external", href: book.purchaseUrl, label: "Se procurer l’ouvrage" };
  return { status: "unavailable", label: "Bientôt disponible" };
}

export function formatPrice(book: Book): string | null {
  return book.priceLabel;
}
