"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Pause, Play, Home } from "lucide-react";

interface PauseMenuProps {
  resumeGame: () => void;
}

export default function PauseMenu({ resumeGame }: PauseMenuProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-25 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center gap-6 rounded-3xl border border-white/20 bg-[#1a0040]/80 p-10 shadow-2xl">
        <Pause className="h-12 w-12 text-purple-400" />
        <h2 className="text-white font-black text-3xl">Paused</h2>
        <button
          onClick={resumeGame}
          className="flex items-center gap-2 rounded-full bg-[#9B00E8] px-8 py-3 font-bold text-white hover:bg-[#8500c7] transition-colors shadow-lg shadow-purple-900/40"
        >
          <Play className="h-5 w-5" /> Resume
        </button>
        <Link
          href="/"
          className="flex items-center gap-2 bg-white px-8 py-3 rounded-full hover:bg-gray-100 cursor-pointer text-black font-semibold transition-colors"
        >
          <Home className="h-5 w-5 mr-2" /> Home
        </Link>
      </div>
    </motion.div>
  );
}
