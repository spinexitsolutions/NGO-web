import type { Metadata } from "next";
import { Download, FileText } from "lucide-react";
import { getDb } from "@/lib/db";
import { compactInr, compactNum } from "@/lib/format";
import PageHeader from "@/components/site/PageHeader";
import SectionHeading from "@/components/site/SectionHeading";
import Stats from "@/components/home/Stats";
import ImpactCalc from "@/components/home/ImpactCalc";
import Faq from "@/components/site/Faq";
import { Reveal, Counter } from "@/components/site/motion";

export const metadata: Metadata = { title: "Impact & transparency" };

export default async function ImpactPage() {
  const db = await getDb();
  const programs = db.programs.filter((p) => p.status === "published");
  const raised = db.donations.filter((d) => d.status === "completed").reduce((s, d) => s + d.amount, 0);
  const maxB = Math.max(...programs.map((p) => p.beneficiaries), 1);

  return (
    <>
      <PageHeader eyebrow="Impact & transparency" title="Every rupee," accent="accounted for." text="We publish our numbers, our audits and our mistakes. If you can't see where your money went, we haven't done our job." />

      <section className="container-x pt-20">
        <div className="grid gap-5 md:grid-cols-3">
          <Reveal className="rounded-xl3 bg-night p-8 text-paper md:col-span-2 md:p-10">
            <p className="eyebrow text-paper/50">Raised online this year</p>
            <p className="display mt-6 text-[clamp(3.5rem,9vw,7rem)]">{compactInr(raised)}</p>
            <p className="mt-2 max-w-md text-paper/60">From individual donors and CSR partners, tracked live from our donor CRM.</p>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col justify-between rounded-xl3 bg-accent p-8 text-white md:p-10">
            <p className="eyebrow text-white/70">Programme ratio</p>
            <p className="display text-[clamp(3.5rem,9vw,7rem)]"><Counter value={db.allocation.filter((a) => !/fund|admin/i.test(a.label)).reduce((s, a) => s + a.value, 0)} suffix="%" /></p>
            <p className="text-white/80">of spending reaches programmes directly</p>
          </Reveal>
        </div>
      </section>

      <section className="pt-20"><Stats stats={db.stats} /></section>

      <section className="container-x pb-12">
        <SectionHeading eyebrow="Reach by programme" title="Who we" accent="reached." />
        <div className="mt-12 space-y-5">
          {programs.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.05} className="grid grid-cols-[7rem_1fr_auto] items-center gap-4 md:grid-cols-[12rem_1fr_6rem]">
              <span className="font-semibold">{p.title}</span>
              <span className="h-3 overflow-hidden rounded-full bg-ink/5">
                <span className="block h-full rounded-full" style={{ width: `${(p.beneficiaries / maxB) * 100}%`, background: p.color }} />
              </span>
              <span className="text-right tabular-nums text-muted">{compactNum(p.beneficiaries)}</span>
            </Reveal>
          ))}
        </div>
      </section>

      <ImpactCalc allocation={db.allocation} />

      <section className="container-x py-24 md:py-32">
        <SectionHeading eyebrow="Reports" title="Read the" accent="fine print." text="Annual reports and audited financials, free to download. Registration certificates available on request." />
        <ul className="mt-12 divide-y divide-line border-y border-line">
          {db.reports.map((r) => (
            <li key={r.id}>
              <a href={r.url} className="group flex items-center gap-5 py-6">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-card ring-1 ring-ink/5"><FileText className="size-5" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-lg font-semibold tracking-[-0.02em] transition-colors group-hover:text-accent md:text-xl">{r.title}</span>
                  <span className="text-sm text-muted">{r.kind} · PDF · {r.size}</span>
                </span>
                <span className="grid size-11 place-items-center rounded-full ring-1 ring-ink/15 transition-all group-hover:bg-ink group-hover:text-paper"><Download className="size-4" /></span>
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap gap-3 text-sm">
          {[`80G: ${db.settings.legal.reg80G}`, `FCRA: ${db.settings.legal.fcra}`, `CSR-1: ${db.settings.legal.csr}`, `PAN: ${db.settings.legal.pan}`].map((t) => (
            <span key={t} className="rounded-full bg-card px-4 py-2 ring-1 ring-ink/5">{t}</span>
          ))}
        </div>
      </section>

      <section className="container-x pb-28">
        <SectionHeading eyebrow="Questions" title="Things donors" accent="ask us." className="mb-12" />
        <Faq items={db.faqs.filter((f) => /donation|transparen/i.test(f.category))} />
      </section>
    </>
  );
}
