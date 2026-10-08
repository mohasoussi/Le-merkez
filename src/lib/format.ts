const euro = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 2, minimumFractionDigits: 0 });
const euroRound = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

/** Montant en centimes → « 1 490 € ». */
export function formatCents(cents: number | null | undefined, opts: { round?: boolean } = {}) {
  if (cents == null) return "—";
  return (opts.round ? euroRound : euro).format(cents / 100);
}

/** Saisie « 1490 », « 1 490,50 » → centimes. */
export function parseEuroToCents(value: string): number | null {
  const clean = value.replace(/\s|€/g, "").replace(",", ".");
  if (!clean) return null;
  const n = Number(clean);
  if (!Number.isFinite(n) || n < 0) return NaN;
  return Math.round(n * 100);
}

const dateFmt = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric", timeZone: "Europe/Paris" });
const dateTimeFmt = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" });
const shortFmt = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", timeZone: "Europe/Paris" });

export const formatDate = (d: Date | string | null | undefined) => (d ? dateFmt.format(new Date(d)) : "—");
export const formatDateTime = (d: Date | string | null | undefined) => (d ? dateTimeFmt.format(new Date(d)) : "—");
export const formatShortDate = (d: Date | string | null | undefined) => (d ? shortFmt.format(new Date(d)) : "—");

export function relativeTime(d: Date | string) {
  const diff = (new Date(d).getTime() - Date.now()) / 1000;
  const rtf = new Intl.RelativeTimeFormat("fr", { numeric: "auto" });
  const abs = Math.abs(diff);
  if (abs < 60) return "à l'instant";
  if (abs < 3600) return rtf.format(Math.round(diff / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(diff / 3600), "hour");
  if (abs < 86400 * 30) return rtf.format(Math.round(diff / 86400), "day");
  return formatDate(d);
}

/** Pour <input type="date"> (fuseau Europe/Paris). */
export function toDateInput(d: Date | string | null | undefined) {
  if (!d) return "";
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" }).format(new Date(d));
}

/** Pour <input type="datetime-local"> (fuseau Europe/Paris). */
export function toDateTimeInput(d: Date | string | null | undefined) {
  if (!d) return "";
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date(d));
  const g = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${g("year")}-${g("month")}-${g("day")}T${g("hour") === "24" ? "00" : g("hour")}:${g("minute")}`;
}

export function initials(first?: string | null, last?: string | null) {
  return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase() || "?";
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / 1024 / 1024).toFixed(1).replace(".", ",")} Mo`;
}

export function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}
