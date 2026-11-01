"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { Post } from "@/lib/types";
import PostCard from "./PostCard";
import { Chip } from "./Field";

export default function StoriesGrid({ posts }: { posts: Post[] }) {
  const cats = ["All", ...Array.from(new Set(posts.map((p) => p.category)))];
  const [cat, setCat] = useState("All");
  const list = cat === "All" ? posts : posts.filter((p) => p.category === cat);
  const [lead, ...rest] = list;
  return (
    <section className="container-x py-16 md:py-24">
      <div className="no-scrollbar -mx-5 mb-12 flex gap-2 overflow-x-auto px-5">
        {cats.map((c) => (
          <Chip key={c} active={c === cat} onClick={() => setCat(c)}>{c}</Chip>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={cat} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
          {lead && (
            <div className="mb-16">
              <PostCard post={lead} large />
            </div>
          )}
          <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
          {!lead && <p className="py-20 text-center text-muted">No stories yet.</p>}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
