import { NextResponse } from "next/server";
import { getDb, mutate } from "@/lib/db";
import { SINGLETONS, type SingletonKey } from "@/lib/types";

type Ctx = { params: Promise<{ key: string }> };

function check(key: string): key is SingletonKey {
  return (SINGLETONS as readonly string[]).includes(key);
}

export async function GET(_: Request, { params }: Ctx) {
  const { key } = await params;
  if (!check(key)) return NextResponse.json({ error: "Unknown content" }, { status: 404 });
  const db = await getDb();
  return NextResponse.json(db[key]);
}

export async function PUT(req: Request, { params }: Ctx) {
  const { key } = await params;
  if (!check(key)) return NextResponse.json({ error: "Unknown content" }, { status: 404 });
  const body = await req.json();
  const saved = await mutate((db) => {
    (db as unknown as Record<string, unknown>)[key] = { ...(db[key] as object), ...body };
    return db[key];
  });
  return NextResponse.json(saved);
}
