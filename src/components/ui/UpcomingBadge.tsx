"use client";

import { useEffect, useState } from "react";

/** Pastille « À venir » si la date (AAAA-MM-JJ) n'est pas encore passée — calculée au chargement. */
export default function UpcomingBadge({ date, className = "" }: { date: string | null; className?: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!date) return;
    const d = new Date();
    const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    setShow(date >= today);
  }, [date]);
  if (!show) return null;
  return (
    <span className={`inline-flex items-center gap-2 rounded-full bg-saffron px-3 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-night ${className}`}>
      <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse rounded-full bg-night" />À venir
    </span>
  );
}
