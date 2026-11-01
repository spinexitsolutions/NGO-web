import Donors from "@/components/admin/Donors";
import { getDb } from "@/lib/db";
export const dynamic = "force-dynamic";
export default async function Page() {
  const db = await getDb();
  return <Donors initialDonors={db.donors} donations={db.donations} />;
}
