import Link from "next/link";

interface Props {
  brandName: string;
  contactEmail: string | null;
  phone: string | null;
  city: string | null;
  socials: { label: string; url: string | null }[];
}

export function SiteFooter({ brandName, contactEmail, phone, city, socials }: Props) {
  const links = socials.filter((s) => s.url);
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <p className="flex items-center gap-2 font-semibold">
            <span className="grid size-7 place-items-center rounded-lg bg-ink text-xs text-white">{brandName.slice(0, 1)}</span>
            {brandName}
          </p>
          <p className="mt-3 max-w-xs text-sm text-muted">Des sites internet modernes, rapides et professionnels pour les petites entreprises.</p>
        </div>
        <div>
          <p className="text-sm font-medium">Contact</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {contactEmail && (
              <li>
                <a href={`mailto:${contactEmail}`} className="hover:text-ink">
                  {contactEmail}
                </a>
              </li>
            )}
            {phone && (
              <li>
                <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-ink">
                  {phone}
                </a>
              </li>
            )}
            {city && <li>{city}</li>}
            <li>
              <Link href="/demande" className="hover:text-ink">
                Demander un devis
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium">Liens</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {links.map((s) => (
              <li key={s.label}>
                <a href={s.url!} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
                  {s.label}
                </a>
              </li>
            ))}
            <li>
              <Link href="/connexion" className="hover:text-ink">
                Espace client
              </Link>
            </li>
            <li>
              <Link href="/mentions-legales" className="hover:text-ink">
                Mentions légales
              </Link>
            </li>
            <li>
              <Link href="/confidentialite" className="hover:text-ink">
                Confidentialité
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <p className="border-t border-line px-4 py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} {brandName}. Tous droits réservés.
      </p>
    </footer>
  );
}
