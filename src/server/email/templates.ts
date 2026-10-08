import "server-only";

export function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

interface Layout {
  title: string;
  intro: string;
  lines?: [string, string][];
  cta?: { label: string; url: string };
  footer?: string;
}

/** Gabarit d'email unique, sobre et compatible avec les principaux clients mail. Toutes les valeurs sont échappées. */
export function renderEmail({ title, intro, lines = [], cta, footer }: Layout) {
  const rows = lines
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 0;color:#6b7280;font-size:14px;width:160px;vertical-align:top">${escapeHtml(k)}</td><td style="padding:6px 0;color:#111827;font-size:14px">${escapeHtml(v)}</td></tr>`,
    )
    .join("");
  const html = `<!doctype html><html lang="fr"><body style="margin:0;background:#f4f4f5;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;padding:32px">
<tr><td><h1 style="margin:0 0 12px;font-size:20px;color:#111827">${escapeHtml(title)}</h1>
<p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#374151">${escapeHtml(intro)}</p>
${rows ? `<table role="presentation" width="100%" style="margin:0 0 20px">${rows}</table>` : ""}
${cta ? `<a href="${escapeHtml(cta.url)}" style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:10px;font-size:14px;font-weight:600">${escapeHtml(cta.label)}</a>` : ""}
${footer ? `<p style="margin:24px 0 0;font-size:12px;color:#9ca3af">${escapeHtml(footer)}</p>` : ""}
</td></tr></table></td></tr></table></body></html>`;
  const text = [title, "", intro, "", ...lines.map(([k, v]) => `${k} : ${v}`), cta ? `\n${cta.label} : ${cta.url}` : "", footer ?? ""]
    .join("\n")
    .trim();
  return { html, text };
}
