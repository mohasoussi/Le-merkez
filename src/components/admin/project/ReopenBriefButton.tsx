"use client";

import { useState, useTransition } from "react";
import { reopenBriefAction } from "@/server/actions/project-space";
import { Button } from "@/components/ui/Button";

export function ReopenBriefButton({ projectId }: { projectId: string }) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  return (
    <div className="flex items-center gap-3">
      <Button type="button" variant="secondary" size="sm" pending={pending} onClick={() => start(async () => setMsg((await reopenBriefAction(projectId)).ok ? "Brief rouvert." : "Erreur."))}>
        Rouvrir au client
      </Button>
      {msg && <span className="text-xs text-muted">{msg}</span>}
    </div>
  );
}
