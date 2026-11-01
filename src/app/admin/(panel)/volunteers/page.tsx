import Volunteers from "@/components/admin/Volunteers";
import { getDb } from "@/lib/db";
export const dynamic = "force-dynamic";
export default async function Page() {
  const db = await getDb();
  return <Volunteers initial={db.volunteers} />;
}
