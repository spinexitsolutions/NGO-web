import type { Metadata } from "next";
import { getDb } from "@/lib/db";
import DonateFlow from "@/components/site/DonateFlow";

export const metadata: Metadata = { title: "Donate" };

type Props = { searchParams: Promise<Record<string, string | undefined>> };

export default async function DonatePage({ searchParams }: Props) {
  const sp = await searchParams;
  const db = await getDb();
  const campaigns = db.campaigns.filter((c) => c.status === "active").map((c) => ({ id: c.id, title: c.title, image: c.image, raised: c.raised, goal: c.goal }));
  const amount = Number(sp.amount);
  return (
    <DonateFlow
      campaigns={campaigns}
      initialCampaign={campaigns.some((c) => c.id === sp.campaign) ? sp.campaign! : ""}
      initialAmount={Number.isFinite(amount) && amount >= 100 ? Math.round(amount) : 2500}
      initialFrequency={sp.frequency === "monthly" ? "monthly" : "one-time"}
      legal={db.settings.legal}
    />
  );
}
