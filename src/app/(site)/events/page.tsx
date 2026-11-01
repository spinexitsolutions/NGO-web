import type { Metadata } from "next";
import { getDb } from "@/lib/db";
import PageHeader from "@/components/site/PageHeader";
import EventList from "@/components/site/EventList";

export const metadata: Metadata = { title: "Events" };

export default async function EventsPage() {
  const { events } = await getDb();
  const today = new Date(new Date().toDateString());
  const pub = events.filter((e) => e.status === "published");
  const upcoming = pub.filter((e) => new Date(e.date) >= today).sort((a, b) => a.date.localeCompare(b.date));
  const past = pub.filter((e) => new Date(e.date) < today).sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <PageHeader eyebrow="Events" title="Come say" accent="hello." text="Runs, drives, galas and planting days. The best way to understand our work is to spend a day inside it." />
      <section className="container-x py-16 md:py-24">
        <p className="eyebrow mb-6 text-muted">Upcoming · {upcoming.length}</p>
        {upcoming.length ? <EventList events={upcoming} /> : <p className="py-10 text-muted">New events are announced every month — subscribe below to hear first.</p>}
        {past.length > 0 && (
          <div className="mt-24 opacity-70">
            <p className="eyebrow mb-6 text-muted">Past events</p>
            <EventList events={past} />
          </div>
        )}
      </section>
    </>
  );
}
