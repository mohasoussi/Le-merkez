import type { LeadSourceCode } from "@/lib/constants";

/**
 * Déduit la source d'un prospect. Priorité : UTM > site référent > réponse « Comment nous avez-vous connu ? » > Direct.
 * Exemple : ?utm_source=instagram&utm_medium=social → INSTAGRAM ; utm_medium=cpc → Publicité.
 */
export function resolveLeadSource(a: { utmSource?: string; utmMedium?: string; referrer?: string }, declared?: LeadSourceCode): LeadSourceCode {
  const src = (a.utmSource ?? "").toLowerCase();
  const medium = (a.utmMedium ?? "").toLowerCase();
  if (/^(cpc|ppc|paid|ads?|paid[_-]?social|display)$/.test(medium)) return "ADS";
  if (src) {
    if (/tiktok/.test(src)) return "TIKTOK";
    if (/^(ig|insta|instagram)/.test(src)) return "INSTAGRAM";
    if (/^(fb|facebook|meta)/.test(src)) return "FACEBOOK";
    if (/google/.test(src)) return "GOOGLE";
    if (/(referral|recommandation|bouche)/.test(src)) return "REFERRAL";
    return "OTHER";
  }
  if (a.referrer) {
    let host = "";
    try {
      host = new URL(a.referrer).hostname;
    } catch {}
    if (/tiktok\./.test(host)) return "TIKTOK";
    if (/instagram\./.test(host)) return "INSTAGRAM";
    if (/(facebook\.|fb\.)/.test(host)) return "FACEBOOK";
    if (/(google\.|bing\.|duckduckgo\.|qwant\.|ecosia\.)/.test(host)) return "SEO";
    if (host) return "OTHER";
  }
  return declared ?? "DIRECT";
}
