import { cn } from "@/lib/cn";

/** Ummeed mark — two cupped hands holding a seed, inside a lime tile. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-8", className)} aria-hidden>
      <rect width="32" height="32" rx="9" className="fill-accent" />
      <path d="M8.5 13.5v3.2a7.5 7.5 0 0 0 15 0v-3.2" fill="none" strokeWidth="3.2" strokeLinecap="round" className="stroke-ink" />
      <circle cx="16" cy="11" r="2.6" className="fill-ink" />
    </svg>
  );
}

export default function Logo({ name, className, hideText }: { name: string; className?: string; hideText?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark />
      {!hideText && <span className="font-[family-name:var(--font-display)] text-[1.15rem] font-bold tracking-[-0.04em]">{name.toLowerCase()}</span>}
    </span>
  );
}
