import { requireAdminPage } from "@/server/auth/guards";
export default async function AdminHome() {
  const actor = await requireAdminPage();
  return <p className="p-8">Bonjour {actor.firstName}</p>;
}
