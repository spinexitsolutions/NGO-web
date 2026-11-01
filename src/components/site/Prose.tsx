/** Renders the CMS's lightweight text format: blank-line paragraphs, "## " headings, "> " quotes. */
export default function Prose({ text, className = "" }: { text: string; className?: string }) {
  const blocks = text.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className={`space-y-6 text-[1.1rem] leading-[1.75] text-ink/80 md:text-[1.18rem] ${className}`}>
      {blocks.map((b, i) => {
        if (b.startsWith("## ")) return <h2 key={i} className="display pt-6 text-3xl text-ink md:text-4xl">{b.slice(3)}</h2>;
        if (b.startsWith("> "))
          return (
            <blockquote key={i} className="serif-accent border-l-2 border-accent py-2 pl-6 text-3xl !leading-tight text-ink md:text-4xl">
              {b.replace(/^> ?/gm, "")}
            </blockquote>
          );
        return <p key={i}>{b}</p>;
      })}
    </div>
  );
}
