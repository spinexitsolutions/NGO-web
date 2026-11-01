import IntroEditor from "@/components/admin/IntroEditor";
import { getDb } from "@/lib/db";
export const dynamic = "force-dynamic";
export default async function Page() {
  const db = await getDb();
  return <IntroEditor initial={db.intro} accent={db.settings.accent} />;
}
