import type { Metadata } from "next";
import { getDb } from "@/lib/db";
import { compactInr, num } from "@/lib/format";
import PageHeader from "@/components/site/PageHeader";
import CampaignCard from "@/components/site/CampaignCard";
import { Reveal } from "@/components/site/motion";

export const metadata: Metadata = { title: "Campaigns" };

export default async function CampaignsPage() {
  const { campaigns } = await getDb();
  const active = campaigns.filter((c) => c.status === "active").sort((a, b) => Number(b.urgent) - Number(a.urgent));
  const done = campaigns.filter((c) => c.status === "completed");
  const raised = campaigns.filter((c) => c.status !== "draft").reduce((s, c) => s + c.raised, 0);
  const donors = campaigns.filter((c) => c.status !== "draft").reduce((s, c) => s + c.donors, 0);

  return (
    <>
      <PageHeader eyebrow="Campaigns" title="Pick a cause." accent="Watch it move." text="Every campaign has a clear goal, a deadline and a public progress bar. When we hit the goal, we close it — and tell you exactly what your money built.">
        <div className="flex gap-10">
          <div>
            <p className="display text-5xl text-accent">{compactInr(raised)}</p>
            <p className="eyebrow text-paper/55">raised so far</p>
          </div>
          <div>
            <p className="display text-5xl">{num(donors)}</p>
            <p className="eyebrow text-paper/55">donors</p>
          </div>
        </div>
      </PageHeader>

      <section className="container-x py-20 md:py-28">
        <h2 className="eyebrow mb-8 border-t border-ink/15 pt-3 text-muted">(Live) Running now — {active.length}</h2>
        <div className="grid gap-5 md:grid-cols-2">
          {active.map((c, i) => (
            <Reveal key={c.id} delay={(i % 2) * 0.08}>
              <CampaignCard c={c} />
            </Reveal>
          ))}
        </div>
        {done.length > 0 && (
          <>
            <h2 className="eyebrow mb-8 mt-24 text-muted">Completed — thank you</h2>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {done.map((c) => (
                <Reveal key={c.id}>
                  <CampaignCard c={c} />
                </Reveal>
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
}
