import { NextResponse } from "next/server";
import { mutate, uid } from "@/lib/db";
import { bad, clean, isEmail } from "@/lib/validate";

export async function POST(req: Request) {
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const name = clean(b.name, 120);
  const email = clean(b.email, 160).toLowerCase();
  if (!name) return bad("Please enter your name");
  if (!isEmail(email)) return bad("Please enter a valid email");
  const interests = Array.isArray(b.interests) ? b.interests.map((i) => clean(i, 60)).filter(Boolean).slice(0, 10) : [];
  await mutate((db) => {
    db.volunteers.unshift({
      id: uid("vol"),
      name,
      email,
      phone: clean(b.phone, 30),
      city: clean(b.city, 60),
      interests,
      availability: clean(b.availability, 80),
      message: clean(b.message, 2000),
      status: "new",
      createdAt: new Date().toISOString(),
    });
  });
  return NextResponse.json({ ok: true });
}
