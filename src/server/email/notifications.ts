import "server-only";
import { env } from "@/server/env";
import { sendEmail } from "./mailer";
import { renderEmail } from "./templates";

/**
 * Point d'entrée unique des notifications. Chaque événement métier a sa fonction :
 * pour ajouter un canal (Slack, SMS…), c'est ici qu'il faut le brancher.
 */
const adminTo = () => env().ADMIN_NOTIFICATION_EMAIL;
const url = (path: string) => `${env().APP_URL}${path}`;

export async function notifyNewLead(lead: { id: string; firstName: string; lastName: string; companyName: string; email: string; phone: string; budgetLabel: string; projectTypeLabel: string; sourceLabel: string }) {
  const { html, text } = renderEmail({
    title: "Nouveau prospect reçu.",
    intro: `${lead.firstName} ${lead.lastName} (${lead.companyName}) vient de remplir le formulaire.`,
    lines: [
      ["Projet", lead.projectTypeLabel],
      ["Budget", lead.budgetLabel],
      ["Source", lead.sourceLabel],
      ["Email", lead.email],
      ["Téléphone", lead.phone],
    ],
    cta: { label: "Ouvrir la fiche", url: url(`/admin/prospects/${lead.id}`) },
  });
  return sendEmail({ to: adminTo(), subject: `Nouveau prospect : ${lead.companyName}`, html, text, replyTo: lead.email });
}

export async function notifyNewClient(client: { id: string; companyName: string }) {
  const { html, text } = renderEmail({
    title: "Nouveau client enregistré.",
    intro: `${client.companyName} est maintenant client.`,
    cta: { label: "Voir le client", url: url(`/admin/clients/${client.id}`) },
  });
  return sendEmail({ to: adminTo(), subject: `Nouveau client : ${client.companyName}`, html, text });
}

export async function notifyBriefSubmitted(p: { projectId: string; projectName: string; companyName: string }) {
  const { html, text } = renderEmail({
    title: "Le client a terminé son brief.",
    intro: `${p.companyName} a envoyé le brief du projet « ${p.projectName} ».`,
    cta: { label: "Consulter le brief", url: url(`/admin/projets/${p.projectId}?onglet=brief`) },
  });
  return sendEmail({ to: adminTo(), subject: `Brief reçu : ${p.projectName}`, html, text });
}

export async function notifyFileUploaded(p: { projectId: string; projectName: string; fileName: string; uploaderName: string }) {
  const { html, text } = renderEmail({
    title: "Le client a ajouté un nouveau fichier.",
    intro: `${p.uploaderName} a déposé « ${p.fileName} » sur le projet « ${p.projectName} ».`,
    cta: { label: "Voir les fichiers", url: url(`/admin/projets/${p.projectId}?onglet=fichiers`) },
  });
  return sendEmail({ to: adminTo(), subject: `Nouveau fichier : ${p.projectName}`, html, text });
}

export async function notifyClientMessage(p: { projectId: string; projectName: string; authorName: string; excerpt: string }) {
  const { html, text } = renderEmail({
    title: "Nouveau message d'un client.",
    intro: `${p.authorName} sur « ${p.projectName} » : ${p.excerpt}`,
    cta: { label: "Répondre", url: url(`/admin/projets/${p.projectId}?onglet=messages`) },
  });
  return sendEmail({ to: adminTo(), subject: `Message : ${p.projectName}`, html, text });
}

export async function notifyProjectStatus(p: { to: string; firstName: string; projectId: string; projectName: string; statusLabel: string }) {
  const { html, text } = renderEmail({
    title: `Votre projet est maintenant à l'étape ${p.statusLabel}.`,
    intro: `Bonjour ${p.firstName}, votre projet « ${p.projectName} » avance : il est maintenant à l'étape ${p.statusLabel}.`,
    cta: { label: "Suivre mon projet", url: url(`/client/projets/${p.projectId}`) },
  });
  return sendEmail({ to: p.to, subject: `Votre projet : étape ${p.statusLabel}`, html, text });
}

export async function notifyAdminMessageToClient(p: { to: string; firstName: string; projectId: string; projectName: string }) {
  const { html, text } = renderEmail({
    title: "Vous avez un nouveau message.",
    intro: `Bonjour ${p.firstName}, un nouveau message vous attend sur le projet « ${p.projectName} ».`,
    cta: { label: "Lire le message", url: url(`/client/projets/${p.projectId}`) },
  });
  return sendEmail({ to: p.to, subject: `Nouveau message : ${p.projectName}`, html, text });
}

export async function sendInvitation(p: { to: string; firstName: string; token: string; brandName: string }) {
  const { html, text } = renderEmail({
    title: "Votre espace client est prêt.",
    intro: `Bonjour ${p.firstName}, votre espace client ${p.brandName} vous permet de suivre l'avancement de votre site, de remplir votre brief et de nous transmettre vos fichiers. Choisissez votre mot de passe pour y accéder.`,
    cta: { label: "Activer mon espace", url: url(`/activation?token=${encodeURIComponent(p.token)}`) },
    footer: "Ce lien est valable 7 jours.",
  });
  return sendEmail({ to: p.to, subject: "Votre espace client", html, text });
}

export async function sendPasswordReset(p: { to: string; firstName: string; token: string }) {
  const { html, text } = renderEmail({
    title: "Réinitialisation du mot de passe",
    intro: `Bonjour ${p.firstName}, cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe. Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.`,
    cta: { label: "Choisir un nouveau mot de passe", url: url(`/activation?token=${encodeURIComponent(p.token)}&mode=reset`) },
    footer: "Ce lien est valable 1 heure.",
  });
  return sendEmail({ to: p.to, subject: "Réinitialisation de votre mot de passe", html, text });
}
