"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// true once the app has hydrated in the browser — the very first page load is covered by the intro instead
let hydrated = false;
const SHUTTER = [0.76, 0, 0.24, 1] as const;
const COLS = 5;

/** Page transition: forest + lime shutters lift column by column, content rises underneath. */
export default function Template({ children }: { children: React.ReactNode }) {
  const [skip] = useState(() => typeof window === "undefined" || !hydrated);
  useEffect(() => {
    hydrated = true;
  }, []);
  return (
    <>
      {!skip && (
        <div aria-hidden className="pointer-events-none fixed inset-0 z-[70]">
          <div className="absolute inset-0 flex">
            {Array.from({ length: COLS }).map((_, i) => (
              <motion.span
                key={`a${i}`}
                className="h-full flex-1 bg-accent"
                initial={{ y: "0%" }}
                animate={{ y: "-100%" }}
                transition={{ duration: 0.85, ease: SHUTTER, delay: 0.12 + i * 0.06 }}
              />
            ))}
          </div>
          <div className="absolute inset-0 flex">
            {Array.from({ length: COLS }).map((_, i) => (
              <motion.span
                key={`n${i}`}
                className="h-full flex-1 bg-night"
                initial={{ y: "0%" }}
                animate={{ y: "-100%" }}
                transition={{ duration: 0.75, ease: SHUTTER, delay: i * 0.06 }}
              />
            ))}
          </div>
        </div>
      )}
      <motion.div
        initial={skip ? false : { opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: skip ? 0 : 0.3 }}
      >
        {children}
      </motion.div>
    </>
  );
}
