"use client";

import { useState, useEffect } from "react";
import { Coins, Gift, AlertCircle, CheckCircle2, Ticket } from "lucide-react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserProfile, UserProfile } from "@/services/userService";
import { getActiveRewards, redeemReward, Reward } from "@/services/rewardService";
import Link from "next/link";

export default function TukarPointPage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [redeemingId, setRedeemingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await loadUserData(currentUser.uid);
      } else {
        setProfile(null);
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const loadUserData = async (uid: string) => {
    try {
      const userProfile = await getUserProfile(uid);
      setProfile(userProfile);
      
      const availableRewards = await getActiveRewards();
      setRewards(availableRewards);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedeem = async (reward: Reward) => {
    if (!user || !profile) return;
    if (profile.pointsBalance < reward.pointsRequired) {
      setMessage({ text: "Points tidak cukup untuk menukarkan voucher ini.", type: "error" });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setRedeemingId(reward.id);
    setMessage(null);
    try {
      await redeemReward(user.uid, reward.id);
      
      setProfile(prev => prev ? { ...prev, pointsBalance: prev.pointsBalance - reward.pointsRequired } : null);
      
      setMessage({ text: `Berhasil menukarkan: ${reward.name}! Cek menu Voucher.`, type: "success" });
    } catch (error: any) {
      setMessage({ text: error.message || "Gagal menukarkan point.", type: "error" });
    } finally {
      setRedeemingId(null);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9B00E8]"></div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="w-full min-h-screen bg-gray-50 pt-24 pb-12 px-6 flex flex-col items-center">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-md text-center">
          <Gift className="w-16 h-16 text-[#9B00E8] mx-auto mb-4 opacity-50" />
          <h1 className="text-2xl font-black text-gray-900 mb-2">Tukar Point</h1>
          <p className="text-gray-500 mb-6">Silakan login terlebih dahulu untuk melihat dan menukarkan Tepi Point kamu.</p>
          <Link href="/login" className="bg-[#9B00E8] text-white px-8 py-3 rounded-full font-bold hover:bg-[#7a00b8] transition-colors">
            Login Sekarang
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-gray-50 py-12">
      <div className="mx-auto max-w-[90%] md:max-w-[85%] lg:max-w-4xl xl:max-w-[85%]">
        <div className="bg-gradient-to-r from-[#2A0054] to-[#9B00E8] rounded-3xl p-8 mb-10 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative z-10 text-center md:text-left">
            <h1 className="text-3xl font-black mb-2">Tukar Tepi Point</h1>
            <p className="text-purple-200">Kumpulkan point setiap transaksi dan tukarkan dengan hadiah menarik!</p>
          </div>
          <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col items-center min-w-[200px]">
            <p className="text-purple-200 text-sm font-semibold mb-1">Point Kamu</p>
            <div className="flex items-center gap-3">
              <Coins className="w-8 h-8 text-yellow-400 drop-shadow-md" />
              <span className="text-4xl font-black">{profile.pointsBalance}</span>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        </div>

        {message && (
          <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-rose-50 text-rose-800 border border-rose-100'}`}>
            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
            <p className="font-semibold text-sm">{message.text}</p>
          </div>
        )}

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Ticket className="w-5 h-5 text-[#9B00E8]" />
            Voucher Tersedia
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.map((reward) => (
              <div key={reward.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-20 h-20 bg-purple-50 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10 flex-grow">
                  <div className="w-12 h-12 bg-[#9B00E8]/10 rounded-2xl flex items-center justify-center mb-4 text-[#9B00E8]">
                    <Gift className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{reward.name}</h3>
                  <p className="text-sm text-gray-500 mb-6 line-clamp-3">{reward.description}</p>
                </div>
                <div className="relative z-10 pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1.5 text-[#9B00E8]">
                    <Coins className="w-5 h-5" />
                    <span className="font-black text-lg">{reward.pointsRequired}</span>
                  </div>
                  <button
                    onClick={() => handleRedeem(reward)}
                    disabled={redeemingId === reward.id || profile.pointsBalance < reward.pointsRequired}
                    className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                      redeemingId === reward.id 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : profile.pointsBalance < reward.pointsRequired
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-[#9B00E8] text-white hover:bg-[#7a00b8] hover:shadow-lg hover:shadow-purple-500/20 active:scale-95'
                    }`}
                  >
                    {redeemingId === reward.id ? 'Memproses...' : 'Tukar'}
                  </button>
                </div>
              </div>
            ))}
            
            {rewards.length === 0 && (
              <div className="col-span-full py-12 text-center">
                <p className="text-gray-500 font-medium">Belum ada voucher yang tersedia saat ini.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
