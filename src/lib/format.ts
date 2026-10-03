/** Formate une date ISO en français ; renvoie le placeholder si la date n'est pas renseignée. */
export function formatDate(iso: string | null, placeholder = "[DATE À AJOUTER]") {
  if (!iso) return placeholder;
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return placeholder;
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(d);
}
