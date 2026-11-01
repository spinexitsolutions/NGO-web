"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { Chip, Input, Label, Textarea } from "./Field";
import { useSubmit } from "./useSubmit";

const INTERESTS = ["Teaching", "Healthcare camps", "Food drives", "Tree plantation", "Fundraising", "Photography", "Tech & design", "Mentorship"];
const AVAIL = ["Weekends", "Weekdays (evening)", "2–4 hrs / week", "Full-time for a month", "Remote only"];

export default function VolunteerForm() {
  const [f, setF] = useState({ name: "", email: "", phone: "", city: "", availability: AVAIL[0], message: "" });
  const [interests, setInterests] = useState<string[]>([]);
  const { state, error, submit } = useSubmit("/api/public/volunteer");

  return (
    <AnimatePresence mode="wait">
      {state === "done" ? (
        <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl3 bg-card p-10 text-center ring-1 ring-ink/5">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-accent text-white"><Check className="size-7" /></span>
          <p className="display mt-6 text-4xl">Welcome aboard, {f.name.split(" ")[0]}!</p>
          <p className="mx-auto mt-3 max-w-md text-muted">Our volunteer team will call you within a week to find the right role for you.</p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          exit={{ opacity: 0, y: -20 }}
          onSubmit={(e) => {
            e.preventDefault();
            submit({ ...f, interests });
          }}
          className="space-y-6 rounded-xl3 bg-card p-6 ring-1 ring-ink/5 md:p-10"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Input label="Full name" name="name" required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
            <Input label="Email" name="email" type="email" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
            <Input label="Phone" name="phone" optional value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
            <Input label="City" name="city" optional value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} />
          </div>
          <div>
            <Label>I&apos;d love to help with</Label>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((i) => (
                <Chip key={i} active={interests.includes(i)} onClick={() => setInterests((x) => (x.includes(i) ? x.filter((y) => y !== i) : [...x, i]))}>
                  {i}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <Label>Availability</Label>
            <div className="flex flex-wrap gap-2">
              {AVAIL.map((a) => (
                <Chip key={a} active={f.availability === a} onClick={() => setF({ ...f, availability: a })}>{a}</Chip>
              ))}
            </div>
          </div>
          <Textarea label="Tell us a little about yourself" name="message" optional value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} placeholder="Your skills, experience, why Ummeed…" />
          {error && <p className="text-sm text-accent">{error}</p>}
          <button type="submit" disabled={state === "loading"} className="flex h-13 w-full items-center justify-center gap-2 rounded-full bg-ink py-4 font-semibold text-paper transition-colors hover:bg-accent sm:w-auto sm:px-10">
            {state === "loading" && <Loader2 className="size-4 animate-spin" />} Sign me up
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
