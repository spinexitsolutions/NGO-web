import type { Partner } from "@/lib/types";

export default function Partners({ partners }: { partners: Partner[] }) {
  if (!partners.length) return null;
  const row = [...partners, ...partners];
  return (
    <section className="overflow-hidden py-20 md:py-28">
      <p className="eyebrow mb-10 text-center text-muted">Trusted by 40+ companies & foundations</p>
      <div className="relative [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        <div className="flex w-max animate-marquee items-center gap-14 hover:[animation-play-state:paused] md:gap-24">
          {row.map((p, i) => (
            <span key={`${p.id}-${i}`} className="flex items-center gap-14 whitespace-nowrap md:gap-24">
              <span className={i % 2 ? "serif-accent text-4xl text-ink/45 md:text-6xl" : "display text-3xl text-ink/45 md:text-5xl"}>{p.name}</span>
              <span className="size-2 rounded-full bg-accent" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
