"use client";

import { useEffect } from "react";

export const ATTRIBUTION_KEY = "attribution";

export interface Attribution {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  referrer?: string;
  landingPath?: string;
}

/**
 * Mémorise la provenance du visiteur (paramètres UTM + site référent) dans le sessionStorage.
 * Aucun cookie, aucun envoi : ces informations ne quittent le navigateur qu'avec le formulaire.
 * Premier contact gagnant : une visite suivante sans UTM n'écrase pas la provenance.
 */
export function UtmCapture() {
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const utm: Attribution = {
        utmSource: params.get("utm_source") ?? undefined,
        utmMedium: params.get("utm_medium") ?? undefined,
        utmCampaign: params.get("utm_campaign") ?? undefined,
        utmTerm: params.get("utm_term") ?? undefined,
        utmContent: params.get("utm_content") ?? undefined,
      };
      const hasUtm = Object.values(utm).some(Boolean);
      const existing = sessionStorage.getItem(ATTRIBUTION_KEY);
      if (existing && !hasUtm) return;
      const ref = document.referrer && !document.referrer.startsWith(window.location.origin) ? document.referrer : undefined;
      const data: Attribution = { ...utm, referrer: ref, landingPath: window.location.pathname };
      sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(data));
    } catch {
      // sessionStorage indisponible (navigation privée stricte) : sans conséquence
    }
  }, []);
  return null;
}

export function readAttribution(): Attribution {
  try {
    return JSON.parse(sessionStorage.getItem(ATTRIBUTION_KEY) ?? "{}") as Attribution;
  } catch {
    return {};
  }
}
