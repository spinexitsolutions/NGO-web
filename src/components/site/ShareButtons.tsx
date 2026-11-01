"use client";

import { Check, Link2 } from "lucide-react";
import { useState } from "react";

export default function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const share = (base: string) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(title);
    window.open(base.replace("{url}", url).replace("{text}", text), "_blank", "noopener,width=600,height=500");
  };
  const btn = "rounded-full px-4 py-2 text-sm font-medium ring-1 ring-ink/10 transition-colors hover:bg-ink hover:text-paper";
  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" className={btn} onClick={() => share("https://wa.me/?text={text}%20{url}")}>WhatsApp</button>
      <button type="button" className={btn} onClick={() => share("https://twitter.com/intent/tweet?text={text}&url={url}")}>X</button>
      <button type="button" className={btn} onClick={() => share("https://www.linkedin.com/sharing/share-offsite/?url={url}")}>LinkedIn</button>
      <button
        type="button"
        className={`${btn} flex items-center gap-1.5`}
        onClick={async () => {
          await navigator.clipboard?.writeText(window.location.href);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        }}
      >
        {copied ? <Check className="size-4" /> : <Link2 className="size-4" />} {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
