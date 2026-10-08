/** Données structurées schema.org. Le JSON est échappé (« < ») pour empêcher toute injection de balise. */
export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
