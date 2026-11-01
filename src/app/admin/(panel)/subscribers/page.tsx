import Subscribers from "@/components/admin/Subscribers";
import { getDb } from "@/lib/db";
export const dynamic = "force-dynamic";
export default async function Page() {
  const db = await getDb();
  return <Subscribers initial={db.subscribers} />;
}
