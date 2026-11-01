import { cn } from "@/lib/cn";

/** Ummeed mark — a sun rising over the horizon, drawn as one gesture. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-8", className)} aria-hidden>
      <circle cx="16" cy="16" r="16" className="fill-ink" />
      <path d="M7 19.5a9 9 0 0 1 18 0Z" className="fill-accent" />
      <rect x="5" y="21.5" width="22" height="2" rx="1" className="fill-paper" />
      <circle cx="16" cy="8" r="1.6" className="fill-paper" />
    </svg>
  );
}

export default function Logo({ name, className, hideText }: { name: string; className?: string; hideText?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <LogoMark />
      {!hideText && <span className="text-[1.05rem] font-semibold tracking-[-0.03em]">{name}</span>}
    </span>
  );
}
