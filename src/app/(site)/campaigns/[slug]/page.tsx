import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, Heart, Users } from "lucide-react";
import { getDb } from "@/lib/db";
import { compactInr, daysLeft, inr, num, pct } from "@/lib/format";
import PageHeader from "@/components/site/PageHeader";
import Prose from "@/components/site/Prose";
import ShareButtons from "@/components/site/ShareButtons";
import Button from "@/components/ui/Button";
import { Progress, Reveal } from "@/components/site/motion";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = (await getDb()).campaigns.find((x) => x.slug === slug);
  return c ? { title: c.title, description: c.summary } : {};
}

function ago(iso: string) {
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 60) return `${Math.max(1, m)} min ago`;
  if (m < 1440) return `${Math.round(m / 60)} hrs ago`;
  return `${Math.round(m / 1440)} days ago`;
}

export default async function CampaignPage({ params }: Props) {
  const { slug } = await params;
  const db = await getDb();
  const c = db.campaigns.find((x) => x.slug === slug && x.status !== "draft");
  if (!c) notFound();
  const p = pct(c.raised, c.goal);
  const done = c.status === "completed" || p >= 100;
  const recent = db.donations.filter((d) => d.campaignId === c.id && d.status === "completed").slice(0, 6);

  return (
    <>
      <PageHeader eyebrow={c.urgent && !done ? "Urgent campaign" : "Campaign"} title={c.title} text={c.summary} image={c.image} />

      <section className="container-x grid gap-16 py-20 md:py-28 lg:grid-cols-[1fr_26rem]">
        <div>
          <Reveal>
            <Prose text={c.story} />
          </Reveal>
          <div className="mt-14 border-t border-line pt-8">
            <p className="mb-4 text-sm font-medium">Share this campaign</p>
            <ShareButtons title={c.title} />
          </div>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-xl3 bg-card p-7 ring-1 ring-ink/5 md:p-8">
            <p className="display text-5xl">{compactInr(c.raised)}</p>
            <p className="mt-1 text-muted">raised of {inr(c.goal)} goal</p>
            <Progress value={p} className="mt-6 h-2" />
            <div className="mt-6 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-2xl bg-paper p-3">
                <p className="text-xl font-semibold">{p}%</p>
                <p className="text-xs text-muted">funded</p>
              </div>
              <div className="rounded-2xl bg-paper p-3">
                <p className="flex items-center justify-center gap-1 text-xl font-semibold"><Users className="size-4" />{num(c.donors)}</p>
                <p className="text-xs text-muted">donors</p>
              </div>
              <div className="rounded-2xl bg-paper p-3">
                <p className="flex items-center justify-center gap-1 text-xl font-semibold"><Clock className="size-4" />{done ? 0 : daysLeft(c.endDate)}</p>
                <p className="text-xs text-muted">days left</p>
              </div>
            </div>
            <div className="mt-6">
              {done ? (
                <Button href="/campaigns" variant="ink" className="w-full">Fully funded — see live campaigns</Button>
              ) : (
                <Button href={`/donate?campaign=${c.id}`} className="w-full">Donate to this campaign</Button>
              )}
            </div>
            {recent.length > 0 && (
              <div className="mt-8">
                <p className="mb-3 text-sm font-medium">Recent supporters</p>
                <ul className="space-y-3">
                  {recent.map((d) => (
                    <li key={d.id} className="flex items-center gap-3 text-sm">
                      <span className="grid size-9 place-items-center rounded-full bg-accent-soft text-accent"><Heart className="size-4 fill-current" /></span>
                      <span className="flex-1">
                        <b className="font-semibold">{d.donorName.split(" ")[0]}</b> gave {inr(d.amount)}
                      </span>
                      <span className="text-xs text-muted">{ago(d.createdAt)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>
      </section>
    </>
  );
}
