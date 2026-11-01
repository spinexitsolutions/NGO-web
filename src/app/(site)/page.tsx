import { getDb } from "@/lib/db";
import Hero from "@/components/home/Hero";
import Manifesto from "@/components/home/Manifesto";
import Stats from "@/components/home/Stats";
import Programs from "@/components/home/Programs";
import Campaigns from "@/components/home/Campaigns";
import ImpactCalc from "@/components/home/ImpactCalc";
import Stories from "@/components/home/Stories";
import Testimonials from "@/components/home/Testimonials";
import Events from "@/components/home/Events";
import GalleryStrip from "@/components/home/GalleryStrip";
import Partners from "@/components/home/Partners";
import CTA from "@/components/home/CTA";
import type { HomeSection } from "@/lib/types";

export default async function Home() {
  const db = await getDb();
  const published = <T extends { status: string }>(l: T[]) => l.filter((x) => x.status === "published");
  const yearAgo = Date.now() - 365 * 86400000;
  const donorsThisYear = new Set(db.donations.filter((d) => new Date(d.createdAt).getTime() > yearAgo).map((d) => d.donorId)).size;
  const donorCount = Math.max(donorsThisYear, db.campaigns.reduce((s, c) => s + c.donors, 0));

  const render: Record<HomeSection["id"], () => React.ReactNode> = {
    hero: () => <Hero hero={db.hero} stat={db.stats[0]} donors={donorCount} campaign={db.campaigns.filter((c) => c.status === "active").sort((a, b) => Number(b.urgent) - Number(a.urgent))[0]} />,
    manifesto: () => <Manifesto text={db.hero.manifesto} image={db.team[0]?.image} />,
    stats: () => <Stats stats={db.stats} />,
    programs: () => <Programs programs={published(db.programs).filter((p) => p.featured)} />,
    campaigns: () => <Campaigns campaigns={db.campaigns} />,
    impact: () => <ImpactCalc allocation={db.allocation} />,
    stories: () => <Stories posts={published(db.posts)} />,
    testimonials: () => <Testimonials items={db.testimonials} />,
    events: () => <Events events={published(db.events)} />,
    gallery: () => <GalleryStrip items={db.gallery} />,
    partners: () => <Partners partners={db.partners} />,
    cta: () => <CTA donateLabel={db.settings.donateLabel} />,
  };

  return (
    <>
      {db.sections
        .filter((s) => s.visible && render[s.id])
        .map((s) => (
          <div key={s.id} id={s.id}>
            {render[s.id]()}
          </div>
        ))}
    </>
  );
}
