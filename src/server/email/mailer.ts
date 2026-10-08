import "server-only";
import type { Transporter } from "nodemailer";
import { env } from "@/server/env";
import { logger } from "@/server/logger";

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

/** Messages « envoyés » en mode console (consultables par les tests). */
export const consoleOutbox: EmailMessage[] = [];

let transporter: Transporter | null = null;

async function getTransporter() {
  const e = env();
  // Import à la demande : nodemailer (sockets TCP) n'est chargé que pour le pilote SMTP.
  const nodemailer = (await import("nodemailer")).default;
  transporter ??= nodemailer.createTransport({
    host: e.SMTP_HOST,
    port: e.SMTP_PORT,
    secure: e.SMTP_SECURE,
    auth: e.SMTP_USER ? { user: e.SMTP_USER, pass: e.SMTP_PASSWORD } : undefined,
  });
  return transporter;
}

/**
 * Envoie un email. Ne lève JAMAIS d'erreur : un problème d'email ne doit pas faire échouer
 * l'action métier (création de prospect, changement de statut…). L'échec est journalisé.
 */
export async function sendEmail(message: EmailMessage): Promise<boolean> {
  if (!message.to) return false;
  const e = env();
  try {
    if (e.EMAIL_DRIVER === "console") {
      if (process.env.NODE_ENV === "test") consoleOutbox.push(message);
      else logger.info("email.console", { to: message.to, subject: message.subject, text: message.text });
      return true;
    }
    if (e.EMAIL_DRIVER === "resend") {
      // API HTTP : fonctionne partout, y compris sur Cloudflare Workers
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${e.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: e.EMAIL_FROM, to: [message.to], subject: message.subject, html: message.html, text: message.text, reply_to: message.replyTo }),
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 200)}`);
      return true;
    }
    await (await getTransporter()).sendMail({ from: e.EMAIL_FROM, ...message });
    return true;
  } catch (error) {
    logger.error("email.send_failed", { to: message.to, subject: message.subject, error });
    return false;
  }
}
