"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// true once the app has hydrated in the browser — the very first page load is covered by the intro instead
let hydrated = false;

/** Page transition: an accent sheet sweeps up and away, content rises in under it. */
export default function Template({ children }: { children: React.ReactNode }) {
  const [skip] = useState(() => typeof window === "undefined" || !hydrated);
  useEffect(() => {
    hydrated = true;
  }, []);
  return (
    <>
      {!skip && (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-[70] origin-top bg-accent"
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-[69] origin-top bg-night"
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
          />
        </>
      )}
      <motion.div
        initial={skip ? false : { opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: skip ? 0 : 0.35 }}
      >
        {children}
      </motion.div>
    </>
  );
}
