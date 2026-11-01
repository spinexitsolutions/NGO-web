import HomepageEditor from "@/components/admin/HomepageEditor";
import { getDb } from "@/lib/db";
export const dynamic = "force-dynamic";
export default async function Page() {
  const db = await getDb();
  return <HomepageEditor hero={db.hero} sections={db.sections} />;
}
