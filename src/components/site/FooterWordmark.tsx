"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/** Giant lime wordmark that rises out of the footer floor as you reach the end. */
export default function FooterWordmark({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, (v) => `${(1 - Math.min(1, v)) * 60}%`);
  return (
    <div ref={ref} className="overflow-hidden">
      <motion.p aria-hidden style={{ y }} className="display select-none whitespace-nowrap text-center text-[23vw] !leading-[0.78] text-accent">
        {text}
      </motion.p>
    </div>
  );
}
