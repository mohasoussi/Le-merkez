import Link from "next/link";
import { EmptyState } from "@/components/ui/States";

export default function NotFound() {
  return <EmptyState className="mt-10" title="Élément introuvable" description="Il a peut-être été supprimé." action={<Link href="/client" className="text-sm font-medium text-brand">Retour à mes projets</Link>} />;
}
