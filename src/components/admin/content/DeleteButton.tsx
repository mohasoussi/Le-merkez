"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { ActionResult } from "@/server/actions/result";

export function DeleteButton({ action, confirmText }: { action: () => Promise<ActionResult>; confirmText: string }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  return (
    <span className="inline-flex flex-col">
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className="text-danger hover:bg-danger-soft hover:text-danger"
        pending={pending}
        onClick={() =>
          confirm(confirmText) &&
          start(async () => {
            const r = await action();
            setError(r.ok ? null : r.error);
          })
        }
      >
        <Trash2 className="size-4" aria-hidden /> Supprimer
      </Button>
      {error && <span className="mt-1 max-w-xs text-xs text-danger">{error}</span>}
    </span>
  );
}
