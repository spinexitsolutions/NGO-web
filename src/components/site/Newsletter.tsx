"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";

export default function Newsletter({ dark = true }: { dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    const res = await fetch("/api/public/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
    if (res.ok) {
      setState("done");
      setEmail("");
    } else {
      setError(((await res.json().catch(() => ({}))) as { error?: string }).error || "Something went wrong");
      setState("error");
    }
  }

  return (
    <form onSubmit={submit} className="w-full">
      <div className={cn("flex items-center gap-2 rounded-full p-1.5 ring-1 transition-shadow focus-within:ring-2", dark ? "bg-paper/5 ring-paper/15 focus-within:ring-accent" : "bg-white ring-ink/10 focus-within:ring-ink")}>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state !== "loading") setState("idle");
          }}
          placeholder="your@email.com"
          aria-label="Email address"
          className={cn("min-w-0 flex-1 bg-transparent px-4 text-[0.95rem] outline-none", dark ? "text-paper placeholder:text-paper/35" : "placeholder:text-ink/35")}
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="grid size-11 shrink-0 place-items-center rounded-full bg-accent text-white transition-transform hover:scale-105 active:scale-95"
          aria-label="Subscribe"
        >
          {state === "loading" ? <Loader2 className="size-4 animate-spin" /> : state === "done" ? <Check className="size-4" /> : <ArrowRight className="size-4" />}
        </button>
      </div>
      <AnimatePresence>
        {(state === "done" || state === "error") && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={cn("mt-3 px-4 text-sm", state === "error" ? "text-accent" : dark ? "text-paper/60" : "text-muted")}>
            {state === "done" ? "You're in. One good story, every month — no spam." : error}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}
