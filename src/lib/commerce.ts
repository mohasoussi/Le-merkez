import type { Book } from "@/content/books";

/**
 * Point d'entrée unique de la future boutique.
 *
 * Aujourd'hui : un livre est « disponible » uniquement s'il possède un lien d'achat externe.
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
  if (book.price == null) return null;
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: book.currency }).format(book.price);
}
