"use client";

import { useState, useTransition } from "react";
import { deleteQuoteAction, setQuoteStatusAction } from "@/server/actions/admin-quotes";
import { Button } from "@/components/ui/Button";
import type { QuoteStatusCode } from "@/lib/constants";

export function QuoteActions({ quoteId, status }: { quoteId: string; status: QuoteStatusCode }) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const set = (s: QuoteStatusCode) => start(async () => setMsg(((r) => (r.ok ? (r.message ?? null) : r.error))(await setQuoteStatusAction(quoteId, s))));
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {status === "DRAFT" && (
          <Button size="sm" pending={pending} onClick={() => set("SENT")}>
            Marquer comme envoyé
          </Button>
        )}
        {(status === "SENT" || status === "DRAFT") && (
          <>
            <Button size="sm" variant="brand" pending={pending} onClick={() => set("ACCEPTED")}>
              Accepté
            </Button>
            <Button size="sm" variant="secondary" pending={pending} onClick={() => set("REFUSED")}>
              Refusé
            </Button>
          </>
        )}
        {status === "SENT" && (
          <Button size="sm" variant="ghost" pending={pending} onClick={() => set("EXPIRED")}>
            Expiré
          </Button>
        )}
        {status === "DRAFT" && (
          <Button size="sm" variant="ghost" className="text-danger hover:bg-danger-soft" pending={pending} onClick={() => confirm("Supprimer ce brouillon ?") && start(async () => void (await deleteQuoteAction(quoteId)))}>
            Supprimer
          </Button>
        )}
      </div>
      {msg && <p className="text-xs text-muted">{msg}</p>}
    </div>
  );
}
