import { cn } from "@/lib/cn";
import { Mark, Reveal, SplitWords } from "./motion";

/**
 * Editorial section header: mono index + label on a hairline rule,
 * a bold display title with one highlighted phrase, and an aside.
 */
export default function SectionHeading({
  eyebrow,
  title,
  accent,
  text,
  className,
  dark,
  align = "left",
  index,
  children,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  text?: string;
  className?: string;
  dark?: boolean;
  align?: "left" | "center";
  index?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      <Reveal>
        <div className={cn("mb-8 flex items-center gap-3 border-t pt-3 md:mb-12", dark ? "border-paper/15 text-paper/55" : "border-ink/15 text-muted", align === "center" && "justify-center")}>
          {index && <span className="eyebrow">({index})</span>}
          <span className="eyebrow">{eyebrow}</span>
          <span className={cn("ml-auto hidden h-px flex-1 md:block", align === "center" && "hidden")} />
        </div>
      </Reveal>
      <div className={cn("flex flex-col gap-8 md:flex-row md:items-end md:justify-between", align === "center" && "items-center md:flex-col md:items-center")}>
        <h2 className={cn("display max-w-4xl text-[clamp(2.5rem,6.8vw,5.6rem)]", dark && "text-paper")}>
          <SplitWords text={title} />
          {accent && (
            <>
              {" "}
              <Mark delay={0.45}>
                <SplitWords text={accent} delay={0.12} />
              </Mark>
            </>
          )}
        </h2>
        {(text || children) && (
          <Reveal delay={0.15} className={cn("max-w-sm shrink-0", align === "center" && "mx-auto")}>
            {text && <p className={cn("text-[1.02rem] leading-relaxed", dark ? "text-paper/65" : "text-muted")}>{text}</p>}
            {children && <div className={cn(text && "mt-6")}>{children}</div>}
          </Reveal>
        )}
      </div>
    </div>
  );
}
