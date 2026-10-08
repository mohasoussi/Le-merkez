"use client";

import { Alert } from "@/components/ui/States";
import { Button } from "@/components/ui/Button";

export default function AdminError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-md py-16">
      <Alert>Une erreur est survenue. Veuillez réessayer.</Alert>
      <Button variant="secondary" className="mt-4" onClick={reset}>
        Réessayer
      </Button>
    </div>
  );
}
