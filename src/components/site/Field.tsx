import { cn } from "@/lib/cn";

export function Label({ children, htmlFor, optional }: { children: React.ReactNode; htmlFor?: string; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 flex items-center justify-between text-sm font-medium">
      {children}
      {optional && <span className="text-xs font-normal text-muted">Optional</span>}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string; optional?: boolean }) {
  const { label, optional, className, id, ...rest } = props;
  const fid = id || rest.name;
  return (
    <div className={className}>
      <Label htmlFor={fid} optional={optional}>{label}</Label>
      <input id={fid} className="field" {...rest} />
    </div>
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; optional?: boolean }) {
  const { label, optional, className, id, ...rest } = props;
  const fid = id || rest.name;
  return (
    <div className={className}>
      <Label htmlFor={fid} optional={optional}>{label}</Label>
      <textarea id={fid} rows={5} className={cn("field resize-none")} {...rest} />
    </div>
  );
}

export function Chip({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn("rounded-full px-4 py-2.5 text-sm font-medium ring-1 transition-all active:scale-95", active ? "bg-ink text-paper ring-ink" : "bg-white ring-ink/10 hover:ring-ink/40")}
    >
      {children}
    </button>
  );
}
