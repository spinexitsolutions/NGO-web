import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";

type Variant = "accent" | "ink" | "ghost" | "light" | "outline-light";

const styles: Record<Variant, string> = {
  accent: "bg-accent text-white",
  ink: "bg-ink text-paper",
  ghost: "bg-transparent text-ink ring-1 ring-inset ring-ink/15",
  light: "bg-paper text-ink",
  "outline-light": "bg-transparent text-paper ring-1 ring-inset ring-paper/25",
};
const fill: Record<Variant, string> = {
  accent: "bg-ink",
  ink: "bg-accent",
  ghost: "bg-ink",
  light: "bg-accent",
  "outline-light": "bg-paper",
};
const hoverText: Record<Variant, string> = {
  accent: "group-hover:text-paper",
  ink: "group-hover:text-white",
  ghost: "group-hover:text-paper",
  light: "group-hover:text-white",
  "outline-light": "group-hover:text-ink",
};

/** Pill button with a liquid fill on hover and a rolling arrow */
export default function Button({
  href,
  children,
  variant = "accent",
  className,
  arrow = true,
  type = "button",
  onClick,
  disabled,
  external,
}: {
  href?: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  arrow?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  external?: boolean;
}) {
  const inner = (
    <>
      <span className={cn("absolute inset-0 origin-bottom scale-y-0 rounded-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100", fill[variant])} />
      <span className={cn("relative transition-colors duration-500", hoverText[variant])}>{children}</span>
      {arrow && (
        <span className={cn("relative grid size-7 place-items-center overflow-hidden rounded-full bg-white/15 transition-colors duration-500", variant === "ghost" && "bg-ink/5", hoverText[variant])}>
          <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:-translate-y-6 group-hover:translate-x-6" />
          <ArrowUpRight className="absolute size-4 -translate-x-6 translate-y-6 transition-transform duration-500 group-hover:translate-x-0 group-hover:translate-y-0" />
        </span>
      )}
    </>
  );
  const cls = cn(
    "group relative inline-flex h-12 items-center justify-center gap-3 overflow-hidden rounded-full pl-6 text-[0.95rem] font-semibold tracking-[-0.01em] transition-[opacity,transform] active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50",
    arrow ? "pr-2.5" : "pr-6",
    styles[variant],
    className,
  );
  if (href) {
    return external ? (
      <a href={href} className={cls} target="_blank" rel="noreferrer">
        {inner}
      </a>
    ) : (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    );
  }
  return (
    <button type={type} className={cls} onClick={onClick} disabled={disabled}>
      {inner}
    </button>
  );
}
