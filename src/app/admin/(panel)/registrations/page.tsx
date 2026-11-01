import Registrations from "@/components/admin/Registrations";
import { getDb } from "@/lib/db";
export const dynamic = "force-dynamic";
export default async function Page() {
  const db = await getDb();
  return <Registrations initial={db.registrations} events={db.events} />;
}
