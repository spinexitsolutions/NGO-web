import { Suspense } from "react";
import InboxView from "@/components/admin/InboxView";
import { getDb } from "@/lib/db";
export const dynamic = "force-dynamic";
export default async function Page() {
  const db = await getDb();
  return (
    <Suspense>
      <InboxView initial={db.messages} />
    </Suspense>
  );
}
