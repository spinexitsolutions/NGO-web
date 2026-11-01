import { cn } from "@/lib/cn";
import { Reveal, SplitWords } from "./motion";

export default function SectionHeading({
  eyebrow,
  title,
  accent,
  text,
  className,
  dark,
  align = "left",
  children,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  text?: string;
  className?: string;
  dark?: boolean;
  align?: "left" | "center";
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-6 md:flex-row md:items-end md:justify-between", align === "center" && "items-center text-center md:flex-col md:items-center", className)}>
      <div className={cn("max-w-3xl", align === "center" && "mx-auto")}>
        <Reveal>
          <p className={cn("eyebrow mb-5 flex items-center gap-2", dark ? "text-paper/50" : "text-muted", align === "center" && "justify-center")}>
            <span className="size-1.5 rounded-full bg-accent" />
            {eyebrow}
          </p>
        </Reveal>
        <h2 className={cn("display text-[clamp(2.4rem,6.5vw,5.2rem)]", dark && "text-paper")}>
          <SplitWords text={title} />
          {accent && (
            <>
              {" "}
              <SplitWords text={accent} wordClassName="serif-accent text-accent" delay={0.15} />
            </>
          )}
        </h2>
      </div>
      {(text || children) && (
        <Reveal delay={0.15} className={cn("max-w-md", align === "center" && "mx-auto")}>
          {text && <p className={cn("text-[1.05rem] leading-relaxed", dark ? "text-paper/60" : "text-muted")}>{text}</p>}
          {children}
        </Reveal>
      )}
    </div>
  );
}
