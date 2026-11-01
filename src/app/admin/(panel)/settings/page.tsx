import SettingsForm from "@/components/admin/SettingsForm";
import { getDb } from "@/lib/db";
export const dynamic = "force-dynamic";
export default async function Page() {
  const { settings } = await getDb();
  return <SettingsForm initial={settings} />;
}
