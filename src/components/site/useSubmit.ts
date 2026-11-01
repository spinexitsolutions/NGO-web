"use client";

import { useState } from "react";

export function useSubmit<T extends object>(url: string) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  async function submit(body: T) {
    setState("loading");
    setError("");
    try {
      const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
      if (!res.ok) throw new Error((json.error as string) || "Something went wrong");
      setData(json);
      setState("done");
      return json;
    } catch (e) {
      setError((e as Error).message);
      setState("error");
      return null;
    }
  }
  return { state, error, data, submit, reset: () => setState("idle") };
}
