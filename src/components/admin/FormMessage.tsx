import { Alert } from "@/components/ui/States";
import type { ActionResult } from "@/server/actions/result";

/** Affiche le résultat d'une Server Action (succès ou erreur lisible). */
export function FormMessage({ state }: { state: ActionResult<unknown> | null | undefined }) {
  if (!state) return null;
  if (!state.ok) return <Alert>{state.error}</Alert>;
  if (state.message) return <Alert tone="success">{state.message}</Alert>;
  return null;
}
