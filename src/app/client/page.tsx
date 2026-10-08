import { requireClientPage } from "@/server/auth/guards";
export default async function ClientHome() {
  const actor = await requireClientPage();
  return <p className="p-8">Bonjour {actor.firstName}</p>;
}
