"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Pause, Home, Play } from "lucide-react";

interface TopHudProps {
  gameState: string;
  timeDisplay: number;
  scoreDisplay: number;
  highScore: number;
  gameDuration: number;
  pauseGame: () => void;
  resumeGame: () => void;
  formatTime: (s: number) => string;
}

export default function TopHud({
  gameState,
  timeDisplay,
  scoreDisplay,
  highScore,
  gameDuration,
  pauseGame,
  resumeGame,
  formatTime,
}: TopHudProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="absolute top-0 left-0 right-0 z-20 flex items-start justify-between px-4 pt-4">
      <div className="relative">
        <button
          id="menu-btn"
          onClick={() => {
            if (gameState === "PLAYING") pauseGame();
            setMenuOpen((v) => !v);
          }}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md border border-white/20 text-white hover:bg-white/25 transition-colors"
          aria-label="Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -8 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 top-14 z-30 min-w-[180px] overflow-hidden rounded-2xl border border-white/20 bg-[#1a0040]/90 backdrop-blur-xl shadow-2xl"
            >
              <button
                onClick={() => {
                  if (gameState === "PAUSED") resumeGame();
                  else pauseGame();
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-3 px-5 py-4 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                {gameState === "PAUSED" ? (
                  <>
                    <Play className="h-4 w-4 text-purple-400" /> Resume
                  </>
                ) : (
                  <>
                    <Pause className="h-4 w-4 text-yellow-400" /> Pause
                  </>
                )}
              </button>
              <div className="h-px bg-white/10" />
              <Link
                href="/"
                className="flex w-full items-center gap-3 px-5 py-4 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                <Home className="h-4 w-4 text-blue-400" /> Beranda
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col items-center mt-5">
        <div className="w-32 md:w-48 h-2 bg-white/20 rounded-full overflow-hidden mb-2 relative shadow-[0_0_10px_rgba(155,0,232,0.5)]">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-black transition-all duration-1000 ease-linear"
            style={{ width: `${(timeDisplay / gameDuration) * 100}%` }}
          />
        </div>
        <span className="text-white/90 text-sm font-black tabular-nums shadow-black drop-shadow-md mb-1">
          {formatTime(timeDisplay)}
        </span>

        <div className="flex items-center gap-1.5 mt-0.5">
          <Image
            src="/img/coin.png"
            alt="coin"
            width={24}
            height={24}
            className="object-contain"
          />
          <span className="text-yellow-400 font-black text-3xl tabular-nums leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {scoreDisplay}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end">
        <div className="rounded-xl bg-white/10 backdrop-blur border border-white/20 px-3 py-2 text-right">
          <span className="block text-[10px] font-extrabold uppercase tracking-widest text-yellow-400">
            High Score
          </span>
          <span className="block text-white font-black text-lg tabular-nums leading-tight">
            {highScore}
          </span>
        </div>
      </div>
    </div>
  );
}
