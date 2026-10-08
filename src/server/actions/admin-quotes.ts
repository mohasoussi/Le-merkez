"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "@/lib/zod";
import { requireAdmin } from "@/server/auth/guards";
import * as quotes from "@/server/services/quotes";
import { QUOTE_STATUSES } from "@/lib/constants";
import { ok, runAction } from "./result";

const id = z.string().min(1).max(40);

export async function saveQuoteAction(target: { quoteId?: string; leadId?: string }, input: quotes.QuoteInput) {
  let dest: string | null = null;
  const res = await runAction("saveQuote", async () => {
    const actor = await requireAdmin();
    if (target.quoteId) {
      await quotes.updateQuote(actor, id.parse(target.quoteId), input);
      revalidatePath("/admin", "layout");
      return ok("Devis enregistré.");
    }
    const q = await quotes.createQuote(actor, id.parse(target.leadId), input);
    revalidatePath("/admin", "layout");
    dest = `/admin/devis/${q.id}`;
  });
  if (res.ok && dest) redirect(dest);
  return res;
}

export async function setQuoteStatusAction(quoteId: string, status: string) {
  return runAction("setQuoteStatus", async () => {
    const actor = await requireAdmin();
    await quotes.setQuoteStatus(actor, id.parse(quoteId), z.enum(QUOTE_STATUSES).parse(status));
    revalidatePath("/admin", "layout");
    return ok("Statut du devis mis à jour.");
  });
}

export async function deleteQuoteAction(quoteId: string) {
  let leadId = "";
  const res = await runAction("deleteQuote", async () => {
    const actor = await requireAdmin();
    leadId = await quotes.deleteQuote(actor, id.parse(quoteId));
    revalidatePath("/admin", "layout");
  });
  if (!res.ok) return res;
  redirect(`/admin/prospects/${leadId}`);
}
