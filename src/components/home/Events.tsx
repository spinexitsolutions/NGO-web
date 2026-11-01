import type { EventItem } from "@/lib/types";
import Button from "@/components/ui/Button";
import EventList from "@/components/site/EventList";
import SectionHeading from "@/components/site/SectionHeading";

export default function Events({ events }: { events: EventItem[] }) {
  const upcoming = events.filter((e) => new Date(e.date) >= new Date(new Date().toDateString())).sort((a, b) => a.date.localeCompare(b.date));
  if (!upcoming.length) return null;
  return (
    <section className="container-x py-24 md:py-36">
      <SectionHeading index="08" eyebrow="Upcoming" title="Show up" accent="in person.">
        <Button href="/events" variant="ghost">All events</Button>
      </SectionHeading>
      <div className="mt-14">
        <EventList events={upcoming.slice(0, 4)} />
      </div>
    </section>
  );
}
