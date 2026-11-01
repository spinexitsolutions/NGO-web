"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Building2, Check, CreditCard, Loader2, Lock, ShieldCheck, Smartphone } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { SiteSettings } from "@/lib/types";
import { inr, pct } from "@/lib/format";
import { cn } from "@/lib/cn";
import SmartImage from "@/components/ui/SmartImage";
import Button from "@/components/ui/Button";
import { Input } from "./Field";
import { Mark, SplitWords } from "./motion";
import { useSubmit } from "./useSubmit";

type C = { id: string; title: string; image: string; raised: number; goal: number };
type Freq = "one-time" | "monthly";
type Method = "UPI" | "Card" | "NetBanking";

const PRESETS: Record<Freq, number[]> = { "one-time": [1000, 2500, 5000, 10000, 25000, 50000], monthly: [500, 1000, 1500, 2500, 5000, 10000] };
const EASE = [0.22, 1, 0.36, 1] as const;

function impactLine(a: number) {
  if (a >= 25000) return `funds a full classroom roof repair`;
  if (a >= 10000) return `keeps ${Math.floor(a / 1500)} children in a learning centre for a month`;
  if (a >= 2500) return `serves ${Math.floor(a / 40)} hot, nutritious meals`;
  if (a >= 1000) return `gives ${Math.floor(a / 150)} people a health check-up`;
  return `plants and cares for ${Math.max(1, Math.floor(a / 60))} native saplings`;
}

export default function DonateFlow({
  campaigns,
  initialCampaign,
  initialAmount,
  initialFrequency,
  legal,
}: {
  campaigns: C[];
  initialCampaign: string;
  initialAmount: number;
  initialFrequency: Freq;
  legal: SiteSettings["legal"];
}) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [freq, setFreq] = useState<Freq>(initialFrequency);
  const [amount, setAmount] = useState(initialAmount);
  const [custom, setCustom] = useState(PRESETS[initialFrequency].includes(initialAmount) ? "" : String(initialAmount));
  const [campaignId, setCampaignId] = useState(initialCampaign);
  const [details, setDetails] = useState({ name: "", email: "", phone: "", pan: "", city: "" });
  const [method, setMethod] = useState<Method>("UPI");
  const [formErr, setFormErr] = useState("");
  const { state, error, data, submit } = useSubmit("/api/public/donate");
  const campaign = campaigns.find((c) => c.id === campaignId);

  const go = (n: number) => {
    setDir(n > step ? 1 : -1);
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const valid1 = amount >= 100;
  const valid2 = details.name.trim().length > 1 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(details.email);

  async function pay() {
    await new Promise((r) => setTimeout(r, 1400)); // simulated gateway
    const res = await submit({ ...details, amount, frequency: freq, method, campaignId });
    if (res) go(3);
  }

  const steps = ["Amount", "Details", "Payment"];
  const taxSaving = useMemo(() => Math.round(amount * (freq === "monthly" ? 12 : 1) * 0.5 * 0.3), [amount, freq]);

  return (
    <section className="container-x pb-24 pt-32 md:pt-40">
      <div className="grid gap-10 lg:grid-cols-[1fr_26rem] lg:gap-16">
        <div>
          {step < 3 && (
            <>
              <p className="eyebrow mb-6 border-t border-ink/15 pt-3 text-muted">(Give) Donate — 80G tax benefit</p>
              <h1 className="display text-[clamp(2.8rem,8vw,6.5rem)]">
                <SplitWords text="Give a little," /> <Mark delay={0.6}><SplitWords text="change a lot." delay={0.2} /></Mark>
              </h1>

              {/* stepper */}
              <ol className="mt-10 flex items-center gap-2">
                {steps.map((s, i) => (
                  <li key={s} className="flex flex-1 items-center gap-2">
                    <button
                      type="button"
                      disabled={i > step}
                      onClick={() => i < step && go(i)}
                      className={cn("flex items-center gap-2 text-sm font-medium transition-colors", i <= step ? "text-ink" : "text-muted")}
                    >
                      <span className={cn("grid size-7 place-items-center rounded-full text-xs transition-colors", i < step ? "bg-ink text-paper" : i === step ? "bg-accent text-ink" : "bg-ink/5")}>
                        {i < step ? <Check className="size-3.5" /> : i + 1}
                      </span>
                      <span className="hidden sm:inline">{s}</span>
                    </button>
                    {i < steps.length - 1 && (
                      <span className="relative h-px flex-1 bg-ink/10">
                        <motion.span className="absolute inset-y-0 left-0 bg-ink" animate={{ width: i < step ? "100%" : "0%" }} transition={{ duration: 0.6, ease: EASE }} />
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </>
          )}

          <div className="relative mt-10">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={step}
                custom={dir}
                initial={{ opacity: 0, x: dir * 40, filter: "blur(4px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: dir * -40, filter: "blur(4px)" }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                {step === 0 && (
                  <div className="space-y-10">
                    <div className="relative inline-flex rounded-xl bg-ink/5 p-1">
                      {(["one-time", "monthly"] as Freq[]).map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => {
                            setFreq(f);
                            if (!custom) setAmount(PRESETS[f][2]);
                          }}
                          className={cn("relative z-10 rounded-lg px-6 py-2.5 text-sm font-semibold transition-colors", freq === f ? "text-accent" : "text-ink/60")}
                        >
                          {freq === f && <motion.span layoutId="freq" className="absolute inset-0 -z-10 rounded-lg bg-ink" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                          {f === "one-time" ? "Give once" : "Monthly ♥"}
                        </button>
                      ))}
                    </div>

                    <div>
                      <p className="mb-4 text-sm font-medium">Choose an amount</p>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {PRESETS[freq].map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => {
                              setAmount(p);
                              setCustom("");
                            }}
                            className={cn(
                              "rounded-xl2 px-4 py-5 text-left ring-1 transition-all active:scale-[0.98]",
                              amount === p && !custom ? "bg-ink text-accent ring-ink" : "bg-white ring-ink/10 hover:ring-ink/40",
                            )}
                          >
                            <span className="display block text-2xl md:text-3xl">{inr(p)}</span>
                            <span className={cn("text-xs", amount === p && !custom ? "text-paper/60" : "text-muted")}>{freq === "monthly" ? "per month" : "one time"}</span>
                          </button>
                        ))}
                      </div>
                      <div className="mt-3 flex items-center rounded-2xl bg-white px-5 ring-1 ring-ink/10 focus-within:ring-ink">
                        <span className="display text-2xl text-muted">₹</span>
                        <input
                          inputMode="numeric"
                          placeholder="Other amount"
                          value={custom}
                          onChange={(e) => {
                            const v = e.target.value.replace(/[^0-9]/g, "").slice(0, 8);
                            setCustom(v);
                            setAmount(Number(v) || 0);
                          }}
                          className="w-full bg-transparent px-3 py-5 text-xl font-semibold outline-none placeholder:font-normal placeholder:text-ink/30"
                          aria-label="Custom amount"
                        />
                      </div>
                      <AnimatePresence mode="wait">
                        <motion.p key={impactLine(amount)} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 text-[0.95rem] text-muted">
                          {amount >= 100 ? (
                            <>✦ {inr(amount)} {impactLine(amount)}.</>
                          ) : (
                            <>Minimum donation is ₹100.</>
                          )}
                        </motion.p>
                      </AnimatePresence>
                    </div>

                    {campaigns.length > 0 && (
                      <div>
                        <p className="mb-4 text-sm font-medium">Where should it go?</p>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <CampaignOption active={!campaignId} onClick={() => setCampaignId("")} title="Where it's needed most" sub="General fund" />
                          {campaigns.map((c) => (
                            <CampaignOption key={c.id} active={campaignId === c.id} onClick={() => setCampaignId(c.id)} title={c.title} sub={`${pct(c.raised, c.goal)}% funded`} image={c.image} />
                          ))}
                        </div>
                      </div>
                    )}

                    <Button onClick={() => valid1 && go(1)} disabled={!valid1} className="w-full sm:w-auto">
                      Continue with {inr(amount || 0)}
                    </Button>
                  </div>
                )}

                {step === 1 && (
                  <form
                    className="space-y-5"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!valid2) return setFormErr("Please add your name and a valid email.");
                      setFormErr("");
                      go(2);
                    }}
                  >
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Input label="Full name" name="name" required autoComplete="name" value={details.name} onChange={(e) => setDetails({ ...details, name: e.target.value })} placeholder="As on your PAN" />
                      <Input label="Email" name="email" type="email" required autoComplete="email" value={details.email} onChange={(e) => setDetails({ ...details, email: e.target.value })} placeholder="Receipt goes here" />
                      <Input label="Phone" name="phone" optional autoComplete="tel" value={details.phone} onChange={(e) => setDetails({ ...details, phone: e.target.value })} placeholder="+91" />
                      <Input label="City" name="city" optional value={details.city} onChange={(e) => setDetails({ ...details, city: e.target.value })} />
                      <Input label="PAN (for 80G receipt)" name="pan" optional className="sm:col-span-2" value={details.pan} onChange={(e) => setDetails({ ...details, pan: e.target.value.toUpperCase().slice(0, 10) })} placeholder="ABCDE1234F" />
                    </div>
                    {formErr && <p className="text-sm text-red-600">{formErr}</p>}
                    <div className="flex flex-wrap gap-3 pt-4">
                      <button type="button" onClick={() => go(0)} className="flex h-12 items-center gap-2 rounded-xl px-5 text-sm font-semibold ring-1 ring-ink/15 hover:ring-ink">
                        <ArrowLeft className="size-4" /> Back
                      </button>
                      <Button type="submit">Continue to payment</Button>
                    </div>
                  </form>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div className="grid gap-3 sm:grid-cols-3">
                      {([
                        ["UPI", Smartphone, "GPay, PhonePe, Paytm"],
                        ["Card", CreditCard, "Visa, Mastercard, RuPay"],
                        ["NetBanking", Building2, "All major banks"],
                      ] as const).map(([m, Icon, sub]) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setMethod(m)}
                          className={cn("rounded-xl2 p-5 text-left ring-1 transition-all", method === m ? "bg-ink text-accent ring-ink" : "bg-white ring-ink/10 hover:ring-ink/40")}
                        >
                          <Icon className="size-6" />
                          <p className="mt-6 font-semibold">{m === "NetBanking" ? "Net banking" : m}</p>
                          <p className={cn("text-xs", method === m ? "text-paper/60" : "text-muted")}>{sub}</p>
                        </button>
                      ))}
                    </div>
                    <div className="rounded-2xl bg-white p-5 ring-1 ring-ink/10">
                      {method === "UPI" && <Input label="UPI ID" name="upi" placeholder="yourname@okbank" />}
                      {method === "Card" && (
                        <div className="grid gap-4 sm:grid-cols-[2fr_1fr_1fr]">
                          <Input label="Card number" name="card" placeholder="4111 1111 1111 1111" inputMode="numeric" />
                          <Input label="Expiry" name="exp" placeholder="MM/YY" />
                          <Input label="CVV" name="cvv" placeholder="•••" type="password" />
                        </div>
                      )}
                      {method === "NetBanking" && (
                        <div className="flex flex-wrap gap-2">
                          {["SBI", "HDFC", "ICICI", "Axis", "Kotak", "Other"].map((b) => (
                            <span key={b} className="rounded-full bg-paper px-4 py-2 text-sm">{b}</span>
                          ))}
                        </div>
                      )}
                      <p className="mt-4 flex items-center gap-2 text-xs text-muted"><Lock className="size-3.5" /> Demo checkout — no real payment is taken. Plug in Razorpay / Stripe in production.</p>
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <div className="flex flex-wrap gap-3">
                      <button type="button" onClick={() => go(1)} className="flex h-12 items-center gap-2 rounded-xl px-5 text-sm font-semibold ring-1 ring-ink/15 hover:ring-ink">
                        <ArrowLeft className="size-4" /> Back
                      </button>
                      <button
                        type="button"
                        onClick={pay}
                        disabled={state === "loading"}
                        className="relative flex h-12 min-w-56 items-center justify-center gap-2 overflow-hidden rounded-xl bg-accent px-6 font-semibold text-ink transition-transform active:scale-[0.98] disabled:opacity-90"
                      >
                        {state === "loading" ? (
                          <>
                            <Loader2 className="size-4 animate-spin" /> Processing securely…
                          </>
                        ) : (
                          <>
                            <Lock className="size-4" /> Pay {inr(amount)}
                            {freq === "monthly" && " / month"}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {step === 3 && <Success name={details.name} amount={amount} freq={freq} receipt={String(data?.receiptNo ?? "")} email={details.email} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* summary */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="dots-dark overflow-hidden rounded-xl3 bg-night text-paper">
            <div className="relative aspect-[16/10]">
              <SmartImage
                src={campaign?.image ?? "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80"}
                alt=""
                fill
                sizes="420px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-night to-transparent" />
              <p className="absolute bottom-4 left-6 right-6 text-sm text-paper/80">{campaign ? campaign.title : "Where it's needed most"}</p>
            </div>
            <div className="p-6 md:p-8">
              <p className="eyebrow text-paper/50">Your gift</p>
              <p className="display mt-3 text-6xl tabular-nums text-accent">{inr(amount || 0)}</p>
              <p className="text-paper/60">{freq === "monthly" ? "every month · cancel anytime" : "one-time donation"}</p>
              <div className="my-6 h-px bg-paper/10" />
              <ul className="space-y-3 text-sm text-paper/75">
                <li className="flex gap-3"><ShieldCheck className="size-5 shrink-0 text-accent" /> 50% tax exemption under 80G — est. saving {inr(taxSaving)}{freq === "monthly" ? "/yr" : ""}*</li>
                <li className="flex gap-3"><Check className="size-5 shrink-0 text-accent" /> Instant receipt by email</li>
                <li className="flex gap-3"><Check className="size-5 shrink-0 text-accent" /> 87% goes straight to the field</li>
              </ul>
              <p className="mt-6 text-[0.7rem] leading-relaxed text-paper/40">80G: {legal.reg80G} · PAN: {legal.pan} · FCRA: {legal.fcra}. *Indicative, at 30% slab.</p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function CampaignOption({ active, onClick, title, sub, image }: { active: boolean; onClick: () => void; title: string; sub: string; image?: string }) {
  return (
    <button type="button" onClick={onClick} className={cn("flex items-center gap-3 rounded-2xl p-3 text-left ring-1 transition-all", active ? "bg-accent-soft ring-ink" : "bg-white ring-ink/10 hover:ring-ink/40")}>
      <span className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-paper">
        {image ? <SmartImage src={image} alt="" fill sizes="48px" className="object-cover" /> : <span className="grid size-full place-items-center text-lg">♥</span>}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold">{title}</span>
        <span className="text-xs text-muted">{sub}</span>
      </span>
      <span className={cn("grid size-5 place-items-center rounded-full ring-1", active ? "bg-ink text-accent ring-ink" : "ring-ink/20")}>{active && <Check className="size-3" />}</span>
    </button>
  );
}

function Success({ name, amount, freq, receipt, email }: { name: string; amount: number; freq: Freq; receipt: string; email: string }) {
  return (
    <div className="py-6">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 18 }} className="grid size-24 place-items-center rounded-2xl bg-accent text-ink">
        <motion.svg viewBox="0 0 24 24" className="size-12" fill="none" stroke="currentColor" strokeWidth={2.5}>
          <motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.25 }} />
        </motion.svg>
      </motion.div>
      <h1 className="display mt-10 text-[clamp(2.8rem,8vw,6rem)]">
        <SplitWords text={`Thank you, ${name.split(" ")[0] || "friend"}.`} />
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
        Your {freq === "monthly" ? "monthly" : ""} gift of <b className="text-ink">{inr(amount)}</b> is on its way to the field. We&apos;ve emailed your 80G receipt to {email}.
      </p>
      <div className="mt-8 inline-flex items-center gap-4 rounded-2xl bg-white px-5 py-4 ring-1 ring-ink/10">
        <span className="text-sm text-muted">Receipt no.</span>
        <span className="font-mono text-sm font-semibold">{receipt}</span>
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button href="/stories" variant="ink">See what you made possible</Button>
        <Link href="/" className="flex h-12 items-center rounded-xl px-6 text-sm font-semibold ring-1 ring-ink/15 hover:ring-ink">Back home</Link>
      </div>
    </div>
  );
}
