"use client";

import { useActionState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { postMessageAction } from "@/server/actions/project-space";
import type { ActionResult } from "@/server/actions/result";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Field";
import { Alert } from "@/components/ui/States";
import { formatDateTime, initials } from "@/lib/format";
import { cn } from "@/lib/cn";

export interface MessageItem {
  id: string;
  body: string;
  createdAt: string;
  author: { id: string; firstName: string; lastName: string; role: string } | null;
}

export function MessageThread({ projectId, messages, currentUserId, teamLabel }: { projectId: string; messages: MessageItem[]; currentUserId: string; teamLabel: string }) {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(postMessageAction.bind(null, projectId), null);
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => endRef.current?.scrollIntoView({ block: "nearest" }), [messages.length]);

  return (
    <div className="flex flex-col gap-4">
      {messages.length === 0 ? (
        <p className="rounded-xl bg-canvas px-4 py-6 text-center text-sm text-muted">Aucun message pour le moment. Une question, une remarque ? Écrivez-nous ici.</p>
      ) : (
        <ol className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto pr-1" aria-label="Messages">
          {messages.map((m) => {
            const mine = m.author?.id === currentUserId;
            const isTeam = m.author?.role === "ADMIN";
            return (
              <li key={m.id} className={cn("flex max-w-[88%] gap-2.5", mine ? "flex-row-reverse self-end" : "self-start")}>
                <span className={cn("grid size-8 shrink-0 place-items-center rounded-full text-xs font-medium", isTeam ? "bg-ink text-white" : "bg-brand-soft text-brand-strong")} aria-hidden>
                  {initials(m.author?.firstName, m.author?.lastName)}
                </span>
                <div className={cn("min-w-0", mine && "text-right")}>
                  <p className="text-xs text-muted">
                    <span className="font-medium text-ink-soft">{isTeam ? `${m.author?.firstName} (${teamLabel})` : (m.author?.firstName ?? "Utilisateur supprimé")}</span> · <time dateTime={m.createdAt}>{formatDateTime(m.createdAt)}</time>
                  </p>
                  <p className={cn("mt-1 inline-block whitespace-pre-line break-words rounded-2xl px-3.5 py-2.5 text-left text-sm", mine ? "rounded-tr-md bg-ink text-white" : "rounded-tl-md bg-canvas")}>{m.body}</p>
                </div>
              </li>
            );
          })}
          <div ref={endRef} />
        </ol>
      )}
      <form action={action} className="flex flex-col gap-2">
        {state && !state.ok && <Alert>{state.error}</Alert>}
        <label htmlFor={`msg-${projectId}`} className="sr-only">
          Votre message
        </label>
        <Textarea id={`msg-${projectId}`} name="body" rows={3} required maxLength={5000} placeholder="Votre message…" className="min-h-20 text-sm" />
        <Button type="submit" pending={pending} size="sm" className="self-end">
          <Send className="size-4" aria-hidden /> Envoyer
        </Button>
      </form>
    </div>
  );
}
