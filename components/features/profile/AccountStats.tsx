"use client";

import React from "react";
import { Coins, Trophy } from "lucide-react";

interface AccountStatsProps {
  pointsBalance: number;
  lifetimePoints: number;
  meteorHighScore: number;
}

export default function AccountStats({
  pointsBalance,
  lifetimePoints,
  meteorHighScore
}: AccountStatsProps) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-lg font-bold text-gray-900 mb-5">Statistik Akun</h2>
      
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between p-4 bg-purple-50 rounded-2xl border border-purple-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center text-[#9B00E8]">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Tepi Point</p>
              <p className="text-lg font-black text-[#9B00E8]">{pointsBalance}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-amber-50 rounded-2xl border border-amber-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-600">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Akumulasi</p>
              <p className="text-lg font-black text-amber-700">{lifetimePoints}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-blue-50/70 rounded-2xl border border-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center text-blue-600">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">High Score Game</p>
              <p className="text-lg font-black text-blue-700">{meteorHighScore}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
