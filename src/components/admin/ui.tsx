"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Loader2, X, XCircle } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import clsx from "clsx";

/* ───────────── Toasts ───────────── */
type Toast = { id: number; kind: "success" | "error"; text: string };
const ToastCtx = createContext<(text: string, kind?: Toast["kind"]) => void>(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((text: string, kind: Toast["kind"] = "success") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, kind, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4 md:bottom-6 md:items-end md:pr-6">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
              className="pointer-events-auto flex items-center gap-2.5 rounded-2xl bg-ink px-4 py-3 text-sm text-white shadow-2xl shadow-black/20"
            >
              {t.kind === "success" ? <CheckCircle2 className="size-4 text-emerald-400" /> : <XCircle className="size-4 text-red-400" />}
              {t.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
}

/* ───────────── Buttons ───────────── */
type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "accent";
  size?: "sm" | "md";
  loading?: boolean;
};
export function Button({ variant = "secondary", size = "md", loading, className, children, disabled, ...rest }: BtnProps) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={clsx(
        "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full font-medium transition-all duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50",
        size === "sm" ? "h-8 px-3 text-[13px]" : "h-10 px-4 text-sm",
        variant === "primary" && "bg-ink text-white hover:bg-ink-2",
        variant === "accent" && "bg-accent text-white hover:brightness-110",
        variant === "secondary" && "border border-line bg-white text-ink hover:border-ink/25 hover:bg-paper/60",
        variant === "ghost" && "text-muted hover:bg-ink/5 hover:text-ink",
        variant === "danger" && "bg-red-600 text-white hover:bg-red-700",
        className
      )}
    >
      {loading && <Loader2 className="size-4 animate-spin" />}
      {children}
    </button>
  );
}

/* ───────────── Layout bits ───────────── */
export function PageHeader({ title, description, actions, eyebrow }: { title: string; description?: string; actions?: React.ReactNode; eyebrow?: string }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && <div className="eyebrow mb-2 text-muted">{eyebrow}</div>}
        <h1 className="text-[28px] font-semibold tracking-[-0.03em] md:text-[34px]">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-[15px] text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ className, children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...rest} className={clsx("rounded-3xl border border-line bg-card shadow-[0_1px_2px_rgb(0_0_0/0.03)]", className)}>
      {children}
    </div>
  );
}

const BADGE: Record<string, string> = {
  green: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  amber: "bg-amber-50 text-amber-700 ring-amber-600/20",
  red: "bg-red-50 text-red-700 ring-red-600/15",
  blue: "bg-blue-50 text-blue-700 ring-blue-600/15",
  gray: "bg-ink/[0.04] text-muted ring-ink/10",
  violet: "bg-violet-50 text-violet-700 ring-violet-600/15",
  accent: "bg-accent-soft text-accent ring-accent/20",
};
export const STATUS_TONE: Record<string, keyof typeof BADGE> = {
  published: "green", active: "green", completed: "green", onboarded: "green", replied: "green",
  draft: "gray", archived: "gray", inactive: "gray", unsubscribed: "gray",
  pending: "amber", contacted: "amber", read: "blue",
  failed: "red", refunded: "violet", new: "accent", unread: "accent",
  individual: "gray", corporate: "blue", monthly: "violet", "one-time": "gray",
};
export function Badge({ children, tone }: { children: React.ReactNode; tone?: keyof typeof BADGE }) {
  const t = tone ?? STATUS_TONE[String(children)] ?? "gray";
  return (
    <span className={clsx("inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11.5px] font-medium capitalize ring-1 ring-inset", BADGE[t])}>
      {children}
    </span>
  );
}

export function Avatar({ name, src, size = 36 }: { name: string; src?: string; size?: number }) {
  const ini = name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
  const hue = [...name].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 360, 7);
  if (src) return <img src={src} alt="" style={{ width: size, height: size }} className="shrink-0 rounded-full object-cover" />;
  return (
    <span
      style={{ width: size, height: size, background: `hsl(${hue} 70% 94%)`, color: `hsl(${hue} 55% 32%)`, fontSize: size * 0.36 }}
      className="inline-flex shrink-0 items-center justify-center rounded-full font-semibold"
    >
      {ini}
    </span>
  );
}

export function Empty({ title, text, action }: { title: string; text?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 size-12 rounded-2xl bg-paper" />
      <div className="font-medium">{title}</div>
      {text && <p className="mt-1 max-w-sm text-sm text-muted">{text}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Segmented<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { value: T; label: React.ReactNode }[] }) {
  return (
    <div className="inline-flex rounded-full border border-line bg-white p-1">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={clsx("relative rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors", value === o.value ? "text-white" : "text-muted hover:text-ink")}
        >
          {value === o.value && <motion.span layoutId={`seg-${options.map((x) => x.value).join("")}`} className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 500, damping: 38 }} />}
          <span className="relative flex items-center gap-1.5">{o.label}</span>
        </button>
      ))}
    </div>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={clsx("relative inline-flex h-[26px] w-[44px] shrink-0 items-center rounded-full transition-colors duration-300", checked ? "bg-emerald-500" : "bg-ink/15")}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 600, damping: 35 }}
        className={clsx("size-[22px] rounded-full bg-white shadow-md", checked ? "ml-[20px]" : "ml-[2px]")}
      />
    </button>
  );
}

/* ───────────── Slide-over panel ───────────── */
export function SlideOver({ open, onClose, title, subtitle, children, footer, wide }: { open: boolean; onClose: () => void; title: string; subtitle?: string; children: React.ReactNode; footer?: React.ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60]">
          <motion.div className="absolute inset-0 bg-ink/30 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 40 }}
            className={clsx("absolute inset-y-0 right-0 flex w-full flex-col bg-paper shadow-2xl md:inset-y-2 md:right-2 md:rounded-[28px]", wide ? "md:max-w-3xl" : "md:max-w-xl")}
          >
            <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 md:px-7 md:py-5">
              <div className="min-w-0">
                <h2 className="truncate text-lg font-semibold tracking-tight">{title}</h2>
                {subtitle && <p className="mt-0.5 truncate text-sm text-muted">{subtitle}</p>}
              </div>
              <button onClick={onClose} className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-muted ring-1 ring-line transition hover:text-ink" aria-label="Close">
                <X className="size-4" />
              </button>
            </header>
            <div className="flex-1 overflow-y-auto px-5 py-5 md:px-7" data-lenis-prevent>
              {children}
            </div>
            {footer && <footer className="flex items-center justify-between gap-2 border-t border-line bg-white/70 px-5 py-3.5 md:rounded-b-[28px] md:px-7">{footer}</footer>}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ───────────── Confirm dialog ───────────── */
export function useConfirm() {
  const [state, setState] = useState<{ text: string; resolve: (v: boolean) => void } | null>(null);
  const confirm = useCallback((text: string) => new Promise<boolean>((resolve) => setState({ text, resolve })), []);
  const close = (v: boolean) => {
    state?.resolve(v);
    setState(null);
  };
  const dialog = (
    <AnimatePresence>
      {state && (
        <div className="fixed inset-0 z-[80] grid place-items-center p-4">
          <motion.div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => close(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-4 grid size-11 place-items-center rounded-2xl bg-red-50 text-red-600">
              <AlertTriangle className="size-5" />
            </div>
            <div className="font-semibold">Are you sure?</div>
            <p className="mt-1 text-sm text-muted">{state.text}</p>
            <div className="mt-6 flex justify-end gap-2">
              <Button onClick={() => close(false)}>Cancel</Button>
              <Button variant="danger" onClick={() => close(true)} autoFocus>
                Confirm
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
  return { confirm, dialog };
}

export function SearchInput({ value, onChange, placeholder = "Search…" }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="relative w-full md:w-72">
      <svg className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="h-10 w-full rounded-full border border-line bg-white pl-10 pr-4 text-sm outline-none transition focus:border-ink/40 focus:ring-4 focus:ring-ink/5" />
    </div>
  );
}

export function Select({ value, onChange, options, className }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; className?: string }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={clsx("h-10 appearance-none rounded-full border border-line bg-white bg-[length:14px] bg-[right_12px_center] bg-no-repeat pl-4 pr-9 text-sm outline-none transition focus:border-ink/40", className)}
      style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236f6c64' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")" }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
