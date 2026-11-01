import { Suspense } from "react";
import Donations from "@/components/admin/Donations";
import { getDb } from "@/lib/db";
export const dynamic = "force-dynamic";
export default async function Page() {
  const db = await getDb();
  return (
    <Suspense>
      <Donations initial={db.donations} donors={db.donors} campaigns={db.campaigns} />
    </Suspense>
  );
}
