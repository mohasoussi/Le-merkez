"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/server/auth/guards";
import { recordPayment, deletePayment } from "@/server/services/payments";
import { createSubscription, updateSubscription } from "@/server/services/subscriptions";
import { AppError } from "@/server/errors";
import { parseEuroToCents } from "@/lib/format";
import { ok, runAction } from "./result";

const id = z.string().min(1).max(40);

function cents(value: FormDataEntryValue | null, field: string, required = true) {
  const c = parseEuroToCents(String(value ?? ""));
  if (c == null && !required) return null;
  if (c == null || Number.isNaN(c)) throw new AppError("Montant invalide.", "VALIDATION", { [field]: "Montant invalide." });
  return c;
}

export async function recordPaymentAction(clientId: string, _: unknown, formData: FormData) {
  return runAction("recordPayment", async () => {
    const actor = await requireAdmin();
    const f = Object.fromEntries(formData) as Record<string, string>;
    await recordPayment(actor, id.parse(clientId), {
      kind: f.kind as never,
      method: f.method as never,
      amountCents: cents(formData.get("amount"), "amount")!,
      paidAt: f.paidAt ? new Date(f.paidAt) : new Date(),
      projectId: f.projectId || null,
      quoteId: f.quoteId || null,
      reference: f.reference || null,
      notes: f.notes || null,
    });
    revalidatePath("/admin", "layout");
    return ok("Paiement enregistré.");
  });
}

export async function deletePaymentAction(paymentId: string) {
  return runAction("deletePayment", async () => {
    const actor = await requireAdmin();
    await deletePayment(actor, id.parse(paymentId));
    revalidatePath("/admin", "layout");
  });
}

export async function createSubscriptionAction(clientId: string, _: unknown, formData: FormData) {
  return runAction("createSubscription", async () => {
    const actor = await requireAdmin();
    const f = Object.fromEntries(formData) as Record<string, string>;
    await createSubscription(actor, id.parse(clientId), {
      offerId: f.offerId ?? "",
      priceCents: cents(formData.get("price"), "price", false),
      startDate: f.startDate ? new Date(f.startDate) : new Date(),
      nextDueDate: f.nextDueDate ? new Date(f.nextDueDate) : null,
      notes: f.notes || null,
    });
    revalidatePath("/admin", "layout");
    return ok("Abonnement créé.");
  });
}

export async function updateSubscriptionAction(subscriptionId: string, _: unknown, formData: FormData) {
  return runAction("updateSubscription", async () => {
    const actor = await requireAdmin();
    const f = Object.fromEntries(formData) as Record<string, string>;
    await updateSubscription(actor, id.parse(subscriptionId), {
      status: f.status as never,
      priceCents: cents(formData.get("price"), "price")!,
      nextDueDate: f.nextDueDate ? new Date(f.nextDueDate) : null,
      notes: f.notes || null,
    });
    revalidatePath("/admin", "layout");
    return ok("Abonnement mis à jour.");
  });
}
