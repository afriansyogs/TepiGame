"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, X } from "lucide-react";

interface GameOverModalProps {
  finalScore: number;
  highScore: number;
}

export default function GameOverModal({ finalScore, highScore }: GameOverModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-40 flex items-center justify-center"
      style={{
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        backgroundColor: "rgba(10,0,30,0.55)",
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 22, delay: 0.1 }}
        className="relative mx-4 flex w-full max-w-sm flex-col items-center overflow-hidden rounded-3xl bg-white px-8 py-10 shadow-2xl"
      >
        <Link
          href="/"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </Link>

        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 180 }}
          className="mb-4 h-28 w-28 relative"
        >
          <Image
            src="/img/trophy.png"
            alt="Trophy"
            fill
            className="object-contain drop-shadow-xl"
          />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-black text-[#9B00E8] mb-1"
        >
          Good Job!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-gray-500 text-sm font-medium text-center mb-6"
        >
          Kamu Menyelesaikan game dengan sangat hebat
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center gap-1 mb-8"
        >
          <span className="text-gray-700 font-extrabold text-base">Total Point</span>
          <div className="flex items-center gap-2">
            <Image
              src="/img/coin.png"
              alt="coin"
              width={28}
              height={28}
              className="object-contain"
            />
            <span className="text-yellow-500 font-black text-4xl tabular-nums">
              {finalScore}
            </span>
          </div>
          {finalScore >= highScore && highScore > 0 && (
            <span className="text-xs font-bold text-purple-500 mt-1">
              🎉 New High Score!
            </span>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full"
        >
          <Link
            href="/"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#CE79FF] py-4 font-extrabold text-white text-base shadow-lg shadow-pink-500/30 hover:bg-[#A144D7] transition-colors active:scale-[0.98]"
          >
            <Home className="h-5 w-5" />
            Kembali Ke Beranda
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
