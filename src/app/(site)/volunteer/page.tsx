import type { Metadata } from "next";
import { getDb } from "@/lib/db";
import PageHeader from "@/components/site/PageHeader";
import VolunteerForm from "@/components/site/VolunteerForm";
import SectionHeading from "@/components/site/SectionHeading";
import Faq from "@/components/site/Faq";
import { Reveal } from "@/components/site/motion";

export const metadata: Metadata = { title: "Volunteer" };

const ROLES = [
  { t: "Teach", d: "Weekend reading circles, maths clubs and spoken English at our learning centres.", n: "01" },
  { t: "Heal", d: "Doctors, nurses and pharmacists for monthly health camps in rural districts.", n: "02" },
  { t: "Cook & serve", d: "Pack ration kits and serve meals during our seasonal food drives.", n: "03" },
  { t: "Build skills", d: "Designers, developers, writers and analysts — volunteer remotely, on your schedule.", n: "04" },
];

export default async function VolunteerPage() {
  const db = await getDb();
  const onboarded = db.volunteers.filter((v) => v.status === "onboarded").length;
  return (
    <>
      <PageHeader
        eyebrow="Volunteer"
        title="Give a weekend."
        accent="Change a life."
        text="4,800 volunteers gave 1.2 lakh hours last year. No experience needed — just turn up, and we'll take care of the rest."
        image="https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=2000&q=80"
      />
      <section className="container-x py-24 md:py-32">
        <SectionHeading eyebrow="Ways to help" title="Find your" accent="role." />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ROLES.map((r, i) => (
            <Reveal key={r.t} delay={i * 0.07} className="group flex min-h-64 flex-col justify-between rounded-xl3 bg-card p-7 ring-1 ring-ink/5 transition-all duration-500 hover:-translate-y-1 hover:bg-accent hover:text-white">
              <span className="text-sm tabular-nums text-muted group-hover:text-white/70">{r.n}</span>
              <div>
                <h3 className="display text-4xl">{r.t}</h3>
                <p className="mt-3 leading-relaxed text-muted group-hover:text-white/85">{r.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="container-x grid gap-12 pb-24 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <div>
          <SectionHeading eyebrow="Sign up" title="Raise your" accent="hand." />
          <p className="mt-8 max-w-md text-lg leading-relaxed text-muted">
            Tell us a little about yourself and what you enjoy. {onboarded > 0 && <>We onboarded {onboarded} new volunteers this season alone.</>}
          </p>
        </div>
        <Reveal><VolunteerForm /></Reveal>
      </section>
      <section className="container-x pb-28">
        <Faq items={db.faqs.filter((f) => /volunteer/i.test(f.category))} />
      </section>
    </>
  );
}
