import { NextResponse } from "next/server";
import { PREFIX, getDb, mutate, uid } from "@/lib/db";
import { COLLECTIONS, type CollectionKey } from "@/lib/types";

type Ctx = { params: Promise<{ name: string }> };

function check(name: string): name is CollectionKey {
  return (COLLECTIONS as readonly string[]).includes(name);
}

export async function GET(_: Request, { params }: Ctx) {
  const { name } = await params;
  if (!check(name)) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  const db = await getDb();
  return NextResponse.json(db[name]);
}

/** Create one item */
export async function POST(req: Request, { params }: Ctx) {
  const { name } = await params;
  if (!check(name)) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  const body = (await req.json()) as Record<string, unknown>;
  const item = await mutate((db) => {
    const list = db[name] as unknown as Record<string, unknown>[];
    const created = { ...body, id: (body.id as string) || uid(PREFIX[name]) };
    if (!created.createdAt && ["donors", "donations", "volunteers", "messages", "subscribers", "registrations"].includes(name)) {
      created.createdAt = new Date().toISOString();
    }
    list.unshift(created);
    return created;
  });
  return NextResponse.json(item, { status: 201 });
}

/** Replace the whole list (used for re-ordering nav, sections, stats…) */
export async function PUT(req: Request, { params }: Ctx) {
  const { name } = await params;
  if (!check(name)) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  const body = await req.json();
  if (!Array.isArray(body)) return NextResponse.json({ error: "Expected an array" }, { status: 400 });
  const saved = await mutate((db) => {
    (db as unknown as Record<string, unknown>)[name] = body;
    return db[name];
  });
  return NextResponse.json(saved);
}
