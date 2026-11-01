"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Play } from "lucide-react";
import { useEffect, useState } from "react";
import type { IntroSettings } from "@/lib/types";
import { Button, Card, PageHeader, Toggle } from "./ui";
import { Label, TagsInput } from "./fields";
import { SaveBar, useContentForm } from "./ContentForm";

function Preview({ intro, accent, run }: { intro: IntroSettings; accent: string; run: number }) {
  const [i, setI] = useState(0);
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);
  const words = intro.words.length ? intro.words : ["Hello"];

  useEffect(() => {
    setI(0);
    setPct(0);
    setDone(false);
    const start = performance.now();
    const dur = Math.max(800, intro.duration);
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setPct(Math.round(p * 100));
      setI(Math.min(words.length - 1, Math.floor(p * words.length)));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setDone(true), 250);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run, intro.duration, words.join("|")]);

  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-paper ring-1 ring-line">
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="text-2xl font-semibold tracking-tight">Your homepage</div>
          <div className="mt-1 text-sm text-muted">revealed after the intro</div>
        </div>
      </div>
      <AnimatePresence>
        {!done && (
          <motion.div exit={{ y: "-100%" }} transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }} className="absolute inset-0 flex flex-col justify-between bg-[#0b0b0a] p-5 text-white">
            <div className="flex justify-between text-[11px] text-white/50"><span>{intro.tagline}</span><span className="tabular-nums">{pct}%</span></div>
            <div className="grid place-items-center overflow-hidden py-3">
              <AnimatePresence mode="wait">
                <motion.div key={i} initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "-100%", opacity: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="text-5xl font-semibold tracking-[-0.04em] md:text-6xl">
                  {i === words.length - 1 ? <span className="serif-accent" style={{ color: accent }}>{words[i]}</span> : words[i]}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="h-[2px] overflow-hidden rounded-full bg-white/10"><div className="h-full" style={{ width: `${pct}%`, background: accent }} /></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function IntroEditor({ initial, accent }: { initial: IntroSettings; accent: string }) {
  const f = useContentForm("intro", initial as unknown as Record<string, unknown>);
  const intro = f.data as unknown as IntroSettings;
  const set = (patch: Partial<IntroSettings>) => f.setData({ ...f.data, ...patch });
  const [run, setRun] = useState(0);

  return (
    <>
      <PageHeader eyebrow="Site" title="Intro animation" description="The cinematic loader visitors see when they first open the site." actions={<Button variant="primary" disabled={!f.dirty} loading={f.saving} onClick={f.save}>Publish</Button>} />
      <div className="grid gap-4 pb-24 lg:grid-cols-[1fr_1.1fr]">
        <Card className="space-y-6 p-5 md:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="font-medium">Show intro</div>
              <p className="text-[13px] text-muted">Turn off to load the site instantly.</p>
            </div>
            <Toggle checked={intro.enabled} onChange={(v) => set({ enabled: v })} label="Show intro" />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="font-medium">Once per session</div>
              <p className="text-[13px] text-muted">Don&apos;t replay when navigating back to the homepage.</p>
            </div>
            <Toggle checked={intro.oncePerSession} onChange={(v) => set({ oncePerSession: v })} label="Once per session" />
          </div>
          <div>
            <Label help="Shown one after another. The last word is set in your accent colour.">Words</Label>
            <TagsInput value={intro.words} onChange={(v) => set({ words: v })} placeholder="Add a word…" />
          </div>
          <div>
            <div className="mb-1.5 flex justify-between"><Label>Duration</Label><span className="text-sm tabular-nums text-muted">{(intro.duration / 1000).toFixed(1)}s</span></div>
            <input type="range" min={1000} max={6000} step={100} value={intro.duration} onChange={(e) => set({ duration: Number(e.target.value) })} className="w-full accent-[var(--accent)]" />
          </div>
          <div>
            <Label>Tagline</Label>
            <input className="field" value={intro.tagline} onChange={(e) => set({ tagline: e.target.value })} />
          </div>
        </Card>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[13px] font-medium text-muted">Live preview</span>
            <Button size="sm" onClick={() => setRun((r) => r + 1)}><Play className="size-3.5" /> Replay</Button>
          </div>
          <div className={intro.enabled ? "" : "opacity-40 grayscale"}>
            <Preview intro={intro} accent={accent} run={run} />
          </div>
          {!intro.enabled && <p className="mt-2 text-center text-[13px] text-muted">Intro is turned off</p>}
        </div>
      </div>
      <SaveBar dirty={f.dirty} saving={f.saving} onSave={f.save} onReset={f.reset} />
    </>
  );
}
