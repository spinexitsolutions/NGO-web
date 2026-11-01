"use client";

import { motion } from "framer-motion";
import { ArrowRight, Heart, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginForm({ name }: { name: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("admin@ummeed.org");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
    if (!res.ok) {
      setError((await res.json().catch(() => ({}))).error || "Login failed");
      setBusy(false);
      return;
    }
    const next = params.get("next");
    router.replace(next && next.startsWith("/admin") ? next : "/admin");
    router.refresh();
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="w-full max-w-sm">
      <div className="mb-10 flex items-center gap-2.5">
        <div className="grid size-10 place-items-center rounded-2xl bg-accent text-ink shadow-lg shadow-accent/30">
          <Heart className="size-5 fill-white" />
        </div>
        <div className="text-lg font-semibold tracking-tight">{name}</div>
      </div>
      <h1 className="text-[34px] font-semibold leading-tight tracking-[-0.04em]">
        Welcome <span className="serif-accent text-accent-ink">back.</span>
      </h1>
      <p className="mt-2 text-[15px] text-muted">Sign in to manage your website, donors and volunteers.</p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        <div>
          <label className="mb-1.5 block text-[13px] font-medium" htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="username" className="field" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="mb-1.5 block text-[13px] font-medium" htmlFor="password">Password</label>
          <input id="password" type="password" autoComplete="current-password" className="field" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required autoFocus />
        </div>
        {error && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </motion.p>
        )}
        <button disabled={busy} className="group flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink font-medium text-white transition hover:bg-ink-2 active:scale-[0.98] disabled:opacity-60">
          {busy ? <Loader2 className="size-4 animate-spin" /> : <>Sign in <ArrowRight className="size-4 transition group-hover:translate-x-0.5" /></>}
        </button>
      </form>

      <div className="mt-8 rounded-2xl border border-dashed border-ink/15 bg-white/60 p-4 text-[13px] text-muted">
        <div className="mb-1 font-medium text-ink">Demo credentials</div>
        admin@ummeed.org · <span className="font-mono">ummeed@2026</span>
      </div>
    </motion.div>
  );
}
