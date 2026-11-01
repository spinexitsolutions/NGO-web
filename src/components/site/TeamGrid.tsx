import type { TeamMember } from "@/lib/types";
import SmartImage from "@/components/ui/SmartImage";
import { Reveal } from "./motion";

export default function TeamGrid({ team }: { team: TeamMember[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 md:gap-x-6">
      {team.map((t, i) => (
        <Reveal key={t.id} delay={(i % 4) * 0.06} className="group">
          <div className="relative aspect-[3/4] overflow-hidden rounded-xl2 bg-paper-2">
            <SmartImage src={t.image} alt={t.name} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover grayscale transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 group-hover:grayscale-0" />
            <div className="absolute inset-x-3 bottom-3 translate-y-4 rounded-2xl bg-white/85 p-3 text-xs leading-snug text-ink opacity-0 backdrop-blur transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 max-md:hidden">
              {t.bio}
            </div>
          </div>
          <p className="mt-4 text-lg font-semibold tracking-[-0.02em]">{t.name}</p>
          <p className="text-sm text-muted">{t.role}</p>
        </Reveal>
      ))}
    </div>
  );
}
