import { NextResponse } from "next/server";
import { mutate, uid } from "@/lib/db";
import { bad, clean, isEmail } from "@/lib/validate";

export async function POST(req: Request) {
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const email = clean(b.email, 160).toLowerCase();
  if (!isEmail(email)) return bad("Please enter a valid email");
  await mutate((db) => {
    const existing = db.subscribers.find((s) => s.email === email);
    if (existing) existing.status = "active";
    else db.subscribers.unshift({ id: uid("sub"), email, status: "active", createdAt: new Date().toISOString() });
  });
  return NextResponse.json({ ok: true });
}
