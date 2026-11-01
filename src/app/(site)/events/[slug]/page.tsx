import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarDays, Clock, MapPin, Users } from "lucide-react";
import { getDb } from "@/lib/db";
import { fmtDate } from "@/lib/format";
import PageHeader from "@/components/site/PageHeader";
import Prose from "@/components/site/Prose";
import RegisterForm from "@/components/site/RegisterForm";
import ShareButtons from "@/components/site/ShareButtons";
import { Progress, Reveal } from "@/components/site/motion";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const e = (await getDb()).events.find((x) => x.slug === slug);
  return e ? { title: e.title, description: e.summary } : {};
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const db = await getDb();
  const ev = db.events.find((x) => x.slug === slug && x.status === "published");
  if (!ev) notFound();
  const taken = db.registrations.filter((r) => r.eventId === ev.id).reduce((s, r) => s + r.seats, 0);
  const left = Math.max(0, ev.capacity - taken);
  const past = new Date(ev.date) < new Date(new Date().toDateString());

  return (
    <>
      <PageHeader eyebrow={past ? "Past event" : "Event"} title={ev.title} text={ev.summary} image={ev.image} />
      <section className="container-x grid gap-16 py-20 md:py-28 lg:grid-cols-[1fr_26rem]">
        <div>
          <div className="mb-12 grid gap-3 sm:grid-cols-3">
            {[
              [CalendarDays, fmtDate(ev.date, { weekday: "short", day: "numeric", month: "long", year: "numeric" })],
              [Clock, ev.time],
              [MapPin, ev.location],
            ].map(([Icon, text], i) => {
              const I = Icon as typeof Clock;
              return (
                <div key={i} className="rounded-2xl bg-card p-5 ring-1 ring-ink/5">
                  <I className="size-5 text-accent" />
                  <p className="mt-4 font-semibold">{text as string}</p>
                </div>
              );
            })}
          </div>
          <Reveal><Prose text={ev.description} /></Reveal>
          <div className="mt-12 overflow-hidden rounded-xl3 ring-1 ring-ink/5">
            <iframe
              title="Map"
              className="h-72 w-full grayscale"
              loading="lazy"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(ev.location)}&output=embed`}
            />
          </div>
          <div className="mt-10"><ShareButtons title={ev.title} /></div>
        </div>
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-xl3 bg-night p-7 text-paper md:p-8">
            <p className="eyebrow text-paper/50">{past ? "This event has ended" : "Register — it's free"}</p>
            <div className="mb-6 mt-6">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5"><Users className="size-4" /> {taken} going</span>
                <span className="text-paper/60">{left} spots left</span>
              </div>
              <Progress value={Math.round((taken / Math.max(1, ev.capacity)) * 100)} className="bg-paper/10" />
            </div>
            {!past && <RegisterForm eventId={ev.id} seatsLeft={left} />}
          </div>
        </aside>
      </section>
    </>
  );
}
