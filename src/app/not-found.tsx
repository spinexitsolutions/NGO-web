import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="container-x flex min-h-dvh flex-col items-start justify-center pt-24">
      <p className="eyebrow text-muted">Error 404</p>
      <h1 className="display mt-6 text-[clamp(4rem,16vw,13rem)]">
        Lost, <span className="serif-accent text-accent">not gone.</span>
      </h1>
      <p className="mt-6 max-w-md text-lg text-muted">This page wandered off. Let&apos;s get you back to somewhere hopeful.</p>
      <div className="mt-10 flex gap-3">
        <Button href="/">Go home</Button>
        <Button href="/donate" variant="ghost">Donate</Button>
      </div>
    </section>
  );
}
