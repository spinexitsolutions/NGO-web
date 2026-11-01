import Link from "next/link";
import { ArrowDownRight, ArrowRight, ArrowUpRight, CircleDollarSign, HandHeart, Inbox, Mail, Plus, Users, Megaphone, PenSquare, CalendarPlus } from "lucide-react";
import { getDb } from "@/lib/db";
import { inr, inrCompact, timeAgo } from "@/lib/admin-format";
import { Avatar, Badge, Card, PageHeader } from "@/components/admin/ui";
import { CampaignDonut, MonthlyArea } from "@/components/admin/DashboardCharts";

export const dynamic = "force-dynamic";

function Kpi({ label, value, sub, delta, icon: Icon, href }: { label: string; value: string; sub?: string; delta?: number; icon: React.ComponentType<{ className?: string }>; href: string }) {
  return (
    <Link href={href} className="group">
      <Card className="h-full p-5 transition duration-300 group-hover:-translate-y-0.5 group-hover:shadow-xl group-hover:shadow-black/[0.04]">
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-muted">{label}</span>
          <span className="grid size-8 place-items-center rounded-full bg-paper text-ink-2 transition group-hover:bg-ink group-hover:text-white">
            <Icon className="size-4" />
          </span>
        </div>
        <div className="mt-3 text-[28px] font-semibold tracking-[-0.03em] tabular-nums">{value}</div>
        <div className="mt-1 flex items-center gap-1.5 text-[12.5px] text-muted">
          {delta !== undefined && (
            <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-px font-medium ${delta >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
              {delta >= 0 ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
              {Math.abs(delta)}%
            </span>
          )}
          {sub}
        </div>
      </Card>
    </Link>
  );
}

export default async function Dashboard() {
  const db = await getDb();
  const done = db.donations.filter((d) => d.status === "completed");
  const now = new Date();
  const monthKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}`;
  // rolling 30-day windows read better than calendar months early in a month
  const day = 86400000;
  const in30 = done.filter((d) => now.getTime() - new Date(d.createdAt).getTime() < 30 * day);
  const prev30 = done.filter((d) => {
    const age = now.getTime() - new Date(d.createdAt).getTime();
    return age >= 30 * day && age < 60 * day;
  });
  const sum = (arr: { amount: number }[]) => arr.reduce((s, d) => s + d.amount, 0);
  const delta = (a: number, b: number) => (b ? Math.round(((a - b) / b) * 100) : 100);

  const months = Array.from({ length: 12 }, (_, i) => new Date(now.getFullYear(), now.getMonth() - 11 + i, 1));
  const series = months.map((m) => {
    const list = done.filter((d) => monthKey(new Date(d.createdAt)) === monthKey(m));
    return { month: m.toLocaleDateString("en-IN", { month: "short" }), amount: sum(list), count: list.length };
  });

  const byCampaign = new Map<string, number>();
  for (const d of done) byCampaign.set(d.campaignTitle || "General Fund", (byCampaign.get(d.campaignTitle || "General Fund") ?? 0) + d.amount);
  const donut = [...byCampaign.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  const newDonors30 = db.donors.filter((d) => now.getTime() - new Date(d.createdAt).getTime() < 30 * day).length;
  const unread = db.messages.filter((m) => m.status === "unread").length;
  const activeVol = db.volunteers.filter((v) => v.status === "onboarded").length;
  const newVol = db.volunteers.filter((v) => v.status === "new").length;
  const subs = db.subscribers.filter((s) => s.status === "active").length;
  const avg = done.length ? sum(done) / done.length : 0;
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 17 ? "Good afternoon" : "Good evening";

  return (
    <>
      <PageHeader
        eyebrow={now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
        title={`${greeting} 👋`}
        description={`Here's how ${db.settings.shortName} is doing. ${unread ? `You have ${unread} unread message${unread > 1 ? "s" : ""} and ${newVol} new volunteer application${newVol === 1 ? "" : "s"}.` : "Inbox zero — nice."}`}
        actions={
          <>
            <Link href="/admin/donations?new=1" className="inline-flex h-10 items-center gap-1.5 rounded-full border border-line bg-white px-4 text-sm font-medium hover:border-ink/25">
              <Plus className="size-4" /> Record donation
            </Link>
            <Link href="/admin/campaigns" className="inline-flex h-10 items-center gap-1.5 rounded-full bg-ink px-4 text-sm font-medium text-white hover:bg-ink-2">
              <Megaphone className="size-4" /> Campaigns
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4">
        <Kpi label="Total raised" value={inrCompact(sum(done))} sub={`${done.length} donations · avg ${inrCompact(avg)}`} icon={CircleDollarSign} href="/admin/donations" />
        <Kpi label="Last 30 days" value={inrCompact(sum(in30))} delta={delta(sum(in30), sum(prev30))} sub="vs previous 30d" icon={ArrowUpRight} href="/admin/donations" />
        <Kpi label="Donors" value={db.donors.length.toLocaleString("en-IN")} sub={`+${newDonors30} in 30 days`} icon={Users} href="/admin/donors" />
        <Kpi label="Volunteers" value={String(activeVol)} sub={`${newVol} new applications`} icon={HandHeart} href="/admin/volunteers" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[13px] text-muted">Donations · last 12 months</div>
              <div className="mt-1 text-xl font-semibold tracking-tight tabular-nums">{inr(series.reduce((s, x) => s + x.amount, 0))}</div>
            </div>
            <Badge tone="green">live</Badge>
          </div>
          <div className="mt-4 h-64 md:h-72">
            <MonthlyArea data={series} />
          </div>
        </Card>
        <Card className="p-5">
          <div className="text-[13px] text-muted">Raised by campaign</div>
          <div className="mt-4">
            <CampaignDonut data={donut} />
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between px-5 pb-2 pt-5">
            <div className="font-semibold tracking-tight">Recent donations</div>
            <Link href="/admin/donations" className="inline-flex items-center gap-1 text-[13px] text-muted hover:text-ink">
              View all <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <ul>
            {db.donations.slice(0, 7).map((d) => (
              <li key={d.id} className="flex items-center gap-3 border-t border-line px-5 py-3 first:border-t-0">
                <Avatar name={d.donorName} size={34} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{d.donorName}</div>
                  <div className="truncate text-[12.5px] text-muted">
                    {d.campaignTitle} · {d.method} · {timeAgo(d.createdAt)}
                  </div>
                </div>
                <div className="hidden sm:block">
                  <Badge>{d.status}</Badge>
                </div>
                <div className="w-24 text-right text-sm font-semibold tabular-nums">{inr(d.amount)}</div>
              </li>
            ))}
          </ul>
        </Card>

        <div className="flex flex-col gap-4">
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between px-5 pb-2 pt-5">
              <div className="flex items-center gap-2 font-semibold tracking-tight">
                Inbox {unread > 0 && <Badge tone="accent">{unread} new</Badge>}
              </div>
              <Link href="/admin/inbox" className="inline-flex items-center gap-1 text-[13px] text-muted hover:text-ink">
                Open <ArrowRight className="size-3.5" />
              </Link>
            </div>
            <ul>
              {db.messages.slice(0, 4).map((m) => (
                <li key={m.id}>
                  <Link href={`/admin/inbox?id=${m.id}`} className="flex gap-3 border-t border-line px-5 py-3 hover:bg-paper/50">
                    <span className={`mt-1.5 size-2 shrink-0 rounded-full ${m.status === "unread" ? "bg-accent" : "bg-transparent"}`} />
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="truncate text-sm font-medium">{m.name}</span>
                        <span className="ml-auto shrink-0 text-[11.5px] text-muted">{timeAgo(m.createdAt)}</span>
                      </div>
                      <div className="truncate text-[12.5px] text-muted">{m.subject}</div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-5">
            <div className="mb-3 font-semibold tracking-tight">Quick actions</div>
            <div className="grid grid-cols-2 gap-2 text-[13px]">
              {[
                { href: "/admin/stories", label: "Write a story", icon: PenSquare },
                { href: "/admin/events", label: "Add event", icon: CalendarPlus },
                { href: "/admin/inbox", label: "Reply to inbox", icon: Inbox },
                { href: "/admin/subscribers", label: `${subs} subscribers`, icon: Mail },
              ].map((a) => (
                <Link key={a.href} href={a.href} className="flex items-center gap-2 rounded-2xl bg-paper px-3 py-3 font-medium transition hover:bg-ink hover:text-white">
                  <a.icon className="size-4" /> {a.label}
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Card className="mt-4 p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="font-semibold tracking-tight">Campaign progress</div>
          <Link href="/admin/campaigns" className="inline-flex items-center gap-1 text-[13px] text-muted hover:text-ink">
            Manage <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {db.campaigns.map((c) => {
            const pct = Math.min(100, Math.round((c.raised / (c.goal || 1)) * 100));
            return (
              <div key={c.id} className="flex gap-3">
                <img src={c.image} alt="" className="size-14 shrink-0 rounded-2xl object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="truncate text-sm font-medium">{c.title}</div>
                  </div>
                  <div className="mt-0.5 text-[12px] text-muted tabular-nums">
                    {inrCompact(c.raised)} of {inrCompact(c.goal)}
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-paper">
                    <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
}
