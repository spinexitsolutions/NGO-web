import { notFound } from "next/navigation";
import ResourceManager from "@/components/admin/ResourceManager";
import { RESOURCE_ROUTES } from "@/lib/admin-schemas";
import { getDb } from "@/lib/db";
import type { CollectionKey } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ResourcePage({ params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  const name = RESOURCE_ROUTES[resource] as CollectionKey | undefined;
  if (!name) notFound();
  const db = await getDb();
  const lookups = { programs: db.programs.map((p) => ({ value: p.id, label: p.title })) };
  return <ResourceManager key={name} name={name} initial={db[name] as unknown as (Record<string, unknown> & { id: string })[]} lookups={lookups} />;
}
