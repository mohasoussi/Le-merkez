import { describe, expect, it } from "vitest";
import { db } from "@/server/db";
import { login, issueAuthToken, setPasswordWithToken, requestPasswordReset, createAdminUser } from "@/server/services/auth";
import { validateSessionToken, invalidateSession } from "@/server/auth/session";
import { createUser, TEST_PASSWORD } from "../support/db";

describe("authentification", () => {
  it("connecte un utilisateur avec le bon mot de passe et crée une session valide", async () => {
    const user = await createUser({ email: "admin@test.local", role: "ADMIN" });
    const { token } = await login({ email: "ADMIN@test.local ", password: TEST_PASSWORD, ip: "1.1.1.1" });
    const session = await validateSessionToken(token);
    expect(session?.actor.id).toBe(user.id);
    // le jeton n'est jamais stocké en clair
    expect(await db.session.count({ where: { id: token } })).toBe(0);
  });

  it("refuse un mauvais mot de passe et un email inconnu avec le même message", async () => {
    await createUser({ email: "admin@test.local", role: "ADMIN" });
    await expect(login({ email: "admin@test.local", password: "faux-mdp-123", ip: "1.1.1.2" })).rejects.toThrow(
      "Email ou mot de passe incorrect.",
    );
    await expect(login({ email: "inconnu@test.local", password: "faux-mdp-123", ip: "1.1.1.2" })).rejects.toThrow(
      "Email ou mot de passe incorrect.",
    );
  });

  it("bloque après trop de tentatives (rate limit)", async () => {
    await createUser({ email: "admin@test.local", role: "ADMIN" });
    for (let i = 0; i < 10; i++) {
      await login({ email: "admin@test.local", password: "faux", ip: "9.9.9.9" }).catch(() => {});
    }
    await expect(login({ email: "admin@test.local", password: TEST_PASSWORD, ip: "9.9.9.9" })).rejects.toThrow(
      /Trop de tentatives/,
    );
  });

  it("refuse un compte désactivé et invalide la session à la déconnexion", async () => {
    const user = await createUser({ email: "c@test.local", role: "CLIENT" });
    const { token } = await login({ email: "c@test.local", password: TEST_PASSWORD, ip: "2.2.2.2" });
    await invalidateSession(token);
    expect(await validateSessionToken(token)).toBeNull();
    await db.user.update({ where: { id: user.id }, data: { isActive: false } });
    await expect(login({ email: "c@test.local", password: TEST_PASSWORD, ip: "2.2.2.3" })).rejects.toThrow();
  });

  it("active un compte via une invitation à usage unique", async () => {
    const user = await db.user.create({ data: { email: "new@test.local", role: "CLIENT", firstName: "N" } });
    const token = await issueAuthToken(user.id, "INVITATION");
    await expect(setPasswordWithToken(token, "court")).rejects.toThrow(/au moins/);
    await setPasswordWithToken(token, "UnBonMotDePasse-42");
    await expect(setPasswordWithToken(token, "UnAutreMotDePasse-42")).rejects.toThrow(/plus valide/);
    const { token: session } = await login({ email: "new@test.local", password: "UnBonMotDePasse-42", ip: "3.3.3.3" });
    expect(session).toBeTruthy();
  });

  it("ne révèle pas l'existence d'un email lors d'une demande de réinitialisation", async () => {
    expect(await requestPasswordReset("personne@test.local", "4.4.4.4")).toBeNull();
    await createUser({ email: "admin@test.local", role: "ADMIN" });
    expect(await requestPasswordReset("admin@test.local", "4.4.4.4")).not.toBeNull();
  });

  it("crée un administrateur avec un mot de passe haché (jamais en clair)", async () => {
    const admin = await createAdminUser({ email: "Boss@Test.local", password: "TresSecret-2026", firstName: "Boss" });
    expect(admin.email).toBe("boss@test.local");
    expect(admin.passwordHash).toMatch(/^scrypt\$16384\$8\$5\$/);
    await expect(createAdminUser({ email: "boss@test.local", password: "TresSecret-2026", firstName: "B" })).rejects.toThrow(
      /existe déjà/,
    );
  });
});
