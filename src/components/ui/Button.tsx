import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

type Variant = "accent" | "ink" | "ghost" | "light" | "outline-light";

const styles: Record<Variant, string> = {
  accent: "bg-accent text-ink",
  ink: "bg-ink text-paper",
  ghost: "bg-transparent text-ink ring-1 ring-inset ring-ink/20 hover:ring-ink",
  light: "bg-paper text-ink",
  "outline-light": "bg-transparent text-paper ring-1 ring-inset ring-paper/30 hover:ring-paper",
};
const chip: Record<Variant, string> = {
  accent: "bg-ink text-accent",
  ink: "bg-accent text-ink",
  ghost: "bg-ink text-paper",
  light: "bg-ink text-accent",
  "outline-light": "bg-accent text-ink",
};

/**
 * Rectangular button: label rolls to a copy of itself, the arrow tile slides
 * through and the whole thing compresses slightly on press.
 */
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
  const label = (
    <span className="relative inline-flex h-6 overflow-hidden">
      <span className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:-translate-y-1/2">
        <span className="leading-6">{children}</span>
        <span className="leading-6" aria-hidden>{children}</span>
      </span>
    </span>
  );
  const inner = (
    <>
      {label}
      {arrow && (
        <span className={cn("relative grid size-8 place-items-center overflow-hidden rounded-[0.5rem]", chip[variant])}>
          <ArrowRight className="size-4 transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:translate-x-8" />
          <ArrowRight className="absolute size-4 -translate-x-8 transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:translate-x-0" />
        </span>
      )}
    </>
  );
  const cls = cn(
    "group relative inline-flex h-[3.25rem] items-center justify-between gap-5 rounded-[0.75rem] pl-5 text-[0.95rem] font-semibold tracking-[-0.01em] transition-[transform,box-shadow,background-color] duration-300 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50",
    arrow ? "pr-2.5" : "pr-5",
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
