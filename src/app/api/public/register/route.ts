import { NextResponse } from "next/server";
import { mutate, uid } from "@/lib/db";
import { bad, clean, isEmail } from "@/lib/validate";

export async function POST(req: Request) {
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const name = clean(b.name, 120);
  const email = clean(b.email, 160).toLowerCase();
  const seats = Math.min(10, Math.max(1, Math.round(Number(b.seats) || 1)));
  if (!name) return bad("Please enter your name");
  if (!isEmail(email)) return bad("Please enter a valid email");
  const res = await mutate((db) => {
    const ev = db.events.find((e) => e.id === b.eventId && e.status === "published");
    if (!ev) return { error: "Event not found" };
    const taken = db.registrations.filter((r) => r.eventId === ev.id).reduce((s, r) => s + r.seats, 0);
    if (taken + seats > ev.capacity) return { error: "Sorry, this event is full" };
    db.registrations.unshift({ id: uid("reg"), eventId: ev.id, eventTitle: ev.title, name, email, phone: clean(b.phone, 30), seats, createdAt: new Date().toISOString() });
    return { ok: true };
  });
  if ("error" in res) return bad(res.error as string);
  return NextResponse.json(res);
}
