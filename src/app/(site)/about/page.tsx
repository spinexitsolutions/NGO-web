import type { Metadata } from "next";
import { getDb } from "@/lib/db";
import PageHeader from "@/components/site/PageHeader";
import SectionHeading from "@/components/site/SectionHeading";
import Timeline from "@/components/site/Timeline";
import TeamGrid from "@/components/site/TeamGrid";
import Stats from "@/components/home/Stats";
import CTA from "@/components/home/CTA";
import { Reveal, ScrollText } from "@/components/site/motion";

export const metadata: Metadata = { title: "About us" };

export default async function AboutPage() {
  const { about, team, stats, settings } = await getDb();
  const sorted = [...team].sort((a, b) => a.order - b.order);
  const groups = [
    { key: "leadership", label: "Leadership" },
    { key: "board", label: "Board of trustees" },
    { key: "field", label: "In the field" },
  ] as const;

  return (
    <>
      <PageHeader eyebrow="About Ummeed" title={about.headline.split(" ").slice(0, -2).join(" ")} accent={about.headline.split(" ").slice(-2).join(" ")} text={about.intro} image={about.image} />

      <section className="container-x grid gap-5 py-24 md:grid-cols-2 md:py-32">
        <Reveal className="dots-dark rounded-xl3 bg-night p-8 text-paper md:p-12">
          <p className="eyebrow text-paper/50">Mission</p>
          <p className="display mt-8 text-3xl !leading-[1.1] md:text-[2.6rem]">{about.mission}</p>
        </Reveal>
        <Reveal delay={0.1} className="rounded-xl3 bg-accent p-8 text-ink md:p-12">
          <p className="eyebrow text-ink/60">Vision</p>
          <p className="display mt-8 text-4xl !leading-[1.02] md:text-6xl">{about.vision}</p>
        </Reveal>
      </section>

      <section className="container-x py-12 md:py-20">
        <p className="eyebrow mb-10 border-t border-ink/15 pt-3 text-muted">(Story) How it started</p>
        <ScrollText text={about.story} className="display max-w-5xl text-[clamp(1.7rem,3.6vw,3.2rem)] !leading-[1.12] !tracking-[-0.03em]" />
      </section>

      <section className="container-x py-24 md:py-32">
        <SectionHeading eyebrow="What we stand for" title="Four promises" accent="we keep." />
        <div className="mt-14 grid gap-px overflow-hidden rounded-xl3 bg-line ring-1 ring-line sm:grid-cols-2 lg:grid-cols-4">
          {about.values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.07} className="group flex min-h-72 flex-col justify-between bg-card p-7 transition-colors duration-500 hover:bg-night hover:text-paper">
              <span className="display text-5xl text-accent-ink group-hover:text-accent">0{i + 1}</span>
              <div>
                <h3 className="display text-2xl">{v.title}</h3>
                <p className="mt-3 leading-relaxed text-muted transition-colors group-hover:text-paper/60">{v.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Stats stats={stats} />

      <section className="container-x py-24 md:py-32">
        <SectionHeading eyebrow="Our journey" title="Fifteen years," accent="one room at a time." className="mb-16 md:mb-24" />
        <Timeline items={about.milestones} />
      </section>

      <section className="container-x py-24 md:py-32">
        <SectionHeading eyebrow="The people" title="Meet the team" accent="behind the work." text="640 people across 14 states. Here are a few of the faces you'll meet." />
        {groups.map((g) => {
          const members = sorted.filter((t) => t.group === g.key);
          if (!members.length) return null;
          return (
            <div key={g.key} className="mt-16">
              <p className="eyebrow mb-8 border-b border-line pb-4 text-muted">{g.label}</p>
              <TeamGrid team={members} />
            </div>
          );
        })}
      </section>

      <CTA donateLabel={settings.donateLabel} />
    </>
  );
}
