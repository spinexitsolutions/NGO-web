import { NextResponse } from "next/server";
import { getDb, mutate } from "@/lib/db";
import { COLLECTIONS, type CollectionKey } from "@/lib/types";

type Ctx = { params: Promise<{ name: string; id: string }> };
type Row = Record<string, unknown> & { id: string };

function check(name: string): name is CollectionKey {
  return (COLLECTIONS as readonly string[]).includes(name);
}

export async function GET(_: Request, { params }: Ctx) {
  const { name, id } = await params;
  if (!check(name)) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  const db = await getDb();
  const item = (db[name] as unknown as Row[]).find((r) => r.id === id);
  return item ? NextResponse.json(item) : NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function PATCH(req: Request, { params }: Ctx) {
  const { name, id } = await params;
  if (!check(name)) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  const body = (await req.json()) as Record<string, unknown>;
  const updated = await mutate((db) => {
    const list = db[name] as unknown as Row[];
    const idx = list.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...body, id };
    return list[idx];
  });
  return updated ? NextResponse.json(updated) : NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function DELETE(_: Request, { params }: Ctx) {
  const { name, id } = await params;
  if (!check(name)) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  const ok = await mutate((db) => {
    const list = db[name] as unknown as Row[];
    const idx = list.findIndex((r) => r.id === id);
    if (idx === -1) return false;
    list.splice(idx, 1);
    return true;
  });
  return ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "Not found" }, { status: 404 });
}
