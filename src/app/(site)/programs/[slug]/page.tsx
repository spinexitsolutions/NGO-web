import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { compactNum } from "@/lib/format";
import PageHeader from "@/components/site/PageHeader";
import Prose from "@/components/site/Prose";
import CampaignCard from "@/components/site/CampaignCard";
import Button from "@/components/ui/Button";
import { Counter, Reveal } from "@/components/site/motion";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = (await getDb()).programs.find((x) => x.slug === slug);
  return p ? { title: p.title, description: p.summary } : {};
}

export default async function ProgramPage({ params }: Props) {
  const { slug } = await params;
  const db = await getDb();
  const p = db.programs.find((x) => x.slug === slug && x.status === "published");
  if (!p) notFound();
  const campaigns = db.campaigns.filter((c) => c.programId === p.id && c.status === "active");
  const others = db.programs.filter((x) => x.id !== p.id && x.status === "published").slice(0, 3);

  return (
    <>
      <PageHeader eyebrow={`Programme · ${p.category}`} title={p.title} text={p.summary} image={p.image}>
        <Button href={`/donate`}>Support {p.title.toLowerCase()}</Button>
      </PageHeader>

      <section className="container-x grid gap-16 py-20 md:py-28 lg:grid-cols-[1fr_22rem]">
        <Reveal>
          <Prose text={p.body} />
        </Reveal>
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-xl3 bg-night p-8 text-paper">
            <p className="eyebrow text-paper/50">By the numbers</p>
            <p className="display mt-8 text-6xl"><Counter value={p.beneficiaries} /></p>
            <p className="text-paper/60">people reached</p>
            <div className="my-6 h-px bg-paper/10" />
            <p className="display text-6xl"><Counter value={p.locations} /></p>
            <p className="text-paper/60">locations</p>
            <div className="mt-8"><Button href="/donate" variant="light" className="w-full">Donate</Button></div>
          </div>
        </aside>
      </section>

      {campaigns.length > 0 && (
        <section className="container-x pb-20">
          <h2 className="display mb-10 text-4xl md:text-5xl">Live campaigns in {p.title.toLowerCase()}</h2>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((c) => <CampaignCard key={c.id} c={c} />)}
          </div>
        </section>
      )}

      <section className="container-x pb-28">
        <h2 className="display mb-10 text-4xl md:text-5xl">Other programmes</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {others.map((o) => (
            <Link key={o.id} href={`/programs/${o.slug}`} className="group rounded-xl3 bg-card p-6 ring-1 ring-ink/5 transition-colors hover:bg-night hover:text-paper">
              <span className="block h-1 w-10 rounded-full transition-all group-hover:w-16" style={{ background: o.color }} />
              <p className="display mt-10 text-4xl">{o.title}</p>
              <p className="mt-2 text-sm text-muted group-hover:text-paper/60">{compactNum(o.beneficiaries)} people reached</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
