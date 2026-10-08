"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { clearSessionCookie, getSessionToken, setSessionCookie } from "@/server/auth/cookies";
import { createSession, invalidateSession } from "@/server/auth/session";
import { requireActor } from "@/server/auth/guards";
import { getClientIp } from "@/server/security/ip";
import * as authService from "@/server/services/auth";
import { sendPasswordReset } from "@/server/email/notifications";
import { ok, runAction, type ActionResult } from "./result";

const loginSchema = z.object({
  email: z.email("Adresse email invalide.").max(200),
  password: z.string().min(1, "Mot de passe requis.").max(200),
  next: z.string().optional(),
});

/** Chemin de redirection interne uniquement (empêche les redirections ouvertes vers un autre site). */
function safeNext(next: string | undefined, fallback: string) {
  if (next && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\")) return next;
  return fallback;
}

export async function loginAction(_: unknown, formData: FormData): Promise<ActionResult> {
  let destination = "/";
  const result = await runAction("login", async () => {
    const input = loginSchema.parse(Object.fromEntries(formData));
    const h = await headers();
    const { user, token, expiresAt } = await authService.login({
      email: input.email,
      password: input.password,
      ip: getClientIp(h),
      userAgent: h.get("user-agent") ?? undefined,
    });
    await setSessionCookie(token, expiresAt);
    const home = user.role === "ADMIN" ? "/admin" : "/client";
    const next = safeNext(input.next, home);
    // Un client ne doit pas être renvoyé vers /admin (et inversement)
    destination = next.startsWith(user.role === "ADMIN" ? "/client" : "/admin") ? home : next;
  });
  if (!result.ok) return result;
  redirect(destination);
}

export async function logoutAction() {
  const token = await getSessionToken();
  if (token) await invalidateSession(token);
  await clearSessionCookie();
  redirect("/connexion");
}

const setPasswordSchema = z
  .object({ token: z.string().min(10), password: z.string().max(200), confirm: z.string() })
  .refine((v) => v.password === v.confirm, { message: "Les mots de passe ne correspondent pas.", path: ["confirm"] });

export async function setPasswordAction(_: unknown, formData: FormData): Promise<ActionResult> {
  let role: string | null = null;
  const result = await runAction("setPassword", async () => {
    const input = setPasswordSchema.parse(Object.fromEntries(formData));
    const user = await authService.setPasswordWithToken(input.token, input.password);
    const h = await headers();
    const session = await createSession(user.id, { ipAddress: getClientIp(h), userAgent: h.get("user-agent") ?? undefined });
    await setSessionCookie(session.token, session.expiresAt);
    role = user.role;
  });
  if (!result.ok) return result;
  redirect(role === "ADMIN" ? "/admin" : "/client");
}

export async function requestResetAction(_: unknown, formData: FormData): Promise<ActionResult> {
  return runAction("requestReset", async () => {
    const { email } = z.object({ email: z.email("Adresse email invalide.").max(200) }).parse(Object.fromEntries(formData));
    const res = await authService.requestPasswordReset(email, getClientIp(await headers()));
    if (res) await sendPasswordReset({ to: res.user.email, firstName: res.user.firstName, token: res.token });
    return ok("Si un compte existe avec cette adresse, vous allez recevoir un email avec un lien de réinitialisation.");
  });
}

const changePasswordSchema = z
  .object({ currentPassword: z.string().min(1, "Requis.").max(200), password: z.string().max(200), confirm: z.string() })
  .refine((v) => v.password === v.confirm, { message: "Les mots de passe ne correspondent pas.", path: ["confirm"] });

export async function changePasswordAction(_: unknown, formData: FormData): Promise<ActionResult> {
  return runAction("changePassword", async () => {
    const actor = await requireActor();
    const input = changePasswordSchema.parse(Object.fromEntries(formData));
    await authService.changePassword(actor.id, input.currentPassword, input.password);
    return ok("Mot de passe mis à jour.");
  });
}
