import "server-only";
import { db } from "@/server/db";
import { forbidden } from "@/server/errors";
import type { Actor } from "@/server/auth/session";

/** RGPD : export, par le client lui-même, de SES données (sans notes internes ni données d'autres clients). */
export async function exportOwnData(actor: Actor) {
  if (actor.role !== "CLIENT" || !actor.clientId) throw forbidden();
  const client = await db.client.findUniqueOrThrow({
    where: { id: actor.clientId },
    select: {
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      companyName: true,
      activity: true,
      address: true,
      city: true,
      country: true,
      website: true,
      createdAt: true,
      projects: {
        select: {
          name: true,
          status: true,
          startDate: true,
          dueDate: true,
          previewUrl: true,
          liveUrl: true,
          brief: { select: { data: true, status: true, submittedAt: true } },
          files: { select: { originalName: true, category: true, sizeBytes: true, createdAt: true } },
          messages: { select: { body: true, createdAt: true, author: { select: { firstName: true, role: true } } } },
        },
      },
      payments: { select: { kind: true, amountCents: true, paidAt: true, method: true } },
      subscriptions: { select: { planName: true, priceCents: true, startDate: true, status: true } },
    },
  });
  const user = await db.user.findUniqueOrThrow({ where: { id: actor.id }, select: { email: true, firstName: true, lastName: true, createdAt: true, lastLoginAt: true } });
  return { exportedAt: new Date().toISOString(), account: user, client };
}
