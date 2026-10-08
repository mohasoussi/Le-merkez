import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
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

function getTransporter() {
  const e = env();
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
    await getTransporter().sendMail({ from: e.EMAIL_FROM, ...message });
    return true;
  } catch (error) {
    logger.error("email.send_failed", { to: message.to, subject: message.subject, error });
    return false;
  }
}
