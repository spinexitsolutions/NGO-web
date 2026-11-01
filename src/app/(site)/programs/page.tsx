import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getDb } from "@/lib/db";
import { compactNum } from "@/lib/format";
import PageHeader from "@/components/site/PageHeader";
import SmartImage from "@/components/ui/SmartImage";
import { Reveal } from "@/components/site/motion";
import CTA from "@/components/home/CTA";

export const metadata: Metadata = { title: "Programmes" };

export default async function ProgramsPage() {
  const db = await getDb();
  const programs = db.programs.filter((p) => p.status === "published");
  return (
    <>
      <PageHeader
        eyebrow="Programmes"
        title="The work,"
        accent="up close."
        text="Six programmes, one approach: listen first, remove the real barrier, and stay until the community can carry it forward."
      />
      <section className="container-x space-y-6 py-20 md:space-y-10 md:py-28">
        {programs.map((p, i) => (
          <Reveal key={p.id}>
            <Link href={`/programs/${p.slug}`} className="group grid overflow-hidden rounded-xl3 bg-card ring-1 ring-ink/5 transition-shadow duration-500 hover:shadow-[0_40px_80px_-40px_rgb(0_0_0/0.35)] md:grid-cols-2">
              <div className={`relative aspect-[4/3] overflow-hidden md:aspect-auto md:min-h-[28rem] ${i % 2 ? "md:order-2" : ""}`}>
                <SmartImage src={p.image} alt={p.title} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105" />
              </div>
              <div className="flex flex-col justify-between gap-10 p-7 md:p-12">
                <div className="flex items-center justify-between">
                  <span className="rounded-full px-3 py-1 text-xs font-semibold text-white" style={{ background: p.color }}>{p.category}</span>
                  <span className="text-sm tabular-nums text-muted">{String(i + 1).padStart(2, "0")} / {String(programs.length).padStart(2, "0")}</span>
                </div>
                <div>
                  <h2 className="display text-6xl md:text-8xl">{p.title}</h2>
                  <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">{p.summary}</p>
                </div>
                <div className="flex items-end justify-between border-t border-line pt-6">
                  <div className="flex gap-10">
                    <div>
                      <p className="display text-3xl">{compactNum(p.beneficiaries)}</p>
                      <p className="text-sm text-muted">people reached</p>
                    </div>
                    <div>
                      <p className="display text-3xl">{p.locations}</p>
                      <p className="text-sm text-muted">locations</p>
                    </div>
                  </div>
                  <span className="grid size-14 place-items-center rounded-full bg-ink text-paper transition-all duration-500 group-hover:rotate-45 group-hover:bg-accent">
                    <ArrowUpRight />
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </section>
      <CTA donateLabel={db.settings.donateLabel} />
    </>
  );
}
