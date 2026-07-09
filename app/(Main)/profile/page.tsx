"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserProfile, UserProfile } from "@/services/userService";
import { getUserVouchers, Voucher } from "@/services/rewardService";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User as UserIcon, 
  CreditCard, 
  ChevronRight, 
  Loader2
} from "lucide-react";
import ProfileHeader from "@/components/features/profile/ProfileHeader";
import AccountStats from "@/components/features/profile/AccountStats";
import ContactInfo from "@/components/features/profile/ContactInfo";
import VoucherList from "@/components/features/profile/VoucherList";
import EditProfileModal from "@/components/features/profile/EditProfileModal";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showToast = (text: string, type: "success" | "error") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userProfile = await getUserProfile(currentUser.uid);
          setProfile(userProfile);
          const userVouchers = await getUserVouchers(currentUser.uid);
          setVouchers(userVouchers);
        } catch (error) {
          console.error("Failed to load user data:", error);
          showToast("Gagal memuat data profil.", "error");
        } finally {
          setIsLoading(false);
        }
      } else {
        setProfile(null);
        setVouchers([]);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleUpdateSuccess = (name: string, phone: string | null) => {
    setProfile(prev => prev ? { ...prev, displayName: name, phoneNumber: phone } : null);
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-[#9B00E8] animate-spin" />
          <p className="text-gray-500 font-medium">Memuat profil...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="w-full min-h-screen bg-gray-50 pt-28 pb-12 px-6 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-md text-center">
          <div className="w-16 h-16 bg-[#9B00E8]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#9B00E8]">
            <UserIcon className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Akses Terbatas</h1>
          <p className="text-gray-500 mb-6">Kamu perlu login terlebih dahulu untuk mengakses halaman profil ini.</p>
          <Link href="/login" className="inline-block bg-[#9B00E8] text-white px-8 py-3 rounded-full font-bold hover:bg-[#8500c7] hover:shadow-lg hover:shadow-purple-500/20 active:scale-95 transition-all">
            Login Sekarang
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-gray-50 pt-10 md:pt-12 pb-16">
      <div className="mx-auto max-w-[90%] md:max-w-[85%] lg:max-w-5xl">
        
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-24 left-1/2 -translate-x-1/2 z-[110] px-6 py-3 rounded-full shadow-lg font-bold text-sm flex items-center gap-2 ${
                toastMessage.type === "success" 
                  ? "bg-emerald-600 text-white" 
                  : "bg-rose-600 text-white"
              }`}
            >
              <span>{toastMessage.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <ProfileHeader 
          displayName={profile.displayName}
          photoURL={profile.photoURL}
          role={profile.role}
          createdAt={profile.createdAt}
          onEditClick={() => setIsEditModalOpen(true)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 flex flex-col gap-6">
            <AccountStats 
              pointsBalance={profile.pointsBalance}
              lifetimePoints={profile.lifetimePoints}
              meteorHighScore={profile.meteorGameHighScore || 0}
            />
            <ContactInfo 
              email={profile.email}
              phoneNumber={profile.phoneNumber}
            />
            <Link 
              href="/transactions" 
              className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#9B00E8]/10 text-[#9B00E8] rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 duration-300">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Riwayat Transaksi</h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">Lihat seluruh transaksi top-up kamu</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#9B00E8] transition-colors" />
            </Link>
          </div>

          <div className="lg:col-span-2">
            <VoucherList 
              vouchers={vouchers} 
              onCopySuccess={(msg) => showToast(msg, "success")} 
            />
          </div>
        </div>
      </div>

      <EditProfileModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        uid={user.uid}
        initialName={profile.displayName || ""}
        initialPhone={profile.phoneNumber || ""}
        onUpdateSuccess={handleUpdateSuccess}
        onShowToast={showToast}
      />
    </div>
  );
}
