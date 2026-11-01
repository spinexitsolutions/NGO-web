import { NextResponse } from "next/server";
import { mutate, uid } from "@/lib/db";
import { bad, clean, isEmail } from "@/lib/validate";

export async function POST(req: Request) {
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const name = clean(b.name, 120);
  const email = clean(b.email, 160).toLowerCase();
  const message = clean(b.message, 4000);
  if (!name) return bad("Please enter your name");
  if (!isEmail(email)) return bad("Please enter a valid email");
  if (message.length < 5) return bad("Please write a short message");
  await mutate((db) => {
    db.messages.unshift({ id: uid("msg"), name, email, subject: clean(b.subject, 160) || "General enquiry", message, status: "unread", createdAt: new Date().toISOString() });
  });
  return NextResponse.json({ ok: true });
}
