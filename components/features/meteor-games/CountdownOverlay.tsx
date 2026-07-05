"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CountdownOverlayProps {
  countdown: number;
}

export default function CountdownOverlay({ countdown }: CountdownOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <motion.div className="flex flex-col items-center gap-4">
        <span className="text-white/70 text-lg font-bold tracking-widest uppercase">
          Get Ready!
        </span>
        <AnimatePresence mode="wait">
          <motion.span
            key={countdown}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            exit={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="text-white font-black text-[120px] leading-none drop-shadow-[0_0_40px_rgba(155,0,232,0.9)]"
            style={{ textShadow: "0 0 60px #9B00E8" }}
          >
            {countdown}
          </motion.span>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
