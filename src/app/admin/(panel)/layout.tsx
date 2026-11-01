import { cookies } from "next/headers";
import Shell from "@/components/admin/Shell";
import { getDb } from "@/lib/db";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const db = await getDb();
  const session = await verifySession((await cookies()).get(SESSION_COOKIE)?.value);
  return (
    <Shell
      siteName={db.settings.shortName || db.settings.name}
      accent={db.settings.accent}
      email={session?.email ?? "admin"}
      unread={db.messages.filter((m) => m.status === "unread").length}
      newVolunteers={db.volunteers.filter((v) => v.status === "new").length}
    >
      {children}
    </Shell>
  );
}
