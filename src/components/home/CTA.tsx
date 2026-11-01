import Button from "@/components/ui/Button";
import { SplitWords, Reveal } from "@/components/site/motion";

export default function CTA({ donateLabel }: { donateLabel: string }) {
  const ring = "Donate · Volunteer · Partner · Share · ";
  return (
    <section className="container-x pb-24 md:pb-32">
      <div className="grain relative overflow-hidden rounded-xl3 bg-accent px-6 py-20 text-white md:px-16 md:py-28">
        <div className="pointer-events-none absolute -bottom-40 -left-40 size-[30rem] rounded-full bg-white/15 blur-3xl" />
        <div className="relative grid items-center gap-12 lg:grid-cols-[1fr_auto]">
          <div>
            <h2 className="display text-[clamp(3rem,10vw,9rem)]">
              <SplitWords text="Be someone's" /> <SplitWords text="ummeed." wordClassName="serif-accent" delay={0.2} />
            </h2>
            <Reveal delay={0.2} className="mt-8 max-w-xl text-lg text-white/85">
              ₹1,500 a month keeps a child in a learning centre for a whole year. Cancel anytime. 80G receipt instantly.
            </Reveal>
            <Reveal delay={0.3} className="mt-10 flex flex-wrap gap-3">
              <Button href="/donate?frequency=monthly" variant="light">Give monthly</Button>
              <Button href="/volunteer" variant="outline-light">{donateLabel === "Donate" ? "Volunteer instead" : "Volunteer"}</Button>
            </Reveal>
          </div>
          <div className="relative mx-auto hidden size-56 lg:block">
            <svg viewBox="0 0 200 200" className="size-full animate-spin-slow">
              <defs>
                <path id="ring" d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" />
              </defs>
              <text className="fill-white text-[15px] font-semibold uppercase tracking-[0.2em]">
                <textPath href="#ring">{ring}</textPath>
              </text>
            </svg>
            <span className="absolute inset-0 m-auto grid size-20 place-items-center rounded-full bg-white text-3xl text-accent">♥</span>
          </div>
        </div>
      </div>
    </section>
  );
}
