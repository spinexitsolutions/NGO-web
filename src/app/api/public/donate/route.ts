import { NextResponse } from "next/server";
import { mutate, uid } from "@/lib/db";
import { bad, clean, isEmail } from "@/lib/validate";
import type { Donation, Donor } from "@/lib/types";

export async function POST(req: Request) {
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const name = clean(b.name, 120);
  const email = clean(b.email, 160).toLowerCase();
  const phone = clean(b.phone, 30);
  const pan = clean(b.pan, 12).toUpperCase();
  const city = clean(b.city, 60);
  const amount = Math.round(Number(b.amount));
  const frequency = b.frequency === "monthly" ? "monthly" : "one-time";
  const method = (["UPI", "Card", "NetBanking"] as const).find((m) => m === b.method) ?? "UPI";
  const campaignId = clean(b.campaignId, 40);

  if (!name) return bad("Please enter your name");
  if (!isEmail(email)) return bad("Please enter a valid email");
  if (!Number.isFinite(amount) || amount < 100 || amount > 10_000_000) return bad("Amount must be between ₹100 and ₹1 crore");

  const result = await mutate((db) => {
    let donor = db.donors.find((d) => d.email.toLowerCase() === email);
    if (!donor) {
      donor = { id: uid("dnr"), name, email, phone, city, pan, type: "individual", tags: frequency === "monthly" ? ["Monthly"] : [], notes: "", createdAt: new Date().toISOString() } satisfies Donor;
      db.donors.unshift(donor);
    } else {
      if (phone) donor.phone = phone;
      if (pan) donor.pan = pan;
      if (frequency === "monthly" && !donor.tags.includes("Monthly")) donor.tags.push("Monthly");
    }
    const campaign = db.campaigns.find((c) => c.id === campaignId);
    const n = db.donations.length + 1000;
    const donation: Donation = {
      id: uid("don"),
      donorId: donor.id,
      donorName: name,
      email,
      amount,
      frequency,
      campaignId: campaign?.id ?? "",
      campaignTitle: campaign?.title ?? "General Fund",
      method,
      status: "completed", // demo: payment gateway is simulated
      receiptNo: `UMF/26-27/${n}`,
      createdAt: new Date().toISOString(),
    };
    db.donations.unshift(donation);
    if (campaign) {
      campaign.raised += amount;
      campaign.donors += 1;
    }
    return donation;
  });

  return NextResponse.json({ ok: true, receiptNo: result.receiptNo, id: result.id });
}
