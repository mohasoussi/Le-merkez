"use client";

import { Button } from "@/components/ui/Button";

export default function PublicError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold">Une erreur est survenue.</h1>
      <p className="mt-2 text-muted">Veuillez réessayer.</p>
      <Button className="mt-6" onClick={reset}>
        Réessayer
      </Button>
    </div>
  );
}
