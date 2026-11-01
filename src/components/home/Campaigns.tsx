import type { Campaign } from "@/lib/types";
import Button from "@/components/ui/Button";
import CampaignCard from "@/components/site/CampaignCard";
import SectionHeading from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/motion";

export default function Campaigns({ campaigns }: { campaigns: Campaign[] }) {
  const active = campaigns.filter((c) => c.status === "active");
  const [first, ...rest] = active;
  if (!first) return null;
  return (
    <section className="container-x py-24 md:py-36">
      <SectionHeading eyebrow="Live campaigns" title="Where help is" accent="needed now.">
        <Button href="/campaigns" variant="ghost">All campaigns</Button>
      </SectionHeading>
      <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <Reveal className="md:col-span-2 lg:col-span-3">
          <CampaignCard c={first} large />
        </Reveal>
        {rest.slice(0, 3).map((c, i) => (
          <Reveal key={c.id} delay={i * 0.08}>
            <CampaignCard c={c} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
