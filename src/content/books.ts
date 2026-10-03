import { textile } from "@/lib/palette";
import type { Media } from "./types";

/**
 * Catalogue de la librairie.
 * Pour ajouter un livre : compléter un objet ci-dessous (couverture dans /public/images/livres/).
 * `price` et `purchaseUrl` restent `null` tant que la boutique n'est pas branchée
 * (voir src/lib/commerce.ts).
 */
export interface Book {
  slug: string;
  title: string;
  author: string | null;
  description: string;
  cover: Media;
  /** Couleur de la couverture générée tant que la vraie couverture n'est pas fournie. */
  color: string;
  price: number | null;
  currency: "EUR";
  /** Lien d'achat externe éventuel (ex. éditeur). */
  purchaseUrl: string | null;
  /** Identifiant produit chez le prestataire e-commerce (Stripe, Shopify…), plus tard. */
  sku: string | null;
  placeholder?: boolean;
}

const placeholderBook = (n: number, color: string): Book => ({
  slug: `livre-${n}`,
  title: "[TITRE DE L’OUVRAGE À AJOUTER]",
  author: null,
  description: "[DESCRIPTION DE L’OUVRAGE À AJOUTER]",
  cover: { src: null, alt: "Couverture à fournir", placeholder: "[COUVERTURE À FOURNIR]" },
  color,
  price: null,
  currency: "EUR",
  purchaseUrl: null,
  sku: null,
  placeholder: true,
});

export const books: Book[] = [
  placeholderBook(1, textile.madder),
  placeholderBook(2, textile.indigo),
  placeholderBook(3, textile.moss),
  placeholderBook(4, textile.saffron),
  placeholderBook(5, textile.terracotta),
];

export const bookstore = {
  eyebrow: "05 — Librairie",
  title: "Des livres pour prolonger la rencontre",
  text: "Transmettre, c’est aussi écrire, lire et partager. La librairie du Merkez rassemble des ouvrages pour approfondir le chemin.",
  cta: { label: "Découvrir les livres", href: "/librairie" },
};
